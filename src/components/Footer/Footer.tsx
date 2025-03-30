import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Authactions } from "@/store/Substores/Authslice";
import store from "@/store";
import { OptionActions } from "@/store/Substores/Optionstore";
import { FilterActions } from "@/store/Substores/Filterstore";
import Link from "next/link";

import Image from "next/image";

const Footer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  type RootState = ReturnType<typeof store.getState>;
  const advancedShow = useSelector(
    (state: RootState) => state.Auth.advancedShow
  );
  const userId = useSelector((state: RootState) => state.Auth.UserId);

  const updateDetails = async (idx: number) => {
    dispatch(Authactions.setAdvancedShow(true));

    let params = new URLSearchParams(window.location.search);
    if (window.location.pathname === "/" && window.location.search) {
      await calculateScrollTime();
    } else {
      router.push("/");
    }

    if (idx === 1) {
      let filter = await waitForElementToExist(".filter-9");
      if (filter) {
        filter.click();
        let remoteElement = await waitForElementToExist(".remote");
        if (
          remoteElement.getAttribute("aria-checked") === "false" &&
          remoteElement
        ) {
          remoteElement.click();
        }

        params.set("remote", "true");
        dispatch(OptionActions.setRemote(true));
      }
    }
    if (idx === 2) {
      let visaElement = await waitForElementToExist(".visa");
      if (visaElement) {
        if (
          visaElement.getAttribute("aria-checked") === "false" &&
          visaElement
        ) {
          visaElement.click();
        }
        params.set("visa", "true");
        dispatch(OptionActions.setVisa(true));
      }
    }
    if (idx === 3) {
      let filter = await waitForElementToExist(".filter-1");
      if (filter) {
        params.set("Experience", "0-2");
        dispatch(FilterActions.setExperiencevalue([0, 2]));
      }
    }
    if (idx === 4) {
      let filter = await waitForElementToExist(".filter-1");
      if (filter) {
        params.set("Experience", "4-6");
        dispatch(FilterActions.setExperiencevalue([4, 6]));
      }
    }

    const newurl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newurl);

    await router.push(newurl, { scroll: false });
  };
  const calculateScrollTime = (duration = 300): Promise<void> => {
    return new Promise((resolve) => {
      const start = window.pageYOffset;
      const distance = start;

      const baseDuration = 300;
      const dynamicDuration = Math.min(
        Math.max((distance / window.innerHeight) * 200, 200),
        800
      );

      const startTime = performance.now();

      function animation(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / dynamicDuration, 1);

        const easingCurve = progress;

        window.scrollTo(0, start * (1 - easingCurve));

        if (elapsed < dynamicDuration) {
          requestAnimationFrame(animation);
        } else {
          window.scrollTo(0, 0);
          resolve();
        }
      }

      requestAnimationFrame(animation);
    });
  };

  const waitForElementToExist = (selector: string): Promise<HTMLElement> => {
    return new Promise((resolve) => {
      const existingElement = document.querySelector(selector);
      if (existingElement) {
        resolve(existingElement as HTMLElement);
        return;
      }

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element as HTMLElement);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    });
  };

  const InteractWithFilter = async (
    idx: number,
    ID1?: string,
    ID2?: string
  ) => {
    if (idx === 9 || idx === 8 || idx === 3) {
      dispatch(Authactions.setAdvancedShow(true));
    }

    if (window.location.pathname === "/" && window.location.search) {
      await calculateScrollTime();
    } else {
      await router.push("/");
    }

    const filter = await waitForElementToExist(`.filter-${idx}`);

    filter.click();
    filter.setAttribute("data-closed", "true");
    setTimeout(() => {
      filter.setAttribute("data-closed", "false");
    }, 500);

    if (ID1 && ID2) {
      dispatch(Authactions.changehandler({ ID1, ID2 }));
    }
  };
  return (
    <div className="flex md:flex-row flex-col flex-wrap  gap-5 select-none  md:justify-between py-3 px-10 w-full  ">
      <h2 className="bg-[linear-gradient(180deg,_#0ca3f3_25%,_#098ee7_75%)] font-[700] text-[1.6rem]  bg-clip-text text-transparent cursor-pointer">
        FlexiBoard
      </h2>
      <div className="flex flex-col gap-2">
        <div className="font-bold text-md ">Search</div>
        <div
          onClick={() => {
            if (window.location.pathname === "/" && window.location.search) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            } else {
              router.push("/");
            }
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Search all jobs
        </div>
        <div
          onClick={() => {
            InteractWithFilter(9, "LocationsearchDiv", "LocationsearchInput");
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Jobs by Country
        </div>
        <div
          onClick={() => {
            InteractWithFilter(1, "jobtitlediv", "jobtitleinput");
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Jobs by Job Title
        </div>
        <div
          onClick={() => {
            InteractWithFilter(4);
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Jobs by Salary
        </div>
        <div
          onClick={() => {
            InteractWithFilter(3, "domainDiv", "domainInput");
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Jobs by Category
        </div>
        <div
          onClick={() => {
            InteractWithFilter(8, "IndustryDiv", "IndustryInput");
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Jobs by Industry
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-bold text-md">Popular</div>
        <div
          onClick={() => {
            updateDetails(1);
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Remote Jobs
        </div>
        <div
          onClick={() => {
            updateDetails(2);
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Visa Sponsorship Jobs
        </div>
        <div
          onClick={() => {
            updateDetails(3);
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Entry level Jobs
        </div>
        <div
          onClick={() => {
            updateDetails(4);
          }}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Senior level Jobs
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="font-bold text-md">Useful Links</div>
        <Link
          href={userId ? "/Account" : "/Login"}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          Account
        </Link>
        <Link
          href={"/Resume-tailor"}
          className="text-sm font-medium text-gray-400 cursor-pointer hover:text-[#0CA3F3]"
        >
          AI Resume Tailor
        </Link>
      </div>
      <div className="flex flex-col gap-2 items-start md:items-center">
        <div className="font-bold text-md">Contact Us</div>
        <div className="flex gap-2 items-center">
          <Link href="https://www.linkedin.com/in/naveenkumar-sunkana-a40711250/">
            <Image
              alt="linkedin"
              width={5}
              height={5}
              className="w-8 h-8 bg-[#3B82F6] rounded-full p-1"
              src="/svgs/linkedin.svg"
            ></Image>
          </Link>
          <Image
            onClick={() => {
              window.location.href = `mailto:naveenkumar171837@gmail.com`;
            }}
            alt="email"
            width={5}
            height={5}
            className="w-8 h-8 bg-[#3B82F6] rounded-full p-1 cursor-pointer"
            src="/svgs/email.svg"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default Footer;
