import ConnectToDB from "@/utils/connections/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await params.id;

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    const dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        { message: "Couldn't connect to DB" },
        { status: 500 }
      );
    }

    const usersCollection = await dbConn.connection.collection("users");
    const user = await usersCollection.findOne({
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

    const savedJobIds = user.savedJobs || [];

    if (savedJobIds.length === 0) {
      return NextResponse.json({
        savedJobs: [],
        count: 0,
      });
    }

    // Convert all job IDs to ObjectId (if they aren't already)
    const objectIdJobIds = savedJobIds.map((id: string | ObjectId) =>
      typeof id === "string" ? new ObjectId(id) : id
    );

    // Find all jobs with IDs in the savedJobs array
    const jobsCollection = await dbConn.connection.collection("jobs");
    const savedJobs = await jobsCollection
      .find({
        _id: { $in: objectIdJobIds },
      })
      .toArray();

    return NextResponse.json({
      savedJobs: savedJobs,
      count: savedJobs.length,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
