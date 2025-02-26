import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtRefreshverification } from "@/middlewares/Auth/validateRefreshToken";

export async function POST(req: NextRequest, res: NextResponse) {
  let valid = await jwtRefreshverification(req);

  if (valid.status === 200) {
    return NextResponse.json({ accessToken: valid.accessToken });
  }
  return NextResponse.json(
    { message: valid.message },
    { status: valid.status }
  );
}
