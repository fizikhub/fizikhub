import React from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
    text: string;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
}

export function GlitchText({ text, className, as: Component = "span" }: GlitchTextProps) {
    return (
        <Component
            className={cn("glitch inline-block relative", className)}
            data-text={text}
        >
            {text}
        </Component>
    );
}
