"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = "top", ...props }, ref) => {
  const initialValue = Array.isArray(props.value)
    ? props.value
    : [props.min ?? 0, props.max ?? 100];

  // State to track whether the user is actively dragging
  const [isInteracting, setIsInteracting] = React.useState(false);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none  items-center",
        className
      )}
      {...props}
      onPointerDown={() => setIsInteracting(true)} // Detect when user starts dragging
      onPointerUp={() =>
        setTimeout(() => {
          setIsInteracting(false);
        }, 300)
      } // Detect when user stops dragging
    >
      {/* Slider Track */}
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-[#dfe8f4]">
        <SliderPrimitive.Range className="absolute h-full bg-[#1976D2]" />
      </SliderPrimitive.Track>

      {/* Map over min & max thumb values */}
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          {/* Always show the thumb with the blue color */}
          <SliderPrimitive.Thumb
            className={cn(
              "relative block h-6 w-6 rounded-full bg-[#1976D2] transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
              "hover:ring-4 hover:ring-blue-400 hover:ring-opacity-50",
              "focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
            )}
          >
            {/* Conditionally show the popup value only if dragging */}
            <span
              className={cn(
                "absolute -top-9 text-sm font-semibold text-white bg-blue-600 px-1 py-0.5 rounded shadow-md transition-all ease-in-out duration-200",
                isInteracting
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              )}
            >
              {value}
            </span>
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});

DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
