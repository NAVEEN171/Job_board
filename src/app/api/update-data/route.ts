import { NextApiRequest, NextApiResponse } from "next";
import ConnectToDB from "@/utils/connections/mongoose";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Establish database connection
    let dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        { message: "Couldn't connect to DB" },
        { status: 500 }
      );
    }

    // Get the users collection
    const usersCollection = await dbConn.connection.collection("users");

    // Fetch all user documents
    const allUsers = await usersCollection.find({}).toArray();

    // Prepare bulk write operations to add savedJobs field to each document
    const bulkWriteOperations = allUsers.map((user) => {
      return {
        updateOne: {
          filter: { _id: user._id }, // Filter by document ID
          update: { $set: { savedJobs: [] } }, // Add empty savedJobs array
          upsert: false, // Don't create new documents if they don't exist
        },
      };
    });

    // Check if there are any operations to perform
    if (bulkWriteOperations.length === 0) {
      return NextResponse.json(
        { message: "No users found to update" },
        { status: 200 }
      );
    }

    // Perform bulk write to add savedJobs field
    const result = await usersCollection.bulkWrite(bulkWriteOperations);

    return NextResponse.json(
      {
        message: "SavedJobs field added successfully",
        modifiedCount: result.modifiedCount,
        totalUsers: allUsers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding savedJobs field:", error);
    return NextResponse.json(
      {
        message: "Failed to add savedJobs field",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
