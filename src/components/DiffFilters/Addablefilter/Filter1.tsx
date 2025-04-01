import React, { useEffect, useState, useRef } from "react";
import "../../../app/globals.css";

type Filter1type = {
  jobtitle: string[];
  jobvalue: string;
  setjobvalue: (value: string) => void;
  setjobtitle: (value: string[]) => void;
  title: string;
  activeDropdown: string | null;
  setactiveDropdown: (value: string | null) => void;
  updateSearchParams: (value: string[], val: string) => void;
};

const Filter1: React.FC<Filter1type> = ({
  jobtitle,
  jobvalue,
  setjobvalue,
  setjobtitle,
  title,
  activeDropdown,
  setactiveDropdown,
  updateSearchParams,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const jobtitleRef = useRef<string[]>(jobtitle);

  useEffect(() => {
    jobtitleRef.current = jobtitle;
  }, [jobtitle]);

  const titleModified = title.replace(/\s+/g, "");
  const changehandler = (ID1: string, ID2: string) => {
    let Jobtitlediv: HTMLElement = document.getElementById(ID1)!;
    let jobinput: HTMLElement = document.getElementById(ID2)!;
    if (Jobtitlediv && jobinput) {
      Jobtitlediv.classList.add("hidden");
      jobinput.classList.remove("hidden");
      jobinput.focus();
    }
  };
  useEffect(() => {
    updateSearchParams(jobtitle, titleModified);
  }, [jobtitle]);

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);

    let paramsList = [{ param: titleModified, values: jobtitleRef.current }];

    paramsList.forEach((Each) => {
      if (params.has(Each.param)) {
        let currentList = params.get(Each.param)?.split(",");
        if (
          currentList &&
          (Each.values.length !== currentList.length ||
            !Each.values.every((value, index) => value === currentList[index]))
        ) {
          if (Each.values.length > currentList.length) {
            handlepress("Backspace");
          } else {
            handlepress("Enter", currentList[currentList.length - 1]);
          }
        }
      } else {
        if (Each.values.length) {
          handlepress("Backspace");
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const clickHandler = (job: string, e: EventTarget) => {
    let clickedelement = e as HTMLElement | null; // Ensure it's cast safely
    let closestFilter: HTMLElement | null = null; // Initialize to null explicitly

    if (clickedelement) {
      closestFilter = clickedelement.closest(".filter") as HTMLElement | null;
    }

    if (closestFilter) {
      closestFilter.setAttribute("data-closed", "true");
    }
    window.setTimeout(() => {
      if (closestFilter) {
        closestFilter.setAttribute("data-closed", "false");
      }
    }, 200);
    let jobtitle_duplicate = [...jobtitle];
    jobtitle_duplicate = jobtitle_duplicate.filter((jobs) => {
      return jobs !== job;
    });
    setjobtitle(jobtitle_duplicate);
  };
  const handlepress = (e: string, newstr?: string) => {
    if (
      e === "Enter" &&
      (jobvalue.trim() !== "" || (newstr !== undefined && newstr.trim() !== ""))
    ) {
      if (newstr) {
        setjobtitle([...jobtitleRef.current, newstr]);
      } else {
        setjobtitle([...jobtitle, jobvalue]);
      }
      setjobvalue("");
    } else if (
      e === "Backspace" &&
      jobtitleRef.current.length !== 0 &&
      jobvalue.length == 0
    ) {
      let duplicate = jobtitleRef.current.slice(0, -1);
      setjobtitle(duplicate);
    }
  };
  return (
    <div
      className="filter-1 filter  relative max-w-[90%]"
      onClick={() => {
        setactiveDropdown("filter-1");
      }}
      data-closed="false"
    >
      {activeDropdown === "filter-1" && (
        <div
          className="drop-down-list cursor-pointer hover:bg-[#4aa3fa] hover:text-white px-[20px] py-[10px] flex gap-[10px] w-[250px] max-w-[350px]  items-center top-full translate-y-4 absolute shadow-custom bg-white left-0"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            handlepress("Enter", jobvalue);
          }}
        >
          <div className="magnify-emoji">🔍</div>
          <div className="max-h-[250px] h-fit break-words overflow-y-auto">
            {jobvalue.trim() !== "" ? jobvalue : "Search..."}
          </div>
        </div>
      )}
      <div
        onClick={() => {
          changehandler("jobtitlediv", "jobtitleinput");
        }}
        className="drop-down z-10    border border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div
          ref={divRef}
          className="options-list-2 flex items-center  gap-[10px] flex-wrap max-w-[100%]	"
        >
          <div
            id="jobtitlediv"
            className="type w-[200px] xs:w-[180px] font-medium  xs:text-base text-black-500 text-lg"
          >
            {title}
          </div>
          {jobtitle.map((job, index) => (
            <div
              className="bg-[#F0F1FA] xs:text-base text-lg text-medium  h-auto flex items-center gap-[5px]  px-[5px]  rounded-[5px]"
              key={index}
            >
              <div className="pl-[5px] py-1   font-roboto font-medium xs:text-base text-lg">
                {job}
              </div>
              <div
                className="wrongbutton  mb-[1px] flex items-center   font-lato text-base  font-medium px-[5px]"
                onClick={(e) => clickHandler(job, e.target)}
              >
                x
              </div>
            </div>
          ))}
          <input
            id="jobtitleinput"
            value={jobvalue}
            onKeyDown={(e) => {
              handlepress(e.key);
            }}
            onChange={(e) => {
              setjobvalue(e.target.value);
            }}
            className="hidden w-[200px] xs:w-[180px] text-black-500 xs:text-base   text-lg font-medium "
            placeholder="Type..."
          ></input>
        </div>
      </div>
    </div>
  );
};

export default Filter1;
