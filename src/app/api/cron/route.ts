// app/api/cron/route.ts
import { NextResponse, NextRequest } from "next/server";
import { initCronJobs, stopCronJobs } from "@/lib/cron";

// Track if cron jobs have been initialized
let cronInitialized = false;

// Route to start cron jobs
export async function GET(req: NextRequest) {
  // Check for authorization - This is a simple example, use proper auth in production

  try {
    if (!cronInitialized) {
      initCronJobs();
      cronInitialized = true;
      return NextResponse.json(
        { message: "Cron jobs initialized successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Cron jobs already running" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error initializing cron jobs:", error);
    return NextResponse.json(
      {
        message: "Failed to initialize cron jobs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    stopCronJobs();
    cronInitialized = false;
    return NextResponse.json(
      { message: "Cron jobs stopped successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error stopping cron jobs:", error);
    return NextResponse.json(
      {
        message: "Failed to stop cron jobs",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
