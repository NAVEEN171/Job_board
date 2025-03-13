import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "@/utils/connections/mongoose";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = await params.id;
    if (!jobId) {
      return NextResponse.json(
        {
          message: "Job Id is empty",
        },
        { status: 400 }
      );
    }
    const dbConn = await ConnectToDB();
    const jobsCollection = dbConn?.connection.collection("jobs");
    let exisitingJob = await jobsCollection?.findOne({
      _id: new ObjectId(jobId),
    });
    if (!exisitingJob) {
      return NextResponse.json(
        {
          message: "Couldn't find the job you are looking for ",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      job: exisitingJob,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
