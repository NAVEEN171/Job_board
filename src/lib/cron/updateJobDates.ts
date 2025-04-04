// /lib/cron/updateJobDates.ts
import cron from "node-cron";
import { MongoClient, ObjectId } from "mongodb";
import { format, subDays } from "date-fns";
import ConnectToDB from "@/utils/connections/mongoose";

// Track if the job is already running to prevent overlaps
let isJobRunning = false;

// Function to update job dates
async function updateJobDates() {
  // Skip if the job is already running
  if (isJobRunning) {
    console.log("Job update already in progress, skipping");
    return;
  }

  isJobRunning = true;
  console.log("Starting job dates update task:", new Date().toISOString());

  try {
    // Establish database connection
    let dbConn = await ConnectToDB();
    if (!dbConn) {
      console.error("Couldn't connect to DB");
      isJobRunning = false;
      return;
    }

    // Get the jobs collection
    const jobsCollection = dbConn.connection.collection("jobs");

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
      console.log("No jobs found to update");
      isJobRunning = false;
      return;
    }

    // Perform bulk write to update date_posted field
    const result = await jobsCollection.bulkWrite(bulkWriteOperations);

    console.log({
      message: "Date posted updated successfully",
      modifiedCount: result.modifiedCount,
      totalJobs: allJobIds.length,
      datesUsed: {
        currentDate: currentDateFormatted,
        previousDate: previousDateFormatted,
      },
    });
  } catch (error) {
    console.error("Error updating date_posted field:", error);
  } finally {
    isJobRunning = false;
  }
}

// Initialize the cron job
export function initUpdateJobDatesCron() {
  // Run daily at midnight - adjust schedule as needed
  return cron.schedule("0 0 * * *", updateJobDates, {
    scheduled: true,
    timezone: "UTC",
  });
}
