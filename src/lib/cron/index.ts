import { initUpdateJobDatesCron } from "./updateJobDates";

let cronJobs: Array<ReturnType<typeof import("node-cron").schedule>> = [];

export function initCronJobs() {
  stopCronJobs();

  const updateJobDatesCron = initUpdateJobDatesCron();
  cronJobs.push(updateJobDatesCron);

  console.log("All cron jobs initialized successfully");
}

export function stopCronJobs() {
  cronJobs.forEach((job) => {
    job.stop();
  });
  cronJobs = [];
  console.log("All cron jobs stopped");
}
