import { NextResponse, NextRequest } from "next/server";
import { IoBodyOutline } from "react-icons/io5";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await res.json();
  const { password, token } = body;
  const tokenKey = `verifypasstoken:${token}`;
}
