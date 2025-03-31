import { DummyJobData } from "@/FiltersList/DummyjobData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../../app/globals.css";
import Bookstamp from "../JobListing/Bookstamp";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  formatDistanceToNow,
  differenceInDays,
  isToday,
  isYesterday,
} from "date-fns";
import { Authactions } from "@/store/Substores/Authslice";

import store from "@/store";
import Loader from "../JobListing-loading/Loader";

export const JobListing = () => {
  type RootState = ReturnType<typeof store.getState>;

  const handleJobClick = (jobId: string) => {
    window.open(`/Jobs/${jobId}`, "_blank");
  };
  const [currentJobs, setCurrentJobs] = useState<any[]>([]);
  const [JobsLoading, setJobsLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.Auth.UserId);
  const getSavedJobs = async () => {
    try {
      setJobsLoading(true);
      let response = await fetch(`/api/get-saved-jobs/${userId}`);
      let data = await response.json();
      if (response.ok) {
        setCurrentJobs(data.savedJobs);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setJobsLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) {
      return;
    }
    getSavedJobs();
  }, [userId]);

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

  if (JobsLoading) {
    return <Loader />;
  }

  return (
    <div className="Job-Listing mt-[20px] flex flex-col w-full gap-[20px]">
      {currentJobs &&
        currentJobs.length > 0 &&
        currentJobs.map((Job: any, idx: number) => (
          <div
            key={`Job-${idx}`}
            onClick={() => handleJobClick(Job._id)}
            className="shadow-jobCustom rounded-xl flex flex-col gap-[15px] py-[30px] px-[20px] cursor-pointer"
          >
            <div className="flex justify-between gap-3 items-start">
              <div className="flex gap-2 sm:gap-4">
                <Image
                  className="rounded-full h-[30px] w-[30px] sm:h-[50px] sm:w-[50px]"
                  src={Job.company_logo ? Job.company_logo : "/svgs/logo.png"}
                  width={50}
                  height={50}
                  alt="company-logo"
                />
                <div className="job-title sm:block hidden text-sm font-bold sm:text-base">
                  <div>{Job.job_title}</div>
                  <div className="text-gray-400">{Job.company_name}</div>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-4">
                <div className="locations-date w-fit sm:font-semibold font-bold text-sm sm:text-base">
                  {Job.locations &&
                    Job.locations.length > 0 &&
                    Job.locations[0].city !== "" && (
                      <div className="w-fit">{Job.locations[0].city}</div>
                    )}
                  <div className="flex flex-wrap w-fit">
                    {Job.locations &&
                      Job.locations.length > 0 &&
                      Job.locations[0].region && (
                        <div>{`${Job.locations[0].region} `}</div>
                      )}
                    {Job.locations &&
                      Job.locations.length > 0 &&
                      Job.locations[0].country && (
                        <div>{` ${Job.locations[0].region ? "," : ""} ${
                          Job.locations[0].country
                        } `}</div>
                      )}
                  </div>
                  <div className="text-gray-400 w-fit font-medium mt-2">
                    {formatDate(Job.date_posted)}
                  </div>
                </div>
                <Bookstamp jobId={Job._id} />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col xs:w-full w-[90%] gap-[10px]">
                <div className="job-title sm:hidden font-bold text-base">
                  <div>{Job.job_title}</div>
                  <div className="text-gray-400">{Job.company_name}</div>
                </div>
                {Job.company_data?.description_summary && (
                  <div>
                    <div className="font-medium text-base">About</div>
                    <div className="text-sm font-semibold text-gray-400 mt-1">
                      {Job.company_data.description_summary}
                    </div>
                  </div>
                )}
                {Job.requirements_summary && (
                  <div>
                    <div className="font-medium text-base">Requirements</div>
                    <div className="font-semibold text-gray-400 text-sm mt-1">
                      {Job.requirements_summary}
                    </div>
                  </div>
                )}
                <div className="company-urls xs:text-sm text-base font-medium flex gap-[10px]">
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
                  className="flex gap-[10px] font-medium xs:text-sm text-base xs:max-w-[95%] max-w-[80%] flex-wrap"
                >
                  {Job.job_board && (
                    <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                      {Job.job_board}
                    </div>
                  )}
                  {Job.job_type && (
                    <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                      {Job.job_type}
                    </div>
                  )}
                  {Job.location_type && (
                    <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                      {Job.location_type}
                    </div>
                  )}
                  <div className="flex gap-[10px] flex-wrap">
                    {Job.company_data?.industries &&
                      Job.company_data.industries
                        .filter((industry: string) => industry.trim() !== "")
                        .map((industry: string) => (
                          <div
                            key={industry}
                            className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border border-1 border-[#C8C8C8]"
                          >
                            {industry}
                          </div>
                        ))}
                    {Job.company_data?.subindustries &&
                      Job.company_data.subindustries
                        .filter((industry: string) => industry.trim() !== "")
                        .map((industry: string) => (
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default JobListing;
