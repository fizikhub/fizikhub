"use client";

import { useRef, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";

interface GlitchTextProps {
    text: string;
    className?: string;
}

export const GlitchText = ({ text, className }: GlitchTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        let iteration = 0;

        clearInterval(intervalRef.current as NodeJS.Timeout);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                prev
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }

            iteration += 1 / 3;
        }, 30);
    };

    const handleMouseLeave = () => {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setDisplayText(text);
    };

    return (
        <span
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {displayText}
        </span>
    );
};
