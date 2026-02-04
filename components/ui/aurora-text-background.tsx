"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuroraTextBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
}

export const AuroraTextBackground = ({
    className,
    children,
    ...props
}: AuroraTextBackgroundProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center overflow-hidden bg-[#09090b]",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={cn(
                        `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,#a855f7_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,_50%_50%]
            filter blur-[10px] invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] 
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-40 will-change-transform`,
                        `dark:[background-image:var(--dark-gradient),var(--aurora)]`
                    )}
                ></div>
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};
