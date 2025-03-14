import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import "../../app/globals.css";
import Bookstamp from "./Bookstamp";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store";
import {
  formatDistanceToNow,
  differenceInDays,
  isToday,
  isYesterday,
} from "date-fns";

const JobListing = () => {
  const handleJobClick = (jobId: string) => {
    window.open(`/Jobs/${jobId}`, "_blank");
  };
  const dispatch = useDispatch();
  type RootState = ReturnType<typeof store.getState>;
  const currentJobs = useSelector((state: RootState) => state.Auth.currentJobs);

  function formatDate(datePosted: string) {
    const postedDate = new Date(datePosted);

    if (isToday(postedDate)) {
      return "Today";
    } else if (isYesterday(postedDate)) {
      return "Yesterday";
    }

    const diffInDays = differenceInDays(new Date(), postedDate);

    if (diffInDays <= 30) {
      return formatDistanceToNow(postedDate, { addSuffix: true });
    } else {
      if (diffInDays <= 60) {
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
  }

  return (
    <div className="Job-Listing mt-[20px] flex flex-col w-full gap-[20px]">
      {currentJobs &&
        currentJobs.length > 0 &&
        currentJobs.map((Job: any, idx: number) => (
          <div
            key={`Job-${idx}`}
            onClick={() => handleJobClick(Job._id)}
            className="shadow-jobCustom rounded-[10px]  flex gap-[15px] py-[30px] px-[20px] cursor-pointer"
          >
            <Image
              className="rounded-full h-[50px] w-[50px]"
              src={Job.company_logo ? Job.company_logo : "/svgs/logo.png"}
              width={50}
              height={50}
              alt="company-logo"
            />
            <div className="flex flex-col w-[92%] gap-[10px]">
              <div className="flex w-full justify-between">
                <div className="job-title">
                  <div>{Job.job_title}</div>
                  <div>{Job.company_name}</div>
                </div>
                <div className="locations-date">
                  {Job.locations &&
                    Job.locations.length > 0 &&
                    Job.locations[0].city !== "" && (
                      <div>{Job.locations[0].city}</div>
                    )}
                  <div className="flex">
                    {Job.locations &&
                      Job.locations.length > 0 &&
                      Job.locations[0].region !== "" && (
                        <div>{`${Job.locations[0].region} `}</div>
                      )}
                    {Job.locations &&
                      Job.locations.length > 0 &&
                      Job.locations[0].country !== "" && (
                        <div>{` , ${Job.locations[0].country} `}</div>
                      )}
                  </div>
                  <div>{formatDate(Job.date_posted)}</div>
                </div>
              </div>
              {Job.company_data?.description_summary && (
                <div>
                  <div className="font-medium">About</div>
                  <div>{Job.company_data.description_summary}</div>
                </div>
              )}
              {Job.requirements_summary && (
                <div>
                  <div className="font-medium">Requirements</div>
                  <div>{Job.requirements_summary}</div>
                </div>
              )}
              <div className="company-urls flex gap-[10px]">
                {Job?.company_link && (
                  <Link
                    className="px-[10px] py-[5px] rounded-[5px] bg-[#EFF8FF] text-[#3A90FF] border-[2px] border-[#B2DDFF]"
                    href={
                      Job.company_link?.startsWith("http")
                        ? Job.company_link
                        : Job.company_link.startsWith("www.")
                        ? `https://${Job.company_link}`
                        : `https://www.${Job.company_link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Company
                  </Link>
                )}
                {Job.company_data?.linkedin_link && (
                  <Link
                    className="px-[10px] py-[5px] rounded-[5px] bg-[#EFF8FF] text-[#3A90FF] border-2 border-[#B2DDFF]"
                    target="_blank"
                    href={Job.company_data.linkedin_link}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Linkedin
                  </Link>
                )}
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex gap-[10px] max-w-[80%] flex-wrap"
              >
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {Job.job_board}
                </div>
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {Job.job_type}
                </div>
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {Job.location_type}
                </div>
                <div className="flex gap-[10px] flex-wrap">
                  {Job.company_data?.industries &&
                    Job.company_data.industries.map((industry: string) => (
                      <div
                        key={industry}
                        className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border border-1 border-[#C8C8C8]"
                      >
                        {industry}
                      </div>
                    ))}
                  {Job.company_data?.subindustries &&
                    Job.company_data.subindustries.map((industry: string) => (
                      <div
                        key={industry}
                        className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border border-1 border-[#C8C8C8]"
                      >
                        {industry}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <Bookstamp jobId={Job._id} />
          </div>
        ))}
    </div>
  );
};

export default JobListing;
