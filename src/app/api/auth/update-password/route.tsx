import ConnectToDB from "@/utils/connections/mongoose";
import redisClient, { connecttoRedis } from "@/utils/redisconnection/redis";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  console.log(body);

  const { password, token } = body;
  let hashedpassword = await bcrypt.hash(password, 10);

  const tokenKey = `verifypasstoken:${token}`;
  try {
    const redisConn = await connecttoRedis();
    const dbConn = await ConnectToDB();
    if (!redisConn || !dbConn) {
      return NextResponse.json(
        {
          message: "something went wrong !  try again after some time",
        },
        {
          status: 500,
        }
      );
    }
    const userscollection = dbConn.connection.collection("users");
    const exist = await redisClient.exists(tokenKey);
    if (!exist) {
      //dont change it change if needed do chnage in reset-password too
      return NextResponse.json(
        {
          message: "Your token has expired ! please re-enter your email ",
        },
        {
          status: 404,
        }
      );
    }
    let email = await redisClient.get(tokenKey);
    await redisClient.del(tokenKey);
    let emailkey = `emailpassverify:${email}`;
    await redisClient.del(emailkey);

    const updatedPass = await userscollection.findOneAndUpdate(
      { email },
      { $set: { password: hashedpassword } },
      { returnDocument: "after" }
    );
    return NextResponse.json(
      {
        message: "Successfully updated Password !",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "something went wrong! try again after some time",
      },
      {
        status: 500,
      }
    );
  }
}
