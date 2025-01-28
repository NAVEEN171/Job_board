import { DummyJobData } from "@/FiltersList/DummyjobData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../../app/globals.css";
import Bookstamp from "./Bookstamp";
import Link from "next/link";

const JobListing = () => {
  const [currentJobs, setcurrentJobs] = useState(DummyJobData);

  function formatDate(datePosted: string) {
    const postedDate: Date = new Date(datePosted);
    const currentDate: Date = new Date();
    const diffInTime: number = currentDate.getTime() - postedDate.getTime(); // Difference in milliseconds

    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)); // Convert time difference to days

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays <= 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays <= 60) {
      return "1 month ago";
    } else if (diffInDays <= 90) {
      return "2 months ago";
    } else if (diffInDays <= 120) {
      return "3 months ago";
    } else {
      const monthsAgo = Math.floor(diffInDays / 30);
      return `${monthsAgo} months ago`;
    }
  }

  // Test the function
  console.log(formatDate("2025-01-09")); // Example usage

  return (
    <div className="Job-Listing mt-[20px]    flex flex-col w-full gap-[20px]">
      {currentJobs.map((Job, idx) => (
        <div
          key={`Job-${idx}`}
          className="shadow-jobCustom rounded-[10px] flex gap-[15px] py-[30px] px-[20px]"
        >
          <Image
            className="rounded-full h-[50px] w-[50px]"
            src={Job.company_logo ? Job.company_logo : "/svgs/logo.png"}
            width={50}
            height={50}
            alt="company-logo"
          ></Image>
          <div className="flex flex-col w-[92%] gap-[10px]">
            <div className="flex  w-full justify-between">
              <div className="job-title">
                <div>{Job.job_title}</div>
                <div>{Job.company_name}</div>
              </div>
              <div className="locations-date">
                {Job.locations[0].city !== "" && (
                  <div>{Job.locations[0].city}</div>
                )}
                <div className="flex">
                  {Job.locations[0].region !== "" && (
                    <div>{`${Job.locations[0].region} `}</div>
                  )}
                  {Job.locations[0].country !== "" && (
                    <div>{` , ${Job.locations[0].country} `}</div>
                  )}
                </div>
                <div>{formatDate(Job.date_posted)}</div>
              </div>
            </div>
            <div>
              <div className="font-medium">About</div>
              <div>{Job.company_data.description_summary}</div>
            </div>
            <div>
              <div className="font-medium">Requirements</div>
              <div>{Job.requirements_summary}</div>
            </div>
            <div className="company-urls flex gap-[10px]">
              <Link
                className="px-[10px] py-[5px] rounded-[5px] bg-[#EFF8FF] text-[#3A90FF]  border border-[2px] border-[#B2DDFF] "
                target="_blank"
                href={Job.company_link}
              >
                Company
              </Link>
              <Link
                className="px-[10px] py-[5px] rounded-[5px] bg-[#EFF8FF] text-[#3A90FF] border border-[2px] border-[#B2DDFF] "
                target="_blank"
                href={Job.company_data.linkedin_link}
              >
                Linkedin
              </Link>
            </div>
            <div className="flex gap-[10px] max-w-[80%] flex-wrap">
              <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-[1px] border-[#C8C8C8]">
                {Job.job_board}
              </div>
              <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-[1px] border-[#C8C8C8]">
                {Job.job_type}
              </div>
              <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-[1px] border-[#C8C8C8]">
                {Job.location_type}
              </div>
              <div className="flex gap-[10px] ">
                {Job.company_data.industries.map((industry) => (
                  <div
                    key={industry}
                    className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border border-[1px] border-[#C8C8C8]"
                  >
                    {industry}
                  </div>
                ))}
                {Job.company_data.subindustries.map((industry) => (
                  <div
                    key={industry}
                    className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border border-[1px] border-[#C8C8C8]"
                  >
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Bookstamp />
        </div>
      ))}
    </div>
  );
};

export default JobListing;
