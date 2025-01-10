import { DualRangeSlider } from "@/components/DualRangeslider/Dualrange";
import { Switch } from "@/components/ui/switch";
import React, { useEffect } from "react";

type Filtertype4 = {
  setactiveDropdown: (value: string | null) => void;
  activeDropdown: string | null;
  Slideprevalue: string;
  switchname: string;
  sliderValue: number[];
  setSliderValue: (value: number[]) => void;
  root: string;
  setSlideprevalue: (value: string) => void;
};

const DualDropdown_slider: React.FC<Filtertype4> = ({
  setactiveDropdown,
  Slideprevalue,
  setSlideprevalue,
  switchname,
  activeDropdown,
  setSliderValue,
  sliderValue,
  root,
}) => {
  useEffect(() => {
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
  }, [sliderValue]);
  return (
    <div
      className={`${root}  filter relative`}
      onClick={() => {
        setactiveDropdown(root);
      }}
      data-closed="false"
    >
      <div className="border relative flex items-center gap-[5px] border-[1px] border-[#C8C8C8] px-[15px] py-[8px] rounded-[8px] hover:border-[#3a90ff]">
        <div className="w-[200px] text-black-500 text-[1.2rem]">
          Salary Range
        </div>
        <svg
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
                onValueChange={setSliderValue}
              />
            </div>
            <div className="switch-container text-[1.2rem]">
              <div className="switch-cont flex gap-[10px] p-[3px] justify-center items-center border-[1px] border-[#C8C8C8] rounded-[5px]">
                <Switch title="salary" />
                <div>Include No salary Info</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualDropdown_slider;
