import { NextResponse, NextRequest } from "next/server";
import ConnectToDB from "@/utils/connections/mongoose";
import { format, subDays } from "date-fns";

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

    // Get current date and previous day in yyyy-MM-dd format
    const currentDate = new Date();
    const currentDateFormatted = format(currentDate, "yyyy-MM-dd");
    const previousDateFormatted = format(subDays(currentDate, 1), "yyyy-MM-dd");

    // Prepare bulk write operations to update date_posted field
    const bulkWriteOperations = allJobIds.map((job) => {
      // Randomly choose between current date and previous date
      const randomDate =
        Math.random() < 0.5 ? previousDateFormatted : currentDateFormatted;

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
        datesUsed: {
          currentDate: currentDateFormatted,
          previousDate: previousDateFormatted,
        },
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
