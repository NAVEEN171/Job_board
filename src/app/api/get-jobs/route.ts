"use server";
import ConnectToDB from "../../../utils/connections/mongoose";
import mongoose from "mongoose";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtverification } from "@/middlewares/Auth/validateToken";
import { subDays, format, parseISO } from "date-fns";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // let verified = await jwtverification(req);

    const body = await req.json();
    let jobtitle = body.jobtitle;
    let selectedLocationTypes = body.Selectlocationtypes;
    let changedJobTitle;
    let salaryRange = body.salaryRange;
    let selectedIndustries = body.selectedIndustries;
    let jobDomains = body.jobDomains;
    let experienceValue = body.experienceValue;
    let employmentType = body.employmentType;
    let locations = body.locations;
    let Visa = body.Visa;
    let NoExperience = body.NoExperience;
    let NoSalary = body.NoSalary;
    let Remote = body.Remote;
    let daysPosted = body.daysPosted;
    let page = body.page || 1;

    let JOBS_PER_PAGE = 10;

    const matchConditions: any[] = [];

    if (daysPosted) {
      const currentDate = new Date();
      const dateNDaysAgo = subDays(currentDate, daysPosted);
      const formattedDateNDaysAgo = format(dateNDaysAgo, "yyyy-MM-dd");
      matchConditions.push({
        date_posted: {
          $gte: formattedDateNDaysAgo,
        },
      });
    }

    let experienceCondition: { $or: any[] } = {
      $or: [],
    };

    if (NoExperience) {
      experienceCondition.$or.push({ yoe_range: null });
    }

    if (experienceValue.length) {
      experienceCondition.$or.push({
        $and: [
          {
            "yoe_range.min": {
              $gte: experienceValue[0],
            },
          },
          {
            "yoe_range.max": {
              $lte: experienceValue[1],
            },
          },
        ],
      });
    }

    let salaryCondition: { $or: any[] } = {
      $or: [],
    };

    if (NoSalary) {
      salaryCondition.$or.push({ salary_range: null });
    }

    if (salaryRange.length) {
      salaryCondition.$or.push({
        $and: [
          {
            "salary_range.min": {
              $gte: salaryRange[0],
            },
          },
          {
            "salary_range.max": {
              $lte: salaryRange[1],
            },
          },
        ],
      });
    }

    if (typeof Visa === "boolean") {
      matchConditions.push({
        visa_sponsored: Visa,
      });
    }

    if (Remote) {
      matchConditions.push({
        location_raw: "Remote",
      });
    }

    if (locations.length) {
      matchConditions.push({
        locations: {
          $elemMatch: {
            $or: [
              {
                city: {
                  $in: locations,
                },
              },
              {
                country: {
                  $in: locations,
                },
              },
              {
                region: {
                  $in: locations,
                },
              },
            ],
          },
        },
      });
    }

    if (employmentType.length) {
      matchConditions.push({
        job_type: { $in: employmentType },
      });
    }

    if (experienceValue.length) {
      matchConditions.push(experienceCondition);
    }

    if (jobDomains.length) {
      matchConditions.push({
        job_categories: {
          $elemMatch: { $in: jobDomains },
        },
      });
    }

    if (selectedIndustries.length) {
      matchConditions.push({
        $or: [
          {
            "company_data.industries": {
              $elemMatch: { $in: selectedIndustries },
            },
          },
          {
            "company_data.subindustries": {
              $elemMatch: { $in: selectedIndustries },
            },
          },
        ],
      });
    }
    if (salaryRange.length) {
      matchConditions.push(salaryCondition);
    }

    if (jobtitle.length) {
      changedJobTitle = jobtitle.map((job: string) => ({
        job_title: {
          $regex: job,
          $options: "i",
        },
      }));
      matchConditions.push({ $or: changedJobTitle });
    }
    if (selectedLocationTypes.length) {
      matchConditions.push({
        location_type: {
          $in: selectedLocationTypes,
        },
      });
    }
    const pipeline = [];
    if (matchConditions.length > 0) {
      pipeline.push({
        $match:
          matchConditions.length === 1
            ? matchConditions[0]
            : { $and: matchConditions },
      });
    }
    pipeline.push({
      $facet: {
        totalCount: [{ $count: "count" }],
        paginatedJobs: [
          { $skip: (page - 1) * JOBS_PER_PAGE },
          { $limit: JOBS_PER_PAGE },
        ],
      },
    });

    pipeline.push({
      $project: {
        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
        paginatedJobs: 1,
      },
    });

    const dbConn = await ConnectToDB();
    if (!dbConn) {
      return NextResponse.json(
        { message: "couldnt connect to DB" },
        { status: 500 }
      );
    }

    let jobsCollection = await dbConn.connection.collection("jobs");
    let jobs = await jobsCollection.aggregate(pipeline).toArray();
    let totalJobs = jobs[0]?.totalCount || 0;

    let maxPaginationCount = Math.floor(totalJobs / 10);
    if (totalJobs % 10 > 0) {
      maxPaginationCount++;
    }

    if (jobs) {
      return NextResponse.json({
        jobs,
        maxPaginationCount,
      });
    }
  } catch (err) {
    console.log(err);
  }
}
