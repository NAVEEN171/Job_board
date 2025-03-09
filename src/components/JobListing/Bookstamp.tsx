import React, { useState } from "react";
import "../../app/globals.css";

const Bookstamp = () => {
  const [bookmark, setBookmark] = useState(false);
  const bookmarkhandler = () => {
    if (!bookmark) {
      setBookmark(true);
    }
  };
  return (
    <div
      className={`book-mark-container relative ${
        bookmark ? "after:content-['']" : "border-blue-200 border-2"
      } cursor-pointer bg-white flex items-center justify-center relative  w-[45px] h-[45px] border-blue-200 rounded-[5px]`}
    >
      {/* <div className={`${bookmark ? "loader" : ""}`}></div> */}
      <div onClick={bookmarkhandler} className="flex flex-col   w-fit">
        <div
          className={`w-[18px] h-[15px] ${
            !bookmark ? "bg-blue-200" : "bg-[#3a90ff]"
          }`}
        ></div>

        <div className="flex w-full justify-between ">
          <div
            className={`w-1/2  h-0 border-r-[9px] border-t-[10px] border-l-transparent ${
              !bookmark ? "border-t-blue-200" : "border-t-[#3a90ff]"
            } border-r-transparent`}
          ></div>

          <div
            className={`w-1/2 h-0  border-l-[9px] border-t-[10px] border-l-transparent ${
              !bookmark ? "border-t-blue-200" : "border-t-[#3a90ff]"
            } border-r-transparent`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Bookstamp;
