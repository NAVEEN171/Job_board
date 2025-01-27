import { verifyAndConsumeToken } from "@/middlewares/Auth/generateCryptotoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = await params;
    const userData = await verifyAndConsumeToken(token);
    console.log(userData);

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 400 }
    );
  }
}
