import React, { useEffect, useState } from "react";
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
  const clickHandler = (job: string, e: React.MouseEvent<HTMLDivElement>) => {
    let clickedelement = e.target as HTMLElement | null; // Ensure it's cast safely
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
    console.log(job);
    let jobtitle_duplicate = [...jobtitle];
    jobtitle_duplicate = jobtitle_duplicate.filter((jobs) => {
      return jobs !== job;
    });
    setjobtitle(jobtitle_duplicate);
  };
  const handlepress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && jobvalue.trim() !== "") {
      setjobtitle([...jobtitle, jobvalue]);
      setjobvalue("");
    } else if (
      e.key === "Backspace" &&
      jobtitle.length !== 0 &&
      jobvalue.length == 0
    ) {
      let duplicate = jobtitle.slice(0, -1);
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
      <div
        onClick={() => {
          changehandler("jobtitlediv", "jobtitleinput");
        }}
        className="drop-down z-10  border border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div className="options-list-2 flex  gap-[10px] flex-wrap max-w-[100%]	">
          {jobtitle.map((job, index) => (
            <div
              className="bg-[#F0F1FA]  h-auto flex items-center gap-[5px]  px-[5px] py-[5px] rounded-[5px]"
              key={index}
            >
              <div className="pl-[5px] py-[3px] line-height: normal font-roboto text-[900] text-[1.2rem]">
                {job}
              </div>
              <div
                className="wrongbutton  py-[3px] flex items-center line-height:normal  font-lato text-[1.1rem] h-auto text-[900] px-[5px]"
                onClick={(e) => clickHandler(job, e)}
              >
                x
              </div>
            </div>
          ))}
          <input
            id="jobtitleinput"
            value={jobvalue}
            onKeyDown={handlepress}
            onChange={(e) => {
              setjobvalue(e.target.value);
            }}
            className="hidden w-[200px] text-black-500 text-[1.2rem] "
            placeholder="Type..."
          ></input>
        </div>

        <div
          id="jobtitlediv"
          className="type w-[200px]  text-black-500 text-[1.2rem]"
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default Filter1;
