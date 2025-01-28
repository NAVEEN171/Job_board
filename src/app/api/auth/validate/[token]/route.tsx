import { connecttoRedis } from "@/utils/redisconnection/redis";
import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/utils/redisconnection/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = await params;
  if (!token) {
    NextResponse.json(
      {
        message: "token is invalid",
      },
      { status: 403 }
    );
  }
  try {
    const redisConn = await connecttoRedis();
    let verifypassKey = `verifypasstoken:${token}`;
    if (redisConn) {
      let exists = await redisClient.exists(verifypassKey);
      if (exists) {
        return NextResponse.json(
          {
            message: "validation is successfull ! you can reset password now",
          },
          {
            status: 200,
          }
        );
      }
      return NextResponse.json(
        {
          message: "your token has expired! go to forgot password again",
        },
        {
          status: 400,
        }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "your token is invalid! go to forgot password again ",
      },
      {
        status: 400,
      }
    );
  }
}
