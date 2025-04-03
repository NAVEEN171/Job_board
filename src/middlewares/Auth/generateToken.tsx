import jwt, { JwtPayload } from "jsonwebtoken";

export async function generateToken(user: any) {
  return jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN!, {
    expiresIn: "15m",
  });
}
