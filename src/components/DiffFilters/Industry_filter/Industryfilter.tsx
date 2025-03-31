import {
  Industries,
  industriesSubcategories,
} from "@/FiltersList/CategoryFilter";
import type { Subcategorytype } from "@/FiltersList/CategoryFilter";
import React, { useEffect, useRef, useState } from "react";

type stringfunc = (val: string[]) => void;

type IndustryFilterType = {
  SelectedIndustries: string[];
  setSelectedIndustries: stringfunc;
  activeDropdown: string | null;
  setactiveDropdown: (val: string) => void;
  setIndustrySubcategory: stringfunc;
  IndustrySubcategory: string[];
  CurrentIndustryVal: string;
  setCurrentIndustryVal: (val: string) => void;
  setIndustryDropDown: stringfunc;
  IndustryDropDown: string[];
  industriesSubcategories: Subcategorytype;
  Industries: string[];
  updateSearchParams: (value: string[], val: string) => void;
};
const Industryfilter: React.FC<IndustryFilterType> = ({
  SelectedIndustries,
  activeDropdown,
  setactiveDropdown,
  setSelectedIndustries,
  setIndustrySubcategory,
  IndustrySubcategory,
  CurrentIndustryVal,
  setCurrentIndustryVal,
  setIndustryDropDown,
  IndustryDropDown,
  industriesSubcategories,
  Industries,
  updateSearchParams,
}) => {
  const titleModified = "Industries";
  const Selectedvalues = useRef(SelectedIndustries);
  const locationdroptype = useRef(IndustryDropDown);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    updateSearchParams(SelectedIndustries, titleModified);
    Selectedvalues.current = SelectedIndustries;
  }, [SelectedIndustries]);

  const handlePopState = () => {
    const params = new URLSearchParams(window.location.search);
    console.log("paramsList is ");

    let paramsList = [{ param: titleModified, values: Selectedvalues.current }];

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
              divRef.current!
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
    let items = [...Industries];
    items = items.filter((item) =>
      item.toLowerCase().includes(CurrentIndustryVal.toLowerCase())
    );
    setIndustryDropDown(items);
  }, [CurrentIndustryVal]);

  const setlocationhandler = (loc: string, e: EventTarget) => {
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

    let newlocations = [...Selectedvalues.current];
    console.log(IndustryDropDown);
    let changedstr = loc.replace(/\(Select All\)/g, "").trim();
    if (newlocations.includes(changedstr)) {
      return;
    }
    newlocations.push(changedstr);
    setSelectedIndustries(newlocations);
    setCurrentIndustryVal("");

    // Reset expanded industry after selection
    setExpandedIndustry(null);
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
    setTimeout(() => {
      if (closestFilter) {
        closestFilter.setAttribute("data-closed", "false");
      }
    }, 200);

    let newlocations = [...SelectedIndustries];
    newlocations = newlocations.filter((location) => location !== loc);
    setSelectedIndustries(newlocations);
    console.log("len :" + SelectedIndustries.length);

    let locations = [...IndustryDropDown];
    locations.push(loc);
    locations.sort();
    setIndustryDropDown(locations);
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

  const handlelocationback = (e: string) => {
    if (
      e === "Backspace" &&
      Selectedvalues.current.length > 0 &&
      CurrentIndustryVal.length === 0
    ) {
      let duplicate = [...Selectedvalues.current];
      let last_ele: any = duplicate.pop();

      setSelectedIndustries(duplicate);
    }
  };

  const handleIndustryHover = (industry: string) => {
    if (!isSmallScreen) {
      setIndustrySubcategory(industriesSubcategories[industry]);
    }
  };

  const handleIndustryLeave = () => {
    if (!isSmallScreen) {
      setIndustrySubcategory([]);
    }
  };

  const handleIndustryClick = (e: React.MouseEvent, industry: string) => {
    if (isSmallScreen) {
      // Stop propagation to prevent immediate selection
      e.stopPropagation();

      // Toggle expanded industry
      if (expandedIndustry === industry) {
        setExpandedIndustry(null);
      } else {
        setExpandedIndustry(industry);
      }
    }
  };

  const handleSubcategoryClick = (e: React.MouseEvent, subcategory: string) => {
    e.stopPropagation(); // Prevent the click from affecting parent elements
    setlocationhandler(subcategory, e.target);
  };

  return (
    <div
      className={`filter-8 filter relative max-w-[90%]`}
      onClick={() => {
        setactiveDropdown("filter-8");
      }}
      data-closed="false"
    >
      <div
        id="IndustryTitle"
        ref={divRef}
        onClick={(e) => {
          changehandler("IndustryDiv", "IndustryInput");
        }}
        className="relative flex items-center justify-between border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]"
      >
        <div
          id="IndustryDiv"
          className="w-[200px] xs:w-[180px] font-medium xs:text-base text-lg"
        >
          Industry
        </div>
        <div className="options-list flex gap-[10px] flex-wrap xs:max-w-[94%] max-w-[97%]">
          {SelectedIndustries.map((loc, index) => (
            <div
              className="bg-[#F0F1FA] h-auto flex items-center gap-[5px] px-[5px] rounded-[5px]"
              key={index}
            >
              <div className="pl-[5px] line-height: normal py-1 font-roboto font-medium text-[900] xs:text-base text-lg">
                {loc}
              </div>
              <div
                className="wrongbutton mb-[1px] flex items-center font-lato text-base font-medium px-[5px]"
                onClick={(e) => {
                  clearhandler(loc, e);
                }}
              >
                x
              </div>
            </div>
          ))}
          <input
            id="IndustryInput"
            value={CurrentIndustryVal}
            onKeyDown={(e) => {
              handlelocationback(e.key);
            }}
            onChange={(e) => {
              setCurrentIndustryVal(e.target.value);
            }}
            className="hidden w-[200px] xs:w-[180px] font-medium xs:text-base text-lg"
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
        {activeDropdown === "filter-8" && (
          <div
            id="Drop-down-Industry-main"
            className={`Industries-DropdownContainer left-0 top-full translate-y-4 absolute ${
              isSmallScreen ? "flex flex-col" : "flex"
            }`}
            style={{ zIndex: 9999 }}
          >
            <div className="drop-down-list bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] shadow-custom">
              {IndustryDropDown.map((industry, index) => (
                <div key={index + "loc"} className="industry-item">
                  <div
                    onMouseEnter={() => handleIndustryHover(industry)}
                    onMouseLeave={() => handleIndustryLeave()}
                    onClick={(e) => {
                      if (isSmallScreen) {
                        handleIndustryClick(e, industry);
                      } else {
                        setlocationhandler(industry, e.target);
                      }
                    }}
                    className="p-[5px] hover:bg-[#4aa3fa] hover:text-white cursor-pointer font-medium text-base flex justify-between items-center"
                  >
                    <div className="drop-down-list-val w-auto px-[15px]">
                      {industry}
                    </div>
                  </div>

                  {/* For small screens, show subcategories below clicked industry */}
                  {isSmallScreen &&
                    expandedIndustry === industry &&
                    industriesSubcategories[industry]?.length > 0 && (
                      <div className="small-screen-subcategories ml-4 border-l-2 border-[#4aa3fa] pl-2">
                        {industriesSubcategories[industry].map(
                          (subcategory, subIndex) => (
                            <div
                              onClick={(e) =>
                                handleSubcategoryClick(e, subcategory)
                              }
                              key={subIndex + "sub"}
                              className="p-[5px] hover:bg-[#4aa3fa] hover:text-white cursor-pointer font-medium text-base"
                            >
                              <div className="drop-down-list-val w-auto px-[15px]">
                                {subcategory}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {!isSmallScreen && IndustrySubcategory.length > 0 && (
              <div
                id="Drop-down-Industry"
                onMouseLeave={() => {
                  setIndustrySubcategory([]);
                }}
                className="drop-down-list bg-white flex flex-col w-[300px] max-h-[300px] overflow-y-auto rounded-[4px] shadow-custom"
              >
                {IndustrySubcategory.map((location, index) => (
                  <div
                    onClick={(e) => {
                      setlocationhandler(location, e.target);
                    }}
                    key={index + "loc"}
                    className="p-[5px] hover:bg-[#4aa3fa] hover:text-white cursor-pointer font-medium text-base"
                  >
                    <div className="drop-down-list-val w-auto px-[15px]">
                      {location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Industryfilter;
