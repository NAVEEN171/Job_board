import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "../../../../utils/connections/mongoose";
import { Collection } from "mongoose";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { email, password } = body;
  const dbConn = await ConnectToDB();
  try {
    let data;
    if (!email || !password) {
      return NextResponse.json(
        { message: "some fields are empty" },
        { status: 400 }
      );
    }
    if (dbConn) {
      const userscollection = await dbConn.connection.collection("users");
      const exisitinguser = await userscollection.findOne({ email: email });
      if (!exisitinguser) {
        return NextResponse.json(
          { message: "email is not registered! signup instead" },
          { status: 401 }
        );
      }
      if (exisitinguser.provider === "google") {
        return NextResponse.json(
          { message: "Please Login with google" },
          { status: 400 }
        );
      }
      if (exisitinguser) {
        const isMatch = await bcrypt.compare(password, exisitinguser.password);
        if (isMatch) {
          await delete exisitinguser.password;

          return NextResponse.json({ user: exisitinguser }, { status: 200 });
        } else {
          return NextResponse.json(
            { message: "credentials are incorrect" },
            { status: 401 }
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
