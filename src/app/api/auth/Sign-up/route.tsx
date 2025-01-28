import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "../../../../utils/connections/mongoose";
import { Collection } from "mongoose";
import bcrypt from "bcrypt";
import { sendMagicLink } from "@/utils/sendMagicLink/send-magicLink";
import {
  generateToken,
  storeToken,
} from "@/middlewares/Auth/generateCryptotoken";
import redisClient from "@/utils/redisconnection/redis";
import { connecttoRedis } from "@/utils/redisconnection/redis";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { email, username, password, confirmpassword } = body;
  const dbConn = await ConnectToDB();
  console.log("connected toDB");
  try {
    let data;
    if (!email || !username || !password || !confirmpassword) {
      return NextResponse.json(
        { message: "some fields are empty" },
        { status: 400 }
      );
    }
    let hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);
    let exisitinguser;
    if (dbConn) {
      const userscollection = await dbConn.connection.collection("users");
      exisitinguser = await userscollection.findOne({ email: email });
      console.log(exisitinguser);
      if (exisitinguser) {
        return NextResponse.json(
          { message: "email already exists" },
          { status: 400 }
        );
      }
      //redis need to be added here to check whether email is already sent
      let emailKey = `email:${email}`;
      let redisConn = await connecttoRedis();
      if (!redisConn) {
        return NextResponse.json(
          {
            message: "some thing went wrong ! Try again",
          },
          { status: 500 }
        );
      }
      const exists = await redisClient.exists(emailKey);
      if (exists) {
        return NextResponse.json(
          {
            message:
              "verification email 📧  has been already sent to your inbox",
          },
          { status: 500 }
        );
      }

      const insertedUser = {
        username,
        email,
        provider: "manual",
        profilephoto: "",
        password: hashedpassword,
      };

      const token = await generateToken();

      let storedToken;
      let sentemail;

      if (token) {
        storedToken = await storeToken(token, insertedUser);
        sentemail = await sendMagicLink(token, email);
      }
      if (sentemail) {
        await redisClient.setEx(emailKey, 60 * 15, email);

        return NextResponse.json(
          {
            message:
              "An email 📧  has been sent to your inbox. Please verify it.",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          message: "something went wrong. Please signup  again.",
        },
        { status: 401 }
      );

      // const insertPerson = await userscollection.insertOne({
      //   username,
      //   email,
      //   password: hashedpassword,
      //   provider: "manual",
      //   profilephoto: "",
      // });
      // console.log(insertPerson);

      // if (insertPerson.acknowledged) {
      //   exisitinguser = await userscollection.findOne({ email: email });
      //   if (exisitinguser) {
      //     delete exisitinguser.password;
      //     return NextResponse.json({ user: exisitinguser }, { status: 200 });
      //   }
      // }
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "something went wrong. Please signup  again.",
      },
      { status: 401 }
    );
  }
}
