import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDB from "@/utils/connections/mongoose";
import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Establish database connection
    let dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        { message: "couldnt connect to DB" },
        { status: 500 }
      );
    }

    // Get the jobs collection
    const jobsCollection = await dbConn.connection.collection("jobs");

    // Fetch all jobs
    const allJobs = await jobsCollection.find({}).toArray();

    // Prepare bulk write operations
    const bulkWriteOperations = allJobs.map((job, index) => {
      // Alternate between today and yesterday's date
      const datePosted =
        index % 2 === 0
          ? "2025-03-10" // Today's date
          : "2023-02-09"; // Yesterday's date

      return {
        updateOne: {
          filter: { _id: job._id },
          update: { $set: { date_posted: datePosted } },
        },
      };
    });

    // Perform bulk write to update dates
    const result = await jobsCollection.bulkWrite(bulkWriteOperations);

    return Response.json(
      {
        message: "Job dates updated successfully",
        modifiedCount: result.modifiedCount,
        totalJobs: allJobs.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job dates:", error);
    return Response.json(
      {
        message: "Failed to update job dates",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
