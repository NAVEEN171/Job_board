import ConnectToDB from "@/utils/connections/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = await params.id;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!jobId || !userId) {
      return NextResponse.json(
        {
          message: "Job is not found",
        },
        { status: 401 }
      );
    }
    const dbConn = await ConnectToDB();
    let jobsCollection = await dbConn?.connection.collection("jobs");
    const jobExists = await jobsCollection?.findOne({
      _id: new ObjectId(jobId),
    });

    if (!jobExists) {
      return NextResponse.json(
        {
          message: "Job not found",
        },
        { status: 404 }
      );
    }
    const usersCollection = await dbConn?.connection.collection("users");
    const user = await usersCollection?.findOne({
      _id: new ObjectId(userId),
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const savedJobs = user.savedJobs || [];
    const jobIdStr = jobId;
    const isJobSaved = savedJobs.some(
      (savedJobId: string) => savedJobId === jobIdStr
    );
    let result;

    if (isJobSaved) {
      result = await usersCollection?.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { savedJobs: { $eq: jobId } } as any }
      );
      return NextResponse.json({
        message: "Job removed from saved jobs",
        saved: false,
      });
    } else {
      result = await usersCollection?.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { savedJobs: jobId } }
      );
      return NextResponse.json({
        message: "Job added to saved jobs",
        saved: true,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
