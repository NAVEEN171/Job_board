import React from "react";

const Loader = () => {
  return (
    <div className="Job-Listing mt-[20px] flex flex-col w-full gap-[20px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="shadow-jobCustom bg-white rounded-[10px] flex gap-4 py-6 px-4 mb-4"
        >
          <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex flex-col w-11/12 gap-3">
            <div className="flex justify-between">
              <div>
                <div className="h-5 bg-gray-200 w-48 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 w-32 rounded animate-pulse"></div>
              </div>
              <div className="text-right flex flex-col gap-2">
                <div className="h-4 bg-gray-200 w-28 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 w-28 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 w-20 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-5 bg-gray-200 w-28 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-full animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-11/12 animate-pulse rounded"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-5 bg-gray-200 w-28 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-full animate-pulse rounded"></div>
              <div className="h-4 bg-gray-200 w-11/12 animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-blue-100 w-24 animate-pulse rounded"></div>
              <div className="h-8 bg-blue-100 w-24 animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="h-8 bg-gray-200 animate-pulse w-24 rounded"></div>
              <div className="h-8 bg-gray-200 animate-pulse w-24 rounded"></div>
              <div className="h-8 bg-gray-200 animate-pulse w-24 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-blue-100 animate-pulse rounded"></div>
        </div>
      ))}
      ;
    </div>
  );
};

export default Loader;
