"use server";
import ConnectToDB from "../../../utils/connections/mongoose";
import mongoose from "mongoose";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ResponseMessage {
  message: string;
  status?: number;
}
export async function jwtverification(req: NextRequest, res: NextResponse) {
  console.log("I am running up");
  try {
    const authHeader = req.headers.get("authorization");
    let token;

    if (!authHeader) {
      return new NextResponse(
        JSON.stringify({
          message: "authorization code is missing",
        } as ResponseMessage),
        {
          status: 200,
        }
      );
    }

    token = authHeader.split(" ")[1];

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Token is missing" } as ResponseMessage),
        {
          status: 403,
        }
      );
    }

    console.log(token);

    // Synchronously verify the token
    const validate = jwt.verify(token, process.env.JWT_ACCESS_TOKEN!);

    // Attach user data to the request object
    (req as any).user = validate;

    // Continue with your request handling (e.g., return true if everything is okay)
    return new NextResponse(
      JSON.stringify({ message: "Token is valid" } as ResponseMessage),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    // Handle token expiration or any other error

    // Handle any other type of JWT verification error
    return new NextResponse(
      JSON.stringify({ message: "Token is expired" } as ResponseMessage),
      {
        status: 403,
      }
    );
  }
}
export async function POST(req: NextRequest, res: NextResponse) {
  // const body = await req.json();

  let verified = await jwtverification(req, res);

  type poststype = {
    name: string;
    post: string;
  };
  const posts: poststype[] = [
    {
      name: "jim",
      post: "post1",
    },
    {
      name: "dov",
      post: "post2",
    },
  ];
  if (verified.ok) {
    return NextResponse.json({ posts: posts });
  }
  let verifiedJson = await verified.json();
  if (verified) {
    return NextResponse.json({
      message: verifiedJson?.message,
      status: verifiedJson?.status,
    });
  }

  // const params: any = {};

  // const { title, category, locationType, industry, Experience, days, Salary } =
  //   body;
  // console.log("title is :");
  // if (days && typeof days === "number") {
  //   params["days"] = days;
  // }
  // if (Salary && Salary.length > 0) {
  //   params["salaryFrom"] = Salary[0];
  //   params["salaryTo"] = Salary[1];
  // }
  // if (Experience && Experience.length > 0) {
  //   params["yearsFrom"] = Experience[0];
  //   params["yearsTo"] = Experience[1];
  // }
  // if (title && title.length > 0) {
  //   params["title"] = title;
  // }
  // if (category && category.length > 0) {
  //   params["category"] = category;
  // }
  // if (locationType && locationType.length > 0) {
  //   params["locationType"] = locationType;
  // }
  // if (industry && industry.length > 0) {
  //   params["industry"] = industry;
  // }
  // params["limit"] = 100;
  // console.log(params);

  // const response = await axios.get("https://data.hirebase.org/v0/jobs", {
  //   params: params,
  //   paramsSerializer: {
  //     indexes: null,
  //   },
  // });

  // if (response.data) {
  //   return Response.json(response.data);
  // }

  // return Response.json({ message: "failed" });
}
