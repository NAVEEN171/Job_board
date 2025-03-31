import React, { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import "../../../app/globals.css";
import { countryData } from "@/FiltersList/Locations";

type Locationtype = {
  country: string;
  emoji: string;
  index: number;
  type: string;
};

type Filter2type = {
  locationvalue: string;
  locationtype: Locationtype[];
  Selectlocationtypes: Locationtype[];
  setlocationvalue: (value: string) => void;
  setSelectlocationtypes: (value: Locationtype[]) => void;
  setlocationtype: (value: Locationtype[]) => void;
  LocationTypes: Locationtype[];
  title: string;
  id1: string;
  id2: string;
  dd1: string;
  dd2: string;
  root: string;
  activeDropdown: string | null;
  setactiveDropdown: (value: string | null) => void;
  updateSearchParams: (value: string[], val: string) => void;
  changeSwitchState: (value: boolean) => void;
  remote: boolean;
};

const Locationfilter: React.FC<Filter2type> = ({
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
  changeSwitchState,
  remote,
}) => {
  const titleModified = title.replace(/\s+/g, "");

  const Selectedvalues = useRef(Selectlocationtypes);
  const locationdroptype = useRef(locationtype);

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let newlocations = Selectlocationtypes.map((element) => element.country);
    Selectedvalues.current = Selectlocationtypes;

    updateSearchParams(newlocations, titleModified);
  }, [Selectlocationtypes]);

  useEffect(() => {
    locationdroptype.current = locationtype;
  }, [locationtype]);

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    console.log("paramsList is ");

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
            !Each.values.every(
              (value, index) => value.country === currentList[index]
            ))
        ) {
          if (Each.values.length > currentList.length) {
            console.log("hey");

            handlelocationback("Backspace");
          } else {
            console.log("hey2");
            let targetCountry = currentList[currentList.length - 1];
            const result = LocationTypes.find(
              (item) => item.country === targetCountry
            );

            if (result) {
              setlocationhandler(result, divRef.current!);
            }
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
    let filteredLocations;
    if (locationvalue === "") {
      setlocationtype(LocationTypes.slice(0, 8));
    } else {
      filteredLocations = LocationTypes.filter((item) =>
        item.country.toLowerCase().includes(locationvalue.toLowerCase())
      );

      setlocationtype(filteredLocations);
    }
  }, [locationvalue]);

  const setlocationhandler = (loc: Locationtype, e: EventTarget) => {
    const closestFilter = (e as HTMLElement).closest(".filter");
    if (closestFilter) closestFilter.setAttribute("data-closed", "true");

    setTimeout(() => {
      if (closestFilter) closestFilter.setAttribute("data-closed", "false");
    }, 200);

    setlocationtype(
      locationdroptype.current.filter(
        (location) => location.country !== loc.country
      )
    );
    setSelectlocationtypes([...Selectedvalues.current, loc]);
    setlocationvalue("");
  };

  const clearhandler = (
    loc: Locationtype,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const closestFilter = (e.target as HTMLElement).closest(".filter");
    if (closestFilter) closestFilter.setAttribute("data-closed", "true");

    setTimeout(() => {
      if (closestFilter) closestFilter.setAttribute("data-closed", "false");
    }, 200);

    setSelectlocationtypes(
      Selectlocationtypes.filter((location) => location.country !== loc.country)
    );
    let first7Regions = countryData.slice(0, 7);
    if (first7Regions && first7Regions.includes(loc)) {
      setlocationtype(
        [...locationtype, loc].sort((a, b) =>
          a.country.localeCompare(b.country)
        )
      );
    }
  };

  const handlelocationback = (e: string) => {
    if (
      e === "Backspace" &&
      Selectedvalues.current.length > 0 &&
      locationvalue.length === 0
    ) {
      const duplicate = [...Selectedvalues.current];
      const last_ele = duplicate.pop();
      console.log("duplicate is");
      console.log(duplicate);

      setSelectlocationtypes(duplicate);
      let first7Regions = countryData.slice(0, 7);
      if (
        last_ele &&
        !locationdroptype.current.includes(last_ele) &&
        first7Regions.includes(last_ele)
      ) {
        setlocationtype(
          [...locationdroptype.current, last_ele].sort((a, b) =>
            a.country.localeCompare(b.country)
          )
        );
      }
    }
  };

  const changehandler = (ID1: string, ID2: string) => {
    const Jobtitlediv = document.getElementById(ID1);
    const jobinput = document.getElementById(ID2);
    if (Jobtitlediv && jobinput) {
      Jobtitlediv.classList.add("hidden");
      jobinput.classList.remove("hidden");
      jobinput.focus();
    }
  };

  return (
    <div
      className={`${root} filter h-fit relative max-w-[90%]`}
      onClick={() => setactiveDropdown(root)}
      data-closed="false"
    >
      <div
        id={dd1}
        onClick={() => changehandler(id1, id2)}
        ref={divRef}
        className=" relative flex items-center justify-between border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div
          id={id1}
          className="w-[200px] xs:w-[180px] xs:text-base text-lg font-medium "
        >
          {title}
        </div>
        <div className="options-list  flex gap-[10px] flex-wrap xs:max-w-[88%] max-w-[97%]">
          {Selectlocationtypes.map((loc, index) => (
            <div
              key={index}
              className="bg-[#F0F1FA] h-auto flex items-center gap-[5px] px-[5px]  rounded-[5px]"
            >
              <div className="pl-[5px] py-1 xs:text-base text-lg font-medium font-roboto ">{`${loc.emoji} ${loc.country}`}</div>
              <div
                className="wrongbutton mb-[1px]  flex items-center text-base font-lato font-medium px-[5px]"
                onClick={(e) => clearhandler(loc, e)}
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
            onChange={(e) => setlocationvalue(e.target.value)}
            className="hidden w-[200px] xs:w-[180px] font- xs:text-base text-lg"
            placeholder="Type..."
          />
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
      </div>

      {activeDropdown === root && (
        <div
          id={dd2}
          className="drop-down-list top-full translate-y-4 bg-white flex flex-col xs:w-[250px] w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0  absolute shadow-custom"
          style={{ zIndex: 9999 }}
        >
          <div className="switch-container text-[1.2rem] p-[5px]">
            <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]">
              <Switch
                initialChecked={remote}
                title="remote"
                changeSwitchState={changeSwitchState}
              />
              <div className="font-medium xs:py-1 xs:text-base text-lg">
                Include Remote
              </div>
            </div>
          </div>

          {locationtype.map((location, index) => (
            <div
              onClick={(e) => setlocationhandler(location, e.target)}
              key={index + "loc"}
              className="p-[5px] hover:bg-[#4aa3fa] hover:text-white cursor-pointer font-medium text-base"
            >
              <div className="drop-down-list-val w-auto px-[15px]">{`${location.emoji} ${location.country}`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Locationfilter;
