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
import { initialize } from "next/dist/server/lib/render-server";

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  type RootState = ReturnType<typeof store.getState>;
  const advancedShow = useSelector(
    (state: RootState) => state.Auth.advancedShow
  );

  const jobtitle = useSelector((state: RootState) => state.Filter.jobtitle);
  const locationtype = useSelector(
    (state: RootState) => state.Filter.locationtype
  );
  const userId = useSelector((state: RootState) => state.Auth.UserId);
  const Selectlocationtypes = useSelector(
    (state: RootState) => state.Filter.Selectlocationtypes
  );
  const sliderValue = useSelector(
    (state: RootState) => state.Filter.sliderValue
  );
  const singleSlidervalue = useSelector(
    (state: RootState) => state.Filter.singleSlidervalue
  );

  const currentPage = useSelector((state: RootState) => state.Auth.currentPage);

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
  const extraOption = useSelector((state: RootState) => state.Auth.extraOption);
  const searchParams = useSearchParams();
  const [experienceEdited, setExperienceEdited] = useState<boolean>(false);
  const [salaryEdited, setSalaryEdited] = useState<boolean>(false);
  const [dateEdited, setdateEdited] = useState<boolean>(false);

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

  const [advancedFilterCount, setadvancedFilterCount] = useState<number>(0);
  const [activeDropdown, setactiveDropdown] = useState<string | null>(null);

  const [Locationvalue, setLocationvalue] = useState<string>("");

  const [initialRender, setinitialRender] = useState<boolean>(false);
  const [intialValuesUpdated, setIntialValuesUpdated] =
    useState<boolean>(false);
  const [paramsUpdated, setParamsUpdated] = useState<boolean>(false);
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
    let UserIdValue = dispatch(Authactions.getCookie("userId")).payload;
    // alert(UserIdValue);
    if (UserIdValue?.length) {
      dispatch(Authactions.setloggedIn(true));
      dispatch(Authactions.setUserId(UserIdValue));
    }
  }, []);

  const updateJobsData = async (
    accessToken: string,
    refreshToken: string
  ): Promise<number> => {
    let response = await fetch("/api/get-jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        jobtitle,
        Selectlocationtypes,
        salaryRange: sliderValue,
        selectedIndustries: SelectedIndustries,
        jobDomains: Selectjobcategory,
        experienceValue: Experiencevalue,
        employmentType: selectedEmptype,
        locations: SelectedLocations,
        Visa: visa,
        NoExperience,
        NoSalary,
        Remote: remote,
        daysPosted: singleSlidervalue,
        page: currentPage,
        extraOption,
      }),
    });
    let data = await response.json();
    if (response.ok || response.status === 401) {
      if (currentPage > data.maxPaginationCount) {
        dispatch(Authactions.setCurrentPage(1));
      }
      dispatch(Authactions.setTotalPages(data?.maxPaginationCount));

      dispatch(
        Authactions.setCurrentJobs(
          data?.jobs[0]?.paginatedJobs?.length ? data.jobs[0].paginatedJobs : []
        )
      );
      if (response.status === 401) {
        // console.log("Authentication required !");
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        dispatch(
          Authactions.seterrorshow("Please Login to Get Access to all Jobs")
        );
        timeoutRef.current = setTimeout(() => {
          dispatch(Authactions.seterrorshow(""));
        }, 3000);
        dispatch(Authactions.deleteCookie("userId"));
        dispatch(Authactions.setUserId(null));
        dispatch(Authactions.setloggedIn(false));
      }
    }
    return response.status;
  };

  const getJobs = async () => {
    try {
      dispatch(Authactions.setIsJobsLoading(true));
      if (!paramsUpdated || !intialValuesUpdated) {
        return;
      }
      let accessToken = dispatch(Authactions.getCookie("accessToken")).payload;
      let refreshToken = dispatch(
        Authactions.getCookie("refreshToken")
      ).payload;
      let jobsStatus = await updateJobsData(accessToken, refreshToken);
      if (jobsStatus === 403) {
        if (!refreshToken) {
          updateJobsData("", "");
          // console.log("Authentication required!");
          dispatch(Authactions.setloggedIn(false));

          // if (timeoutRef.current) {
          //   clearTimeout(timeoutRef.current);
          // }
          // dispatch(
          //   Authactions.seterrorshow("Please Login to Get Access To all Jobs")
          // );
          // timeoutRef.current = setTimeout(() => {
          //   dispatch(Authactions.seterrorshow(""));
          // }, 3000);
          // dispatch(Authactions.setCurrentJobs([]));
          // dispatch(Authactions.deleteCookie("userId"));
          // dispatch(Authactions.setUserId(null));

          return;
        }
        const response = await fetch("/api/tokens/generate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // console.log(data);
          dispatch(
            Authactions.setCookieInMinutes({
              name: "accessToken",
              value: data.accessToken,
              expirationMinutes: 4,
            })
          );
          let jobsStatus = await updateJobsData(data.accessToken, refreshToken);
        }
        if (!response.ok) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          dispatch(
            Authactions.seterrorshow("Please Login to Get Access To all Jobs")
          );
          timeoutRef.current = setTimeout(() => {
            dispatch(Authactions.seterrorshow(""));
          }, 3000);
          dispatch(Authactions.setCurrentJobs([]));
          dispatch(Authactions.deleteCookie("userId"));
          dispatch(Authactions.setUserId(null));
          dispatch(Authactions.setloggedIn(false));
        }
      }
    } catch (err) {
      // console.log(err);
    } finally {
      dispatch(Authactions.setIsJobsLoading(false));
    }
  };

  useEffect(() => {
    getJobs();
  }, [searchParams, extraOption, paramsUpdated, intialValuesUpdated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("Experience") || params.has("Include_no_yeo")) {
      setExperienceEdited(true);
    } else {
      setExperienceEdited(false);
    }

    if (params.has("salary") || params.has("Include_no_salary")) {
      setSalaryEdited(true);
    } else {
      setSalaryEdited(false);
    }
    if (params.has("datePosted")) {
      setdateEdited(true);
    } else {
      setdateEdited(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // console.log(params);
    const paramsList = ["JobTitle", "LocationType"];
    const paramfunctions = [
      FilterActions.setjobtitle,
      FilterActions.setSelectlocationtypes,
    ];
    let currentList;
    if (params.has("Sort")) {
      let sortMethod = params.get("Sort");
      let decodedLocation = sortMethod?.replace("-", " ");

      if (decodedLocation && AdvancedList.includes(decodedLocation)) {
        dispatch(Authactions.setExtraOption(decodedLocation));
      }
    }
    if (params.has("Page")) {
      let currentPage = params.get("Page");
      if (currentPage && typeof parseInt(currentPage) === "number") {
        dispatch(Authactions.setCurrentPage(parseInt(currentPage)));
      }
    }
    paramsList.forEach((param, idx) => {
      // console.log(param);
      if (params.has(param)) {
        currentList = params.get(param)?.split(",");
        // console.log(currentList);
        // console.log(paramfunctions[idx]);
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
        // console.log("exp is ");
        // console.log(salaryRange);
        dispatch(FilterActions.setSliderValue(salaryRange));
        salaryChangeShower(salaryRange);
      }
    }
    if (params.has("Include_no_salary")) {
      let currentValue = Boolean(params.get("Include_no_salary"));
      dispatch(OptionActions.setNoSalary(currentValue));
    }
    if (params.has("Location")) {
      let Locationslist = params.get("Location")?.split(",");
      if (Locationslist) {
        // console.log("locs  is ");
        // console.log(Locationslist);
        const filteredData = countryData.filter((item) =>
          Locationslist.includes(item.country)
        );
        dispatch(FilterActions.setSelectedLocations(filteredData));
      }
    }
    if (params.has("Experience")) {
      let currentList = params.get("Experience")?.split("-").map(Number);
      // console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setExperiencevalue(numList));
      }

      // console.log(currentList);
    }
    setParamsUpdated(true);
  }, []);

  const getLatestbuttonValues = useMemo(
    () => ({
      visa: visa,
      Include_no_yeo: NoExperience,
      remote: remote,
    }),
    []
  );

  async function getUserData() {
    let response = await fetch(`/api/get-user/${userId}`);
    let data = await response.json();
    if (response.ok && data.user) {
      // console.log(data.user);
      dispatch(Authactions.setUser(data.user));
    }
  }

  useEffect(() => {
    if (!userId || !userId.length) {
      return;
    }
    getUserData();
  }, [userId]);

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
      // console.log("I am running first hahah");
      dispatch(Authactions.setAdvancedShow(true));

      const params = new URLSearchParams(window.location.search);

      const paramList = Object.keys(getLatestValues);
      paramList.pop();
      const paramfunctions = [
        FilterActions.setSelectedIndustries,
        FilterActions.setSelectjobcategory,
        FilterActions.setselectedEmptype,
      ];
      let currentList = [];
      const buttonParamList = Object.keys(getLatestbuttonValues);

      const buttonfunctions = [
        OptionActions.setVisa,
        OptionActions.setNoExperience,
        OptionActions.setRemote,
      ];
      let currentVal;
      buttonParamList.forEach((param, idx) => {
        if (params.has(param)) {
          currentVal = Boolean(params.get(param));

          dispatch(buttonfunctions[idx](currentVal));
        }
      });
      paramList.forEach((param, idx) => {
        if (params.has(param)) {
          currentList = params.get(param)?.split(",")!;
          // console.log(currentList);
          // console.log(paramfunctions[idx]);
          dispatch(paramfunctions[idx](currentList));
        }
      });
    }
    setIntialValuesUpdated(true);
    setinitialRender(true);
  }, []);

  useEffect(() => {
    if (!advancedShow && initialRender) {
      const params = new URLSearchParams(window.location.search);

      const paramList = Object.keys(getLatestValues);
      const paramfunctions = [
        FilterActions.setSelectedIndustries,
        FilterActions.setSelectjobcategory,
        FilterActions.setselectedEmptype,
        FilterActions.setSelectedLocations,
      ];
      // console.log(paramList);
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
    // console.log(Locationdropdown);
  }, [Locationdropdown]);

  useEffect(() => {
    // console.log(searchParams.get("JobTitle"));
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
      { content: jobtitle },
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
      // console.log("values");
      // console.log(con);
      // console.log(idx);

      if (
        activeDropdown !== data.root &&
        con[idx].content !== null &&
        Array.isArray(con[idx].content) &&
        con[idx].content.length === 0
      ) {
        // console.log(data.root + " accessed ");
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
      // console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setExperiencevalue(numList));
      }

      // console.log(currentList);
    }
    if (params.has("salary")) {
      let currentList = params.get("salary")?.split("-");
      // console.log("paramsList is ");
      if (currentList) {
        const numList = currentList.map(Number);
        dispatch(FilterActions.setSliderValue(numList));
      }
    }
    if (params.has("datePosted")) {
      let currentList = params.get("datePosted");
      // console.log("paramsList is ");
      if (currentList) {
        const numList = [parseInt(currentList)];
        // console.log(numList);
        dispatch(FilterActions.setsingleSlidervalue(numList));
      }
    }
    if (params.has("Sort")) {
      let location = params.get("Sort");
      let decodedLocation;
      if (location) {
        decodedLocation = location.replace("-", " ");
        advancedChangeHandler(decodedLocation);
      }
    }
  };

  useEffect(() => {
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
    // console.log("clicked");
    // console.log(e.target);

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
      // console.log("clicked outside");

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
  const advancedChangeHandler = (location: string) => {
    const params = new URLSearchParams(window.location.search);

    dispatch(Authactions.setExtraOption(location));
    let formattedLocation = location.replace(" ", "-");

    params.set("Sort", formattedLocation);
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  };

  useEffect(() => {
    salaryChangeShower(sliderValue);
  }, [sliderValue]);

  const handleSingleValueChange = (value: number[]) => {
    dispatch(FilterActions.setsingleSlidervalue(value));

    setdatepostedshower(value + " days ago ");
  };

  return (
    <div className="flex flex-col mt-3  gap-[30px]">
      <div className="filters-wrapper relative flex xs:gap-5 gap-[30px]  flex-wrap justify-start sm:justify-center w-full">
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
          className="filter-5 filter  relative"
          onClick={() => {
            setactiveDropdown("filter-5");
          }}
          data-closed="false"
          style={{ position: "relative" }}
        >
          <div
            className={`absolute h-3 w-3 rounded-full -top-1 -right-1 z-20  ${
              dateEdited ? "bg-[#3A90FF]" : " bg-gray-500"
            }`}
          ></div>
          <div className=" relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
            <div className="w-[200px] xs:w-[180px] font-medium xs:text-base text-lg">
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
                className="drop-down-list  rounded-md flex flex-col gap-[15px] py-[20px] px-[15px] rounded-mg bg-white  top-[55px] left-0 xs:w-[250px] w-[350px] shadow-custom absolute"
                style={{ zIndex: 9999 }}
              >
                <div className="Singleslider-container flex flex-col gap-[20px]">
                  <div className="salary-desc flex justify-between">
                    <div className="">Date Posted</div>
                    <div className="font-semibold text-base">
                      {datepostedshower}
                    </div>
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
          <div
            className={`absolute h-3 w-3 rounded-full -top-1 -right-1 z-20  ${
              salaryEdited ? "bg-[#3A90FF]" : " bg-gray-500"
            }`}
          ></div>
          <div className=" relative flex items-center border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
            <div className="w-[200px] xs:w-[180px] font-medium text-lg xs:text-base">
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
                className="drop-down-list drop-down-salary  rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] bg-white absolute top-[55px] left-0 xs:w-[270px] w-[350px] shadow-custom"
                style={{ zIndex: 9999 }}
              >
                <div className="DualRangeslider-container flex flex-col gap-[20px]">
                  <div className="salary-desc flex justify-between">
                    <div>salary</div>
                    <div className="font-semibold text-base">
                      {Slideprevalue}
                    </div>
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
                    <div className="font-medium xs:py-1 xs:text-base text-lg">
                      Include No salary Info
                    </div>
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
              <div
                className={`absolute h-3 w-3 rounded-full -top-1 -right-1 z-20 ${
                  experienceEdited ? "bg-[#3A90FF]" : " bg-gray-500"
                }`}
              ></div>
              <div className=" relative flex items-center  border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
                <div className="w-[200px] xs:w-[180px] xs:text-base text-lg font-medium">
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
                    className="drop-down-list drop-down-experience  bg-white rounded-md flex flex-col gap-[15px] py-[15px] px-[15px] absolute top-[55px] left-0 xs:w-[270px] w-[350px] shadow-custom"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="DualRangeslider-container flex flex-col gap-[20px]">
                      <div className="salary-desc flex justify-between">
                        <div>Experience</div>
                        <div className="text-base font-semibold">
                          {Experienceprevalue}
                        </div>
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
                        <div className="font-medium xs:py-1 xs:text-base text-lg">
                          Include No YEO info
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

            <div className=" h-fit border-[1px] border-[#C8C8C8] px-6 py-[5px] rounded-[8px] hover:border-[#3a90ff]">
              <div className="switch-container text-[1.2rem]">
                <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center ">
                  <Switch
                    initialChecked={visa}
                    title="visa"
                    changeSwitchState={(value: boolean) =>
                      dispatch(OptionActions.setVisa(value))
                    }
                  />
                  <div className="font-medium xs:text-base text-lg">
                    Visa Sponsored
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
      <div className="flex items-center flex-wrap gap-3 justify-between">
        <div
          onClick={() => {
            dispatch(Authactions.setAdvancedShow(!advancedShow));
          }}
          className="flex  h-fit w-fit relative gap-[10px] xs:py-2 py-[10px] items-center border-[1px] border-[#C8C8C8] px-[15px]  rounded-[8px] hover:border-[#3a90ff]"
        >
          <Image
            src="/svgs/thunder.svg"
            width={30}
            height={30}
            alt="thunder"
          ></Image>
          <div className="font-inter xs:text-base font-semibold text-[18px]">
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
            className="    relative flex items-center justify-between  border-[1px] border-[#C8C8C8] px-[15px] xs:px-0 py-[8px] rounded-[8px] hover:border-[#3a90ff]"
          >
            <div
              id="Advancedtitle"
              className="px-[10px] flex gap-[10px] xs:text-sm  items-center text-lg font-medium"
            >
              {extraOption}
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
              className="drop-down-list top-full translate-y-4   bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] left-0   absolute shadow-custom"
              style={{ zIndex: 9999 }}
            >
              {AdvancedList.map((location, index) => (
                <div
                  onClick={() => {
                    advancedChangeHandler(location);
                  }}
                  key={index + "loc"}
                  className="p-[5px] text-base xs:text-sm font-medium  hover:bg-[#4aa3fa] hover:text-white cursor-pointer  "
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
