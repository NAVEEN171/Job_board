import { NextResponse, NextRequest } from "next/server";
import ConnectToDB from "@/utils/connections/mongoose";

export async function POST(req: NextRequest) {
  try {
    // Establish database connection
    let dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        { message: "Couldn't connect to DB" },
        { status: 500 }
      );
    }

    // Get the jobs collection
    const jobsCollection = await dbConn.connection.collection("jobs");

    // Fetch all job IDs
    const allJobIds = await jobsCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();

    // Prepare bulk write operations to update date_posted field
    const bulkWriteOperations = allJobIds.map((job) => {
      // Randomly choose between the two dates
      const randomDate = Math.random() < 0.5 ? "2025-03-13" : "2025-03-14";

      return {
        updateOne: {
          filter: { _id: job._id },
          update: { $set: { date_posted: randomDate } },
          upsert: false,
        },
      };
    });

    // Check if there are any operations to perform
    if (bulkWriteOperations.length === 0) {
      return NextResponse.json(
        { message: "No jobs found to update" },
        { status: 200 }
      );
    }

    // Perform bulk write to update date_posted field
    const result = await jobsCollection.bulkWrite(bulkWriteOperations);

    return NextResponse.json(
      {
        message: "Date posted updated successfully",
        modifiedCount: result.modifiedCount,
        totalJobs: allJobIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating date_posted field:", error);
    return NextResponse.json(
      {
        message: "Failed to update date_posted field",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
