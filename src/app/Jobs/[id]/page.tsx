"use client";
import React, { useEffect, useId, useState } from "react";
import {
  formatDistanceToNow,
  differenceInDays,
  isToday,
  isYesterday,
} from "date-fns";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Authactions } from "@/store/Substores/Authslice";
import store from "@/store";
import { current } from "@reduxjs/toolkit";
import Navbar from "@/components/Navbar/Navbar";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = ({ params }: JobPageProps) => {
  const { id: jobId } = React.use(params);
  const dispatch = useDispatch();
  type RootState = ReturnType<typeof store.getState>;
  const [currentJob, setCurrentJob] = useState<any>(null);
  const getCurrentJob = async () => {
    let response = await fetch(`/api/get-job/${jobId}`);
    let data = await response.json();
    if (response.ok) {
      setCurrentJob(data.job);
      console.log(data.job);
    }
  };

  useEffect(() => {
    if (Authactions.getCookie("userId")?.payload) {
      dispatch(Authactions.setloggedIn(true));
    }
  }, []);
  useEffect(() => {
    console.log(jobId);
    if (!jobId) {
      return;
    }
    getCurrentJob();
  }, [jobId]);
  const formatDescription = (html: any) => {
    return { __html: html };
  };

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
  useEffect(() => {
    console.log(currentJob);
  }, [currentJob]);
  return (
    <div className="w-full mb-5 ">
      <Navbar />
      {currentJob && (
        <div className="w-full flex justify-center">
          <div className="w-[80%] flex flex-col gap-3">
            <div className="font-bold text-2xl">{currentJob.job_title}</div>
            <div className="text-gray-400 font-medium">
              {formatDate(currentJob.date_posted)}
            </div>
            <div className="company-urls flex  gap-[10px]">
              {currentJob?.company_link && (
                <Link
                  className="px-[10px] py-[5px] rounded-[5px]  bg-[#EFF8FF] text-[#3A90FF]   border-[2px] border-[#B2DDFF] "
                  target="_blank"
                  href={
                    currentJob.company_link?.startsWith("http")
                      ? currentJob.company_link
                      : currentJob.company_link.startsWith("www.")
                      ? `https://${currentJob.company_link}`
                      : `https://www.${currentJob.company_link}`
                  }
                >
                  Company
                </Link>
              )}
              {currentJob.company_data?.linkedin_link && (
                <Link
                  className="px-[10px] py-[5px] rounded-[5px] bg-[#EFF8FF] text-[#3A90FF]  border-2 border-[#B2DDFF] "
                  target="_blank"
                  href={currentJob.company_data.linkedin_link}
                >
                  Linkedin
                </Link>
              )}
            </div>
            <div className="flex gap-[10px] max-w-[80%] flex-wrap">
              {currentJob.job_board && (
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {currentJob.job_board}
                </div>
              )}
              {currentJob.job_type && (
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {currentJob.job_type}
                </div>
              )}
              {currentJob.location_type && (
                <div className="px-[10px] py-[5px] cursor-pointer rounded-[5px] border border-1 border-[#C8C8C8]">
                  {currentJob.location_type}
                </div>
              )}
              <div className="flex gap-[10px] flex-wrap">
                {currentJob.company_data?.industries &&
                  currentJob.company_data.industries
                    .filter((industry: string) => industry.trim() !== "")
                    .map((industry: string) => (
                      <div
                        key={industry}
                        className="px-[10px] cursor-pointer py-[5px] rounded-[5px] border  border-1 border-[#C8C8C8]"
                      >
                        {industry}
                      </div>
                    ))}
                {currentJob.company_data?.subindustries &&
                  currentJob.company_data.subindustries
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
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-[10px] cursor-pointer py-[6px] rounded-md border  border-1 border-[#C8C8C8]"
              >
                🔍 Search all jobs
              </Link>
              <Link
                href={`${currentJob.application_link}`}
                target="_blank"
                className="px-[15px] py-[6px]   font-[600] text-white bg-[#4aa3fa] rounded-md"
              >
                Apply Now
              </Link>
            </div>
            <div>
              <div className="font-medium text-xl text-bold">
                ✍️ Full Description
              </div>
              <div
                dangerouslySetInnerHTML={formatDescription(
                  currentJob.description
                )}
              ></div>
            </div>
            <Link
              href={`${currentJob.application_link}`}
              target="_blank"
              className="px-[15px] py-[8px] w-fit   font-[600] text-white bg-[#4aa3fa] rounded-md"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
