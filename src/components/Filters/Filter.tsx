"use client";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useRef,
  Fragment,
  useMemo,
  use,
} from "react";
import "../../app/globals.css";
import { LocationTypes } from "../../FiltersList/Locationtypes";
import {
  Industries,
  industriesSubcategories,
} from "@/FiltersList/CategoryFilter";

import Filter1 from "../DiffFilters/Addablefilter/Filter1";
import Filter2 from "../DiffFilters/dropdownfilter/Filter2";
import { jobCategories } from "../../FiltersList/Jobcategories";
import { DualRangeSlider } from "../DualRangeslider/Dualrange";
import { Switch } from "@/components/ui/switch";
import { SingleSlider } from "../Singleslider/Singleslider";
import { EmploymentList } from "../../FiltersList/Employmentlist";
import Industryfilter from "../DiffFilters/Industry_filter/Industryfilter";
import { countryData } from "@/FiltersList/Locations";
import Locationfilter from "../DiffFilters/Location_filter/Locationfilter";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { AdvancedList } from "@/FiltersList/AdvancedList";
import { createPostponedAbortSignal } from "next/dist/server/app-render/dynamic-rendering";
import { useDispatch, useSelector } from "react-redux";
import store from "@/store";
import { Authactions } from "@/store/Substores/Authslice";

import { parse } from "path";
import { FilterActions } from "@/store/Substores/Filterstore";
import { OptionActions } from "@/store/Substores/Optionstore";

type DropDowndatatype = {
  name: string;
  root: string;
  Namediv: string;
  Nameinput: string;
  DropDown: string;
  content?: any;
};

const Dropdowndata: DropDowndatatype[] = [
  {
    name: "Jobtitle",
    root: "filter-1",
    Namediv: "jobtitlediv",
    Nameinput: "jobtitleinput",
    DropDown: "",
  },
  {
    name: "Location Type",
    root: "filter-2",
    Namediv: "locdiv",
    Nameinput: "locationinput",
    DropDown: "locationtypelist",
  },
  {
    name: "Domain",
    root: "filter-3",
    Namediv: "domainDiv",
    Nameinput: "domainInput",
    DropDown: "domainTypeList",
  },
  {
    name: "Salary",
    root: "filter-4",
    Namediv: "",
    Nameinput: "",
    DropDown: "salary-drop-down",
  },
  {
    name: "Date",
    root: "filter-5",
    Namediv: "",
    Nameinput: "",
    DropDown: "drop-down-date",
  },
  {
    name: "Experience",
    root: "filter-6",
    Namediv: "",
    Nameinput: "",
    DropDown: "experience-drop-down",
  },
  {
    name: "Employment-type",
    root: "filter-7",
    Namediv: "EmploymenttypeDiv",
    Nameinput: "EmploymenttypeInput",
    DropDown: "EmploymentTypeList",
  },
  {
    name: "Industry",
    root: "filter-8",
    Namediv: "IndustryDiv",
    Nameinput: "IndustryInput",
    DropDown: "Drop-down-Industry",
  },

  {
    name: "Location",
    root: "filter-9",
    Namediv: "LocationsearchDiv",
    Nameinput: "LocationsearchInput",
    DropDown: "LocationsearchDropdown",
  },
];

type Locationtype = {
  country: string;
  emoji: string;
  index: number;
  type: string;
};

