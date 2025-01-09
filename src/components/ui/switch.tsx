"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CustomSwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  changeSwitchState?: (checked: boolean) => void;
  title: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  CustomSwitchProps
>(({ className, changeSwitchState, title, ...props }, ref) => {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const ChangeSwitchData = (val: boolean, name: string) => {
    const params = new URLSearchParams(window.location.search);
    if (val !== undefined) {
      params.set(name, val.toString());
    }
    const newurl = `${window.location.pathname}?${params.toString()}`;
    router.push(newurl, { scroll: false });
  };

  const changechecked = () => {
    const current = rootRef?.current;

    if (current) {
      const ariaChecked = rootRef.current.getAttribute("aria-checked");
      if (ariaChecked !== null && changeSwitchState) {
        let checked = ariaChecked === "true";
        changeSwitchState(checked);
        ChangeSwitchData(checked, title);
      }
    }
  };
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39393D] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#8CBAE8] data-[state=unchecked]:bg-black dark:focus-visible:ring-[#1976D2] dark:data-[state=checked]:bg-[#8CBAE8] dark:data-[state=unchecked]:bg-black",
        className
      )}
      {...props}
      ref={rootRef}
      onCheckedChange={changechecked}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-[#1976d2] data-[state=unchecked]:translate-x-1 dark:bg-gray-950 dark:data-[state=checked]:bg-[#1976d2] dark:data-[state=unchecked]:bg-white"
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
