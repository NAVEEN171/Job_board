// Add to your database connection file or create a new setup file

import ConnectToDB from "@/utils/connections/mongoose";

export async function setupDatabaseIndexes() {
  try {
    const dbConn = await ConnectToDB();

    const jobsCollection = dbConn?.connection?.collection("jobs");

    // Create single field indexes
    await jobsCollection?.createIndex({
      job_title: "text",
      description: "text",
    });
    await jobsCollection?.createIndex({ date_posted: -1 });
    await jobsCollection?.createIndex({ visa_sponsored: 1 });
    await jobsCollection?.createIndex({ location_raw: 1 });

    // Create compound indexes
    await jobsCollection?.createIndex({
      "salary_range.min": 1,
      "salary_range.max": 1,
    });
    await jobsCollection?.createIndex({
      "yoe_range.min": 1,
      "yoe_range.max": 1,
    });

    // Create array field indexes
    await jobsCollection?.createIndex({ "locations.country": 1 });
    await jobsCollection?.createIndex({ "locations.city": 1 });
    await jobsCollection?.createIndex({ job_categories: 1 });
    await jobsCollection?.createIndex({ "company_data.industries": 1 });
    await jobsCollection?.createIndex({ "company_data.subindustries": 1 });
    await jobsCollection?.createIndex({ location_type: 1 });

    console.log("Database indexes set up successfully");
  } catch (error) {
    console.error("Error setting up database indexes:", error);
  }
}

// Call this after establishing your connection
