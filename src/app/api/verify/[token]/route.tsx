import { verifyAndConsumeToken } from "@/middlewares/Auth/generateCryptotoken";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/middlewares/Auth/generateToken";
import jwt from "jsonwebtoken";

interface userData {
  username: string;
  profilephoto: string;
  provider: string;
  email: string;
  password: string;
}
interface returnType {
  message: string;
  valid: boolean;
  user?: userData;
}
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = await params;
    const userData = await verifyAndConsumeToken(token);
    if (userData && userData.valid && userData.user) {
      const accessToken = await generateToken(userData.user);
      const refreshToken = await jwt.sign(
        { user: userData.user },
        process.env.JWT_REFRESH_TOKEN!
      );
      userData.user.accessToken = accessToken;
      userData.user.refreshToken = refreshToken;

      console.log(userData);
      return NextResponse.json(
        { message: "succesfully verified", data: userData.user },
        { status: 200 }
      );
    }
    if (userData && !userData.valid) {
      return NextResponse.json({ message: userData.message }, { status: 403 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
