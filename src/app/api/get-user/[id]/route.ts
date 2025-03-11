import ConnectToDB from "@/utils/connections/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await params.id;
    if (!userId) {
      return NextResponse.json(
        {
          message: "userId is null",
        },
        { status: 401 }
      );
    }
    const dbConn = await ConnectToDB();
    let usersCollection = await dbConn?.connection.collection("users");
    let existinguser = await usersCollection?.findOne({
      _id: new ObjectId(userId),
    });
    if (!existinguser) {
      return NextResponse.json(
        {
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    await delete existinguser.password;
    return NextResponse.json({
      user: existinguser,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
