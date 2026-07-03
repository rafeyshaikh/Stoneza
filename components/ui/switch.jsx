"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "data-[state=checked]:bg-stone-900",
        "data-[state=unchecked]:bg-stone-400",
        "dark:data-[state=checked]:bg-stone-100",
        "dark:data-[state=unchecked]:bg-stone-700",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full bg-white shadow transition-transform",
          "data-[state=checked]:translate-x-5",
          "data-[state=unchecked]:translate-x-0",
          "dark:bg-stone-900"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };