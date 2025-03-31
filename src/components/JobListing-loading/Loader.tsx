import React from "react";

const Loader = () => {
  return (
    <div className="Job-Listing mt-[20px] flex flex-col w-full gap-[20px]">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={`loader-${idx}`}
          className="shadow-jobCustom rounded-xl flex flex-col gap-[15px] py-[30px] px-[20px]"
        >
          <div className="flex justify-between gap-3 items-start">
            <div className="flex gap-2 sm:gap-4">
              <div className="rounded-full h-[30px] w-[30px] sm:h-[50px] sm:w-[50px] bg-gray-200 animate-pulse"></div>
              <div className="job-title sm:block hidden">
                <div className="h-5 bg-gray-200 w-48 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 w-32 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-4">
              <div className="locations-date w-fit text-sm sm:text-base">
                <div className="h-4 bg-gray-200 w-28 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-36 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-20 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-8 bg-blue-100 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col xs:w-full w-[90%] gap-[10px]">
              <div className="job-title sm:hidden">
                <div className="h-5 bg-gray-200 w-48 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 w-32 rounded animate-pulse mb-2"></div>
              </div>

              <div>
                <div className="h-5 bg-gray-200 w-28 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-full animate-pulse rounded mb-1"></div>
                <div className="h-4 bg-gray-200 w-11/12 animate-pulse rounded"></div>
              </div>

              <div>
                <div className="h-5 bg-gray-200 w-36 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 w-full animate-pulse rounded mb-1"></div>
                <div className="h-4 bg-gray-200 w-11/12 animate-pulse rounded"></div>
              </div>

              <div className="flex gap-[10px]">
                <div className="h-8 px-[10px] py-[5px] rounded-[5px] bg-blue-100 w-24 animate-pulse"></div>
                <div className="h-8 px-[10px] py-[5px] rounded-[5px] bg-blue-100 w-24 animate-pulse"></div>
              </div>

              <div className="flex gap-[10px] flex-wrap xs:max-w-[95%] max-w-[80%]">
                <div className="h-8 px-[10px] py-[5px] rounded-[5px] bg-gray-200 w-24 animate-pulse"></div>
                <div className="h-8 px-[10px] py-[5px] rounded-[5px] bg-gray-200 w-24 animate-pulse"></div>
                <div className="h-8 px-[10px] py-[5px] rounded-[5px] bg-gray-200 w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
