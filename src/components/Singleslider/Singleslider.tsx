import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SingleSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
  value: number[]; // Controlled prop from parent
  onValueChange: (value: number[]) => void; // Callback
}

const SingleSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SingleSliderProps
>(({ className, value, onValueChange, min = 0, max = 100, ...props }, ref) => {
  const [isInteracting, setIsInteracting] = React.useState(false);

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      min={min}
      max={max}
      onValueChange={onValueChange}
      onPointerDown={() => setIsInteracting(true)} // Detect when dragging starts
      onPointerUp={() =>
        setTimeout(() => {
          setIsInteracting(false);
        }, 300)
      } // Detect when dragging ends
      {...props}
    >
      {/* Slider Track */}
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-[#dfe8f4]">
        <SliderPrimitive.Range className="absolute h-full bg-[#1976D2]" />
      </SliderPrimitive.Track>

      {/* Slider Thumb */}
      <SliderPrimitive.Thumb
        className={cn(
          "relative block h-6 w-6 rounded-full bg-[#1976D2] transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
          "hover:ring-4 hover:ring-blue-400 hover:ring-opacity-50",
          "focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
        )}
      >
        {/* Conditional Popup */}
        <span
          className={cn(
            "absolute    -top-9 text-sm font-semibold text-white bg-blue-600 px-1 py-0.5 rounded shadow-md transition-all ease-in-out duration-200",
            isInteracting
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          )}
        >
          {value}
        </span>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});

SingleSlider.displayName = "SingleSlider";

export { SingleSlider };
