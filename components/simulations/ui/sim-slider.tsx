"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const SimSlider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden bg-white border-2 border-black dark:bg-zinc-900 dark:border-white">
            <SliderPrimitive.Range className="absolute h-full bg-[#FFC800]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-6 w-6 border-2 border-black bg-white shadow-[2px_2px_0px_#000] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-100 dark:border-white dark:shadow-[2px_2px_0px_#fff]" />
    </SliderPrimitive.Root>
));
SimSlider.displayName = SliderPrimitive.Root.displayName;

export { SimSlider };
