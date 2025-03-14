import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

NextRequest;
interface ResponseMessage {
  message: string;
  status?: number;
  accessToken?: string;
}

export async function jwtverification(
  req: NextRequest
): Promise<ResponseMessage> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return {
        message: "Authorization header missing",
        status: 401,
      };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        message: "Invalid authorization format",
        status: 401,
      };
    }

    const validated = jwt.verify(token, process.env.JWT_ACCESS_TOKEN!);
    (req as any).user = validated;

    return {
      message: "Token is valid",
      status: 200,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        message: "Token has expired",
        status: 403,
      };
    }
    return {
      message: "Invalid token",
      status: 401,
    };
  }
}
