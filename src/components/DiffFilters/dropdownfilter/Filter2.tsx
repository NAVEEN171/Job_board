import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import "../../../app/globals.css";
import { setTimeout } from "timers/promises";
import { X } from "lucide-react";

type Filter2type = {
  locationvalue: string;
  locationtype: string[];
  Selectlocationtypes: string[];
  setlocationvalue: (value: string) => void;
  setSelectlocationtypes: (value: string[]) => void;
  setlocationtype: (value: string[]) => void;
  LocationTypes: string[];
  title: string;
  id1: string;
  id2: string;
  dd1: string;
  dd2: string;
  root: string;
  activeDropdown: string | null;
  setactiveDropdown: (value: string | null) => void;
  updateSearchParams: (value: string[], val: string) => void;
};

const Filter2: React.FC<Filter2type> = ({
  locationtype,
  setlocationtype,
  root,
  Selectlocationtypes,
  setSelectlocationtypes,
  locationvalue,
  setlocationvalue,
  LocationTypes,
  title,
  id1,
  id2,
  dd1,
  dd2,
  activeDropdown,
  setactiveDropdown,
  updateSearchParams,
}) => {
  const titleModified = title.replace(/\s+/g, "");
  const Selectedvalues = useRef(Selectlocationtypes);
  const locationdroptype = useRef(locationtype);

  const divRef = useRef<HTMLDivElement | null>(null);

  //  useEffect(() => {
  //      const dropdownDiv = document.getElementById(dd1);
  //      const dropdownList = document.getElementById(dd2);

  //      if (dropdownDiv && dropdownList) {
  //        const computedStyles = window.getComputedStyle(dropdownDiv);
  //        const height = parseFloat(computedStyles.getPropertyValue("height"));
  //        const diff = height - 42.4;

  //        dropdownList.style.top = `${55 + diff}px`;
  //      }
  //    }, [Selectlocationtypes]);
  useEffect(() => {
    updateSearchParams(Selectlocationtypes, titleModified);
    Selectedvalues.current = Selectlocationtypes;
  }, [Selectlocationtypes]);

  useEffect(() => {
    locationdroptype.current = locationtype;
  }, [locationtype]);

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    console.log("paramsList is ");
    console.log(titleModified);

    let paramsList = [
      {
        param: titleModified,
        values: Selectedvalues.current,
        func: setSelectlocationtypes,
      },
    ];

    paramsList.forEach((Each) => {
      if (params.has(Each.param)) {
        let currentList = params.get(Each.param)?.split(",");
        console.log(currentList);
        if (
          currentList &&
          (Each.values.length !== currentList.length ||
            !Each.values.every((value, index) => value === currentList[index]))
        ) {
          if (Each.values.length > currentList.length) {
            console.log("hey");

            handlelocationback("Backspace");
          } else {
            console.log("hey2");

            setlocationhandler(
              currentList[currentList.length - 1],
              divRef.current
            );
          }
        }
      } else {
        if (Each.values.length) {
          handlelocationback("Backspace");
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

  useEffect(() => {
    console.log(Selectlocationtypes);
  }, [Selectlocationtypes]);

  useEffect(() => {
    let items;
    if (locationvalue === "") {
      setlocationtype(LocationTypes);
    } else if (Selectlocationtypes.length > 0) {
      items = [...locationtype];
      items = items.filter((item) =>
        item.toLowerCase().includes(locationvalue.toLowerCase())
      );
      setlocationtype(items);
    } else {
      items = [...LocationTypes];

      items = items.filter((item) =>
        item.toLowerCase().includes(locationvalue.toLowerCase())
      );
      setlocationtype(items);
    }
  }, [locationvalue]);

  const setlocationhandler = (loc: string, e: EventTarget | null) => {
    console.log(e);
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
    let locations = [...locationdroptype.current];
    locations = locations.filter((location) => location !== loc);
    console.log("locations are:");
    console.log(locations);
    setlocationtype(locations);
    let newlocations = [...Selectedvalues.current];

    newlocations.push(loc);
    setSelectlocationtypes(newlocations);
    setlocationvalue("");
  };
  const clearhandler = (loc: string, e: React.MouseEvent<HTMLDivElement>) => {
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

    let newlocations = [...Selectlocationtypes];
    newlocations = newlocations.filter((location) => location !== loc);
    console.log("array is ");
    console.log(newlocations);
    setSelectlocationtypes(newlocations);
    console.log("len :" + Selectlocationtypes.length);

    let locations = [...LocationTypes];
    locations = locations.filter(
      (location) => !newlocations.includes(location)
    );
    setlocationtype(locations);
  };

  const handlelocationback = (e: string) => {
    console.log(e);
    console.log(Selectlocationtypes);

    if (
      e === "Backspace" &&
      Selectedvalues.current.length > 0 &&
      locationvalue.length === 0
    ) {
      let duplicate = [...Selectedvalues.current];
      let last_ele: any = duplicate.pop();

      setSelectlocationtypes(duplicate);
      let locations = [...LocationTypes];

      locations = locations.filter((location) => !duplicate.includes(location));
      setlocationtype(locations);
    }
  };

  const changehandler = (ID1: string, ID2: string) => {
    let Jobtitlediv: HTMLElement = document.getElementById(ID1)!;
    let jobinput: HTMLElement = document.getElementById(ID2)!;
    if (Jobtitlediv && jobinput) {
      Jobtitlediv.classList.add("hidden");
      jobinput.classList.remove("hidden");
      jobinput.focus();
    }
  };

  return (
    <div
      className={`${root} filter   relative max-w-[90%]`}
      onClick={() => {
        setactiveDropdown(root);
      }}
      data-closed="false"
    >
      <div
        id={dd1}
        onClick={(e) => {
          changehandler(id1, id2);
        }}
        ref={divRef}
        className="    relative flex items-center justify-between  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div
          id={id1}
          className="w-[200px] xs:w-[180px] xs:text-base  text-lg font-medium"
        >
          {title}
        </div>
        <div className="options-list flex  w-fit xs:text-base text-lg font-medium  gap-[10px] flex-wrap xs:max-w-[94%] max-w-[97%]">
          {Selectlocationtypes.map((loc, index) => (
            <div
              className="bg-[#F0F1FA]   flex items-center gap-[5px]  px-[5px]  rounded-[5px]"
              key={index}
            >
              <div className="pl-[5px] py-1 line-height: normal font-roboto xs:text-base text-lg font-medium">
                {loc}
              </div>
              <div
                className="wrongbutton text-base mb-[1px] h-fit flex items-center  font-lato  font-medium px-[5px]"
                onClick={(e) => {
                  clearhandler(loc, e);
                }}
              >
                x
              </div>
            </div>
          ))}
          <input
            id={id2}
            value={locationvalue}
            onKeyDown={(e) => {
              handlelocationback(e.key);
            }}
            onChange={(e) => {
              setlocationvalue(e.target.value);
            }}
            className="hidden w-[200px] xs:w-[180px] xs:py-0 font-medium xs:text-base text-lg "
            placeholder="Type..."
          ></input>
        </div>

        <svg
          className="pl-[5px] box-content"
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
        {activeDropdown === root && (
          <div
            id={dd2}
            className="drop-down-list top-full translate-y-4   bg-white flex flex-col xs:w-[250px] w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0   absolute shadow-custom"
            style={{ zIndex: 9999 }}
          >
            {locationtype.map((location, index) => (
              <div
                onClick={(e) => {
                  setlocationhandler(location, e.target);
                }}
                key={index + "loc"}
                className="p-[5px]  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  font-medium text-base"
              >
                <div className="drop-down-list-val w-auto px-[15px]">
                  {location}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter2;
