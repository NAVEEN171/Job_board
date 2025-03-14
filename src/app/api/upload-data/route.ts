import { NextRequest, NextResponse } from "next/server";
import ConnectToDB from "@/utils/connections/mongoose";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // Path to the JSON file
    const filePath = path.join("E:\\", "jobs_result.json");

    // Read the JSON file
    const fileData = fs.readFileSync(filePath, "utf8");
    const jobs = JSON.parse(fileData);

    // Connect to database
    const dbConn = await ConnectToDB();
    const jobsCollection = dbConn?.connection.collection("jobs");

    // Insert all jobs in batches of 100
    const batchSize = 100;
    let insertedTotal = 0;
    let batchCount = 0;

    for (let i = 0; i < jobs.length; i += batchSize) {
      batchCount++;
      // Get the current batch of jobs (up to 100)
      const batch = jobs.slice(i, i + batchSize);

      // Insert the batch
      const result = await jobsCollection?.insertMany(batch);
      const batchInserted = result?.insertedCount || 0;
      insertedTotal += batchInserted;

      console.log(
        `Batch ${batchCount}: Inserted ${batchInserted} jobs. Total: ${insertedTotal}/${jobs.length}`
      );
    }

    // Return results
    return NextResponse.json({
      message: "All jobs processed successfully",
      totalJobs: jobs.length,
      totalInserted: insertedTotal,
      batches: batchCount,
      firstBatch: jobs.slice(0, 100), // Return first 100 jobs in response
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