const Filter = () => {
  const dispatch = useDispatch();

  type RootState = ReturnType<typeof store.getState>;

  const jobtitle = useSelector((state: RootState) => state.Filter.jobtitle);
  const locationtype = useSelector(
    (state: RootState) => state.Filter.locationtype
  );
  const Selectlocationtypes = useSelector(
    (state: RootState) => state.Filter.Selectlocationtypes
  );
  const sliderValue = useSelector(
    (state: RootState) => state.Filter.sliderValue
  );
  const singleSlidervalue = useSelector(
    (state: RootState) => state.Filter.singleSlidervalue
  );

  const SelectedIndustries = useSelector(
    (state: RootState) => state.Filter.SelectedIndustries
  );

  const Selectjobcategory = useSelector(
    (state: RootState) => state.Filter.Selectjobcategory
  );

  const selectedEmptype = useSelector(
    (state: RootState) => state.Filter.selectedEmptype
  );
  const EmpTypedropdown = useSelector(
    (state: RootState) => state.Filter.EmpTypedropdown
  );

  const dropdowncategory = useSelector(
    (state: RootState) => state.Filter.dropdowncategory
  );
  const SelectedLocations = useSelector(
    (state: RootState) => state.Filter.SelectedLocations
  );
  const Experiencevalue = useSelector(
    (state: RootState) => state.Filter.Experiencevalue
  );
  const Locationdropdown = useSelector(
    (state: RootState) => state.Filter.Locationdropdown
  );
  const visa = useSelector((state: RootState) => state.Options.visa);
  const remote = useSelector((state: RootState) => state.Options.remote);
  const NoSalary = useSelector((state: RootState) => state.Options.NoSalary);
  const NoExperience = useSelector(
    (state: RootState) => state.Options.NoExperience
  );
  const searchParams = useSearchParams();

  //added options for jobtitle (addable filter)
  const [jobvalue, setjobvalue] = useState<string>(""); //current typed value of the filter (addable filter)

  const [locationvalue, setlocationvalue] = useState<string>(""); // current typed value of the filter (dropdown filter)
  // const [locationtype, setlocationtype] = useState<string[]>(LocationTypes); //drop down values (dropdown filter)
  // const [Selectlocationtypes, setSelectlocationtypes] = useState<string[]>([]); //selected values from the dropdown (dropdown filter)

  const [searchjobcategory, setsearchjobcategory] = useState<string>("");
  const [Slideprevalue, setSlideprevalue] = useState("40K  -  900K");
  const [datepostedshower, setdatepostedshower] =
    useState<string>("7 days ago");
  const [Experienceprevalue, setExperienceprevalue] = useState("0  -  4 years");
  const [Employmenttypevalue, setEmploymenttypevalue] = useState<string>("");

  const [IndustryDropDown, setIndustryDropDown] =
    useState<string[]>(Industries);
  const [IndustrySubcategory, setIndustrySubcategory] = useState<string[]>([]);
  const [CurrentIndustryVal, setCurrentIndustryVal] = useState<string>("");

  const [activeDropdown, setactiveDropdown] = useState<string | null>(null);
  const [advancedFilterCount, setadvancedFilterCount] = useState<number>(0);
  const [advancedShow, setAdvancedShow] = useState<boolean>(false);

  const [Locationvalue, setLocationvalue] = useState<string>("");

  const [selectadvancedOption, setselectadvancedOption] =
    useState<string>("Relevance & Date");
  const [initialRender, setinitialRender] = useState(false);

  const getLatestValues = useMemo(
    () => ({
      Industries: SelectedIndustries,
      Domain: Selectjobcategory,
      ["Employment-type"]: selectedEmptype,
      Location: Selectlocationtypes,
    }),
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const paramsList = ["JobTitle", "LocationType"];
    console.log("hey whats up");
    const paramfunctions = [
      FilterActions.setjobtitle,
      FilterActions.setSelectlocationtypes,
    ];
    let currentList;
    paramsList.forEach((param, idx) => {
      console.log(param);
      if (params.has(param)) {
        currentList = params.get(param)?.split(",");
        console.log(currentList);
        console.log(paramfunctions[idx]);
        dispatch(paramfunctions[idx](currentList!));
      }
    });
    if (params.has("datePosted")) {
      let currentDate = params.get("datePosted");
      if (currentDate && typeof parseInt(currentDate) === "number") {
        dispatch(FilterActions.setsingleSlidervalue([parseInt(currentDate)]));
        setdatepostedshower(currentDate + " days ago");
      }
    }
    if (params.has("salary")) {
      let salaryRange = params.get("salary")?.split("-").map(Number) ?? [];
      if (salaryRange) {
        console.log("exp is ");
        console.log(salaryRange);
        dispatch(FilterActions.setSliderValue(salaryRange));
        salaryChangeShower(salaryRange);
      }
    }
    if (params.has("Location")) {
      let Locationslist = params.get("Location")?.split(",");
      if (Locationslist) {
        console.log("locs  is ");
        console.log(Locationslist);
        const filteredData = countryData.filter((item) =>
          Locationslist.includes(item.country)
        );
        dispatch(FilterActions.setSelectedLocations(filteredData));
      }
    }
    if (params.has("Experience")) {
      let currentList = params.get("Experience")?.split("-").map(Number);
      console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setExperiencevalue(numList));
      }

      console.log(currentList);
    }
  }, []);

  const getLatestbuttonValues = useMemo(
    () => ({
      visa: visa,
      Include_no_yeo: NoExperience,
      remote: remote,
    }),
    []
  );

  const checkAdvancedParams = (): boolean => {
    const AdvancedParamsList = [
      "Experience",
      "Industries",
      "Employment-type",
      "Domain",
      "Location",
      "visa",
      "remote",
      "Include_no_yeo",
    ];
    const searchparams = new URLSearchParams(window.location.search);
    for (let i = 0; i < AdvancedParamsList.length; i++) {
      if (searchparams.has(AdvancedParamsList[i])) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const check = checkAdvancedParams();

    if (check && !advancedShow) {
      setAdvancedShow(true);

      console.log("I am running first hahah");
      const params = new URLSearchParams(window.location.search);

      const paramList = Object.keys(getLatestValues);
      paramList.pop();
      const paramfunctions = [
        FilterActions.setSelectedIndustries,
        FilterActions.setSelectjobcategory,
        FilterActions.setselectedEmptype,
      ];
      let currentList = [];
      paramList.forEach((param, idx) => {
        if (params.has(param)) {
          currentList = params.get(param)?.split(",")!;
          console.log(currentList);
          console.log(paramfunctions[idx]);
          dispatch(paramfunctions[idx](currentList));
        }
      });
    }
    setinitialRender(true);
  }, []);

  useEffect(() => {
    console.log("advancedshow is", advancedShow);
    if (!advancedShow && initialRender) {
      console.log("I am second haha");
      const params = new URLSearchParams(window.location.search);

      const paramList = Object.keys(getLatestValues);
      const paramfunctions = [
        FilterActions.setSelectedIndustries,
        FilterActions.setSelectjobcategory,
        FilterActions.setselectedEmptype,
        FilterActions.setSelectedLocations,
      ];
      console.log(paramList);
      paramList.forEach((param, idx) => {
        if (params.has(param)) {
          params.delete(param);
          dispatch(paramfunctions[idx]([]));
        }
      });
      const buttonParamList = Object.keys(getLatestbuttonValues);

      const buttonfunctions = [
        OptionActions.setVisa,
        OptionActions.setNoExperience,
        OptionActions.setRemote,
      ];
      buttonParamList.forEach((param, idx) => {
        if (params.has(param)) {
          params.delete(param);
          dispatch(buttonfunctions[idx](false));
        }
      });
      if (params.has("Experience")) {
        params.delete("Experience");
      }

      const newurl = `${window.location.pathname}?${params.toString()}`;
      router.push(newurl, { scroll: false });
    }
  }, [advancedShow]);

  type paramstype = {
    param: string;
    values: string[];
    func: (val: string[]) => void;
  };

  const router = useRouter();

  const ChangeDoubleslider = (val: number[], name: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val !== undefined) {
      params.set(name, val.join("-"));
    }
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  };
  const ChangeDate = (val: number) => {
    const params = new URLSearchParams(window.location.search);
    if (val !== undefined) {
      params.set("datePosted", val.toString());
    }
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  };

  const updateSearchParams = (List: string[], Dropdownname: string) => {
    const params = new URLSearchParams(window.location.search);
    if (List?.length > 0) {
      //change code
      params.set(`${Dropdownname}`, List.join(","));
    } else {
      params.delete(`${Dropdownname}`);
    }
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  };

  useEffect(() => {
    console.log(Locationdropdown);
  }, [Locationdropdown]);

  useEffect(() => {
    console.log(searchParams.get("JobTitle"));
    let count = 0;
    const AdvancedList: string[][] = [
      ["Industries"],
      ["Domain"],
      ["Experience", "Include_no_yoe"],
      ["Employment-type"],
      ["Location", "remote"],
      ["visa"],
    ];
    for (let i = 0; i < AdvancedList.length; i++) {
      for (let j = 0; j < AdvancedList[i].length; j++) {
        if (searchParams.get(AdvancedList[i][j])) {
          count++;
          break;
        }
      }
    }
    setadvancedFilterCount(count);
  }, [searchParams]);

  useEffect(() => {
    let jobtitlediv;
    let jobtitleinput;

    const con = [
      { content: jobtitle }, // Spread jobtitle into an array if it's iterable
      { content: Selectlocationtypes },
      { content: Selectjobcategory },
      { content: null },
      { content: null },
      { content: null },
      { content: selectedEmptype },
      { content: SelectedIndustries },
      { content: SelectedLocations },
    ];

    Dropdowndata.forEach((data, idx) => {
      console.log("values");
      console.log(con);
      console.log(idx);

      if (
        activeDropdown !== data.root &&
        con[idx].content !== null &&
        Array.isArray(con[idx].content) &&
        con[idx].content.length === 0
      ) {
        console.log(data.root + " accessed ");
        jobtitlediv = document.getElementById(data.Namediv);
        jobtitleinput = document.getElementById(data.Nameinput);
        if (jobtitlediv?.classList.contains("hidden") && jobtitleinput) {
          jobtitleinput.classList.add("hidden");
          jobtitlediv.classList.remove("hidden");
        }
      }
    });
  }, [activeDropdown]);

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("Experience")) {
      let currentList = params.get("Experience")?.split("-");
      console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setExperiencevalue(numList));
      }

      console.log(currentList);
    }
    if (params.has("salary")) {
      let currentList = params.get("salary")?.split("-");
      console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setSliderValue(numList));
      }

      console.log(currentList);
    }
    if (params.has("datePosted")) {
      let currentList = params.get("datePosted");
      console.log("paramsList is ");
      if (currentList) {
        const numList = [parseInt(currentList)];
        console.log(numList);
        dispatch(FilterActions.setsingleSlidervalue(numList));
      }

      console.log(currentList);
    }
  };

  useEffect(() => {
    // Only attaches the listener for popstate events
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setExperienceprevalue(
      `${Experiencevalue[0]}  -  ${Experiencevalue[1]} years`
    );
  }, [Experiencevalue]);

  const handleClick = (e: MouseEvent) => {
    console.log("clicked");

    let filter1 = document.querySelector(".filter-1") as HTMLElement;
    let filter2 = document.querySelector(".filter-2") as HTMLElement;
    let filter3 = document.querySelector(".filter-3") as HTMLElement;
    let filter4 = document.querySelector(".filter-4") as HTMLElement;
    let filter5 = document.querySelector(".filter-5") as HTMLElement;
    let filter6 = document.querySelector(".filter-6") as HTMLElement;
    let filter7 = document.querySelector(".filter-7") as HTMLElement;
    let filter8 = document.querySelector(".filter-8") as HTMLElement;
    let filter9 = document.querySelector(".filter-9") as HTMLElement;
    let filter10 = document.querySelector(".filter-10") as HTMLElement;

    if (
      (e.target && !filter8?.contains(e.target as HTMLElement)) ||
      !(filter8?.dataset?.closed === "true")
    ) {
      setIndustrySubcategory([]);
    }

    if (
      (e.target && filter1?.contains(e.target as HTMLElement)) ||
      filter1?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter2?.contains(e.target as HTMLElement)) ||
      filter2?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter3?.contains(e.target as HTMLElement)) ||
      filter3?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter4?.contains(e.target as HTMLElement)) ||
      filter4?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter5?.contains(e.target as HTMLElement)) ||
      filter5?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter6?.contains(e.target as HTMLElement)) ||
      filter6?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter10?.contains(e.target as HTMLElement)) ||
      filter10?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter7?.contains(e.target as HTMLElement)) ||
      filter7?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter8?.contains(e.target as HTMLElement)) ||
      filter8?.dataset?.closed === "true"
    ) {
      return;
    } else if (
      (e.target && filter9?.contains(e.target as HTMLElement)) ||
      filter9?.dataset?.closed === "true"
    ) {
      return;
    } else {
      console.log("clicked outside");

      setactiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const salaryChangeShower = (value: number[]) => {
    let show1 = "K";
    let show2 = "K";
    let num1, num2;
    if (sliderValue[0] > 999) {
      num1 = Math.floor((sliderValue[0] / 1000) * 100) / 100;
      show1 = "M";
    } else {
      num1 = sliderValue[0];
      show1 = "K";
    }
    if (sliderValue[1] > 999) {
      num2 = Math.floor((sliderValue[1] / 1000) * 100) / 100;
      show2 = "M";
    } else {
      num2 = sliderValue[1];
      show2 = "K";
    }
    setSlideprevalue(num1 + show1 + " - " + num2 + show2);
  };

  useEffect(() => {
    salaryChangeShower(sliderValue);
  }, [sliderValue]);

  const handleSingleValueChange = (value: number[]) => {
    dispatch(FilterActions.setsingleSlidervalue(value));

    setdatepostedshower(value + " days ago ");
  };

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="filters-wrapper relative flex gap-[30px]  flex-wrap justify-center w-[100%]">
        <Filter1
          jobtitle={jobtitle}
          jobvalue={jobvalue}
          setjobtitle={(value: string[]) =>
            dispatch(FilterActions.setjobtitle(value))
          }
          activeDropdown={activeDropdown}
          setactiveDropdown={setactiveDropdown}
          setjobvalue={setjobvalue}
          title="Job Title"
          updateSearchParams={updateSearchParams}
        />
        <Filter2
          locationvalue={locationvalue}
          setlocationvalue={setlocationvalue}
          locationtype={locationtype}
          setlocationtype={(values: string[]) =>
            dispatch(FilterActions.setlocationtype(values))
          }
          Selectlocationtypes={Selectlocationtypes}
          setSelectlocationtypes={(values: string[]) =>
            dispatch(FilterActions.setSelectlocationtypes(values))
          }
          LocationTypes={LocationTypes}
          activeDropdown={activeDropdown}
          setactiveDropdown={setactiveDropdown}
          root="filter-2"
          title="Location Type"
          id1="locdiv"
          id2="locationinput"
          dd1="locationdropdown"
          dd2="locationtypelist"
          updateSearchParams={updateSearchParams}
        />

        <div
          className="filter-5 filter relative"
          onClick={() => {
            setactiveDropdown("filter-5");
          }}
          data-closed="false"
          style={{ position: "relative" }}
        >
          <div className="border relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
            <div className="w-[200px] text-black-500 text-[1.2rem]">
              Date Posted
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
            {activeDropdown === "filter-5" && (
              <div
                id="drop-down-date"
                className="drop-down-list  rounded-md flex flex-col gap-[15px] py-[20px] px-[15px] rounded-mg bg-white absolute top-[55px] left-0 w-[350px] shadow-custom absolute"
                style={{ zIndex: 9999 }}
              >
                <div className="Singleslider-container flex flex-col gap-[20px]">
                  <div className="salary-desc flex justify-between">
                    <div className="">Date Posted</div>
                    <div>{datepostedshower}</div>
                  </div>
                  <SingleSlider
                    value={singleSlidervalue}
                    onValueChange={handleSingleValueChange}
                    onClick={() => {
                      ChangeDate(singleSlidervalue[0]);
                    }}
                    min={0}
                    max={90}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="filter-4  filter relative"
          onClick={() => {
            setactiveDropdown("filter-4");
          }}
          data-closed="false"
        >
          <div className="border relative flex items-center border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
            <div className="w-[200px] text-black-500 text-[1.2rem]">
              Salary Range
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
            {activeDropdown === "filter-4" && (
              <div
                id="salary-drop-down"
                className="drop-down-list drop-down-salary  rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 w-[350px] shadow-custom"
                style={{ zIndex: 9999 }}
              >
                <div className="DualRangeslider-container flex flex-col gap-[20px]">
                  <div className="salary-desc flex justify-between">
                    <div>salary</div>
                    <div>{Slideprevalue}</div>
                  </div>
                  <DualRangeSlider
                    min={0}
                    max={1190}
                    value={sliderValue}
                    onValueChange={(values: number[]) =>
                      dispatch(FilterActions.setSliderValue(values))
                    }
                    onClick={() => {
                      ChangeDoubleslider(sliderValue, "salary");
                    }}
                  />
                </div>
                <div className="switch-container text-[1.2rem]">
                  <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]">
                    <Switch
                      initialChecked={NoSalary}
                      title="Include_no_salary"
                      changeSwitchState={(value: boolean) =>
                        dispatch(OptionActions.setNoSalary(value))
                      }
                    />
                    <div>Include No salary Info</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {advancedShow && (
          <Fragment>
            <Industryfilter
              SelectedIndustries={SelectedIndustries}
              setSelectedIndustries={(values: string[]) =>
                dispatch(FilterActions.setSelectedIndustries(values))
              }
              activeDropdown={activeDropdown}
              setactiveDropdown={setactiveDropdown}
              setIndustrySubcategory={setIndustrySubcategory}
              IndustrySubcategory={IndustrySubcategory}
              CurrentIndustryVal={CurrentIndustryVal}
              setCurrentIndustryVal={setCurrentIndustryVal}
              setIndustryDropDown={setIndustryDropDown}
              IndustryDropDown={IndustryDropDown}
              industriesSubcategories={industriesSubcategories}
              Industries={Industries}
              updateSearchParams={updateSearchParams}
            />
            <Filter2
              locationvalue={searchjobcategory}
              setlocationvalue={setsearchjobcategory}
              locationtype={dropdowncategory}
              setlocationtype={(values: string[]) =>
                dispatch(FilterActions.setdropdowncategory(values))
              }
              Selectlocationtypes={Selectjobcategory}
              LocationTypes={jobCategories}
              root="filter-3"
              activeDropdown={activeDropdown}
              setactiveDropdown={setactiveDropdown}
              setSelectlocationtypes={(values: string[]) =>
                dispatch(FilterActions.setSelectjobcategory(values))
              }
              title="Domain"
              id1="domainDiv"
              id2="domainInput"
              dd1="domainDropdown"
              dd2="domainTypeList"
              updateSearchParams={updateSearchParams}
            />
            <div
              className="filter-6  filter relative"
              onClick={() => {
                setactiveDropdown("filter-6");
              }}
              data-closed="false"
            >
              <div className="border relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
                <div className="w-[200px] text-black-500 text-[1.2rem]">
                  Experience{" "}
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
                {activeDropdown === "filter-6" && (
                  <div
                    id="experience-drop-down"
                    className="drop-down-list drop-down-experience  rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 w-[350px] shadow-custom"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="DualRangeslider-container flex flex-col gap-[20px]">
                      <div className="salary-desc flex justify-between">
                        <div>Experience</div>
                        <div>{Experienceprevalue}</div>
                      </div>
                      <DualRangeSlider
                        min={0}
                        max={10}
                        value={Experiencevalue}
                        onValueChange={(values: number[]) =>
                          dispatch(FilterActions.setExperiencevalue(values))
                        }
                        onClick={() => {
                          ChangeDoubleslider(Experiencevalue, "Experience");
                        }}
                      />
                    </div>
                    <div className="switch-container text-[1.2rem]">
                      <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]">
                        <Switch
                          initialChecked={NoExperience}
                          title="Include_no_yeo"
                          changeSwitchState={(value: boolean) =>
                            dispatch(OptionActions.setNoExperience(value))
                          }
                        />
                        <div>Include No YEO info</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* const [Employmenttypevalue,setEmploymenttypevalue]=useState<string>("");
   const [EmpTypedropdown,setEmpTypedropdown]=useState<string[]>(EmploymentList);
   const [selectedEmptype,setselectedEmptype]=useState<string[]>([]) */}
            <Filter2
              locationvalue={Employmenttypevalue}
              setlocationvalue={setEmploymenttypevalue}
              locationtype={EmpTypedropdown}
              setlocationtype={(values: string[]) =>
                dispatch(FilterActions.setEmpTypedropdown(values))
              }
              Selectlocationtypes={selectedEmptype}
              LocationTypes={EmploymentList}
              root="filter-7"
              activeDropdown={activeDropdown}
              setactiveDropdown={setactiveDropdown}
              setSelectlocationtypes={(values: string[]) =>
                dispatch(FilterActions.setselectedEmptype(values))
              }
              title="Employment-type"
              id1="EmploymenttypeDiv"
              id2="EmploymenttypeInput"
              dd1="EmploymenttypeDropdown"
              dd2="EmploymentTypeList"
              updateSearchParams={updateSearchParams}
            />

            {/* const [Locationdropdown,setLocationdropdown]=useState<Locationtype[]>(countryData.slice(0,7));
   const [Locationvalue,setLocationvalue]=useState<string>("");
   const [SelectedLocations,setSelectedLocations]=useState<Locationtype[]>([]); */}
            <Locationfilter
              locationvalue={Locationvalue}
              setlocationvalue={setLocationvalue}
              locationtype={Locationdropdown}
              setlocationtype={(values: Locationtype[]) =>
                dispatch(FilterActions.setLocationdropdown(values))
              }
              Selectlocationtypes={SelectedLocations}
              LocationTypes={countryData}
              root="filter-9"
              activeDropdown={activeDropdown}
              setactiveDropdown={setactiveDropdown}
              setSelectlocationtypes={(values: Locationtype[]) =>
                dispatch(FilterActions.setSelectedLocations(values))
              }
              title="Location"
              id1="LocationsearchDiv"
              id2="LocationsearchInput"
              dd1="LocationsearchDropdown"
              dd2="LocationsearchList"
              updateSearchParams={updateSearchParams}
              changeSwitchState={(value: boolean) =>
                dispatch(OptionActions.setRemote(value))
              }
              remote={remote}
            />
            {/* id1:IndustryTitle
        id2:IndustryInput
        dd1:IndustryDiv
        dd2:Drop-down-Industry
        */}
            <div className="border h-fit border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
              <div className="switch-container text-[1.2rem]">
                <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center ">
                  <Switch
                    initialChecked={visa}
                    title="visa"
                    changeSwitchState={(value: boolean) =>
                      dispatch(OptionActions.setVisa(value))
                    }
                  />
                  <div>Visa Sponsored</div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div
          onClick={() => {
            setAdvancedShow(!advancedShow);
          }}
          className="flex  h-fit w-fit relative gap-[10px] py-[10px] items-center border-[1px] border-[#C8C8C8] px-[15px]  rounded-[8px] hover:border-[#3a90ff]"
        >
          <Image
            src="/svgs/thunder.svg"
            width={30}
            height={30}
            alt="thunder"
          ></Image>
          <div className="font-inter font-semibold text-[18px]">
            Advanced Filters
          </div>
          <div className="absolute -top-[10px]  h-[20px] w-[20px]  -right-[10px] bg-[#3a90ff] flex items-center justify-center    text-white z-40 rounded-full ">
            <div className="leading-none">{advancedFilterCount}</div>
          </div>
        </div>
        <div className="text-[18px] font-medium">
          Land your <span className="text-[#3a90ff]">Dream Job</span>
        </div>
        <div
          className={`filter-10 filter   relative max-w-[90%]`}
          onClick={() => {
            setactiveDropdown("filter-10");
          }}
          data-closed="false"
        >
          <div
            id={"Advanceddiv"}
            className=" border   relative flex items-center justify-between  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
          >
            <div
              id="Advancedtitle"
              className="px-[10px] flex gap-[10px]  items-center text-black-500 text-[1.2rem]"
            >
              {selectadvancedOption}
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
          </div>

          {activeDropdown === "filter-10" && (
            <div
              id={"Advanceddropdown"}
              className="drop-down-list top-full translate-y-4   bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0  top-[55px] absolute shadow-custom"
              style={{ zIndex: 9999 }}
            >
              {AdvancedList.map((location, index) => (
                <div
                  onClick={(e) => {
                    setselectadvancedOption(location);
                  }}
                  key={index + "loc"}
                  className="p-[5px]  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  text-[1.2rem] text-[600]"
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
    </div>
  );
};

export default Filter;
