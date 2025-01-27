import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken } from "./generateToken";

interface ResponseMessage {
  message: string;
  status?: number;
  accessToken?: string;
}

export async function jwtRefreshverification(
  req: NextRequest
): Promise<ResponseMessage> {
  console.log("I am running up");
  try {
    const body = await req.json();
    const Token = body.refreshToken;
    console.log(Token);

    if (!Token) {
      return { message: "Token is missing", status: 403 };
    }

    const validate = jwt.verify(
      Token,
      process.env.JWT_REFRESH_TOKEN!
    ) as JwtPayload;

    (req as any).user = validate;
    console.log(validate);
    let accessToken;
    if (validate.user) {
      accessToken = await generateToken(validate.user);
    }

    return {
      message: "Token is valid",
      accessToken,

      status: 200,
    };
  } catch (err: any) {
    console.log("token is expired");
    if (err instanceof jwt.TokenExpiredError) {
      return {
        message: "Token has expired",
        status: 401,
      };
    }
    return {
      message: "Invalid token",
      status: 403,
    };
  }
}
