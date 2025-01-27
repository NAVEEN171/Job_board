"use server";
import ConnectToDB from "../../../utils/connections/mongoose";
import mongoose from "mongoose";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtverification } from "@/middlewares/Auth/validateToken";

export async function POST(req: NextRequest, res: NextResponse) {
  // const body = await req.json();

  let verified = await jwtverification(req);

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
  if (verified.status === 200) {
    return NextResponse.json({ posts: posts });
  }
  if (verified) {
    return NextResponse.json(
      {
        message: verified.message,
      },
      { status: verified.status }
    );
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
