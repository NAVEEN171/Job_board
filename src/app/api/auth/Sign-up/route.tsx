import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "../../../../utils/connections/mongoose";
import { Collection } from "mongoose";
import bcrypt from "bcrypt";

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
      const insertPerson = await userscollection.insertOne({
        username,
        email,
        password: hashedpassword,
        provider: "manual",
        profilephoto: "",
      });
      console.log(insertPerson);
      const insertedUser = {
        username,
        email,
        provider: "manual",
        profilephoto: "",
      };
      if (insertPerson.acknowledged) {
        exisitinguser = await userscollection.findOne({ email: email });
        if (exisitinguser) {
          delete exisitinguser.password;
          return NextResponse.json({ user: exisitinguser }, { status: 200 });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
