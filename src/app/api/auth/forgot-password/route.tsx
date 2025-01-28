import { generateToken } from "@/middlewares/Auth/generateCryptotoken";
import ConnectToDB from "@/utils/connections/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { passwordResetMail } from "@/utils/passwordResetmail/passwordReset";
import { connecttoRedis } from "@/utils/redisconnection/redis";
import redisClient from "@/utils/redisconnection/redis";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email.trim().length && !email.includes("a")) {
      return NextResponse.json(
        {
          message: "enter a valid email",
        },
        {
          status: 400,
        }
      );
    }
    const dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        {
          message: "something went wrong",
        },
        {
          status: 500,
        }
      );
    }
    const userscollection = await dbConn.connection.collection("users");
    const exisitinguser = await userscollection.findOne({ email: email });

    if (!exisitinguser) {
      return NextResponse.json(
        {
          message: "Email is not registered! Signup instead",
        },
        {
          status: 404,
        }
      );
    }
    if (exisitinguser.provider === "google") {
      return NextResponse.json(
        {
          message: "Login with google",
        },
        {
          status: 403,
        }
      );
    }
    const token = await generateToken();
    console.log("token");
    let sendmail;
    if (token) {
      sendmail = await passwordResetMail(token, email);
    }
    if (sendmail) {
      let verifypassKey = `emailpassverify:${email}`;
      let redisConn = await connecttoRedis();
      if (redisConn) {
        let exists = await redisClient.exists(verifypassKey);
        if (exists) {
          return NextResponse.json(
            {
              message: " password reset email is already sent to your inbox",
            },
            {
              status: 403,
            }
          );
        }
        await redisClient.setEx(verifypassKey, 15 * 60, token);
        const storetoken = await redisClient.exists(verifypassKey);
        if (storetoken) {
          let verifypassToken = `verifypasstoken:${token}`;
          await redisClient.setEx(verifypassToken, 15 * 60, email);
        }

        return NextResponse.json(
          {
            message: "password reset mail is sent to your inbox",
          },
          {
            status: 200,
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "some thing went wrong !please try again",
      },
      {
        status: 500,
      }
    );
  }
}
