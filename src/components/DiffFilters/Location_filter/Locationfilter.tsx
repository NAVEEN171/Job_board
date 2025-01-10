import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import "../../../app/globals.css";
import { countryData } from "@/FiltersList/Locations";

type Locationtype = {
  country: string;
  emoji: string;
  index: number;
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
  useEffect(() => {
    let newlocations = Selectlocationtypes.map((element) => element.country);
    updateSearchParams(newlocations, titleModified);
  }, [Selectlocationtypes]);

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

  const setlocationhandler = (
    loc: Locationtype,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const closestFilter = (e.target as HTMLElement).closest(".filter");
    if (closestFilter) closestFilter.setAttribute("data-closed", "true");

    setTimeout(() => {
      if (closestFilter) closestFilter.setAttribute("data-closed", "false");
    }, 200);

    setlocationtype(
      locationtype.filter((location) => location.country !== loc.country)
    );
    setSelectlocationtypes([...Selectlocationtypes, loc]);
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

  const handlelocationback = (e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" &&
      Selectlocationtypes.length > 0 &&
      locationvalue.length === 0
    ) {
      const duplicate = [...Selectlocationtypes];
      const last_ele = duplicate.pop();

      setSelectlocationtypes(duplicate);
      let first7Regions = countryData.slice(0, 7);
      if (
        last_ele &&
        !locationtype.includes(last_ele) &&
        first7Regions.includes(last_ele)
      ) {
        setlocationtype(
          [...locationtype, last_ele].sort((a, b) =>
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
        className="border relative flex items-center justify-between border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div id={id1} className="w-[200px] text-black-500 text-[1.2rem]">
          {title}
        </div>
        <div className="options-list flex gap-[10px] flex-wrap max-w-[85%]">
          {Selectlocationtypes.map((loc, index) => (
            <div
              key={index}
              className="bg-[#F0F1FA] h-auto flex items-center gap-[5px] px-[5px] py-[5px] rounded-[5px]"
            >
              <div className="pl-[5px] py-[3px] text-[1.2rem] font-roboto text-[900]">{`${loc.emoji} ${loc.country}`}</div>
              <div
                className="wrongbutton py-[3px] w-[24px] h-[24px] flex items-center text-[1.1rem] font-lato text-[900] px-[5px]"
                onClick={(e) => clearhandler(loc, e)}
              >
                x
              </div>
            </div>
          ))}
          <input
            id={id2}
            value={locationvalue}
            onKeyDown={handlelocationback}
            onChange={(e) => setlocationvalue(e.target.value)}
            className="hidden w-[200px] text-black-500 text-[1.2rem]"
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
          className="drop-down-list top-full translate-y-4 bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0 top-[55px] absolute shadow-custom"
          style={{ zIndex: 9999 }}
        >
          <div className="switch-container text-[1.2rem] p-[5px]">
            <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]">
              <Switch
                initialChecked={remote}
                title="remote"
                changeSwitchState={changeSwitchState}
              />
              <div>Include Remote</div>
            </div>
          </div>

          {locationtype.map((location, index) => (
            <div
              onClick={(e) => setlocationhandler(location, e)}
              key={index + "loc"}
              className="p-[5px] hover:bg-[#4aa3fa] hover:text-white cursor-pointer text-[1.2rem] text-[600]"
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
