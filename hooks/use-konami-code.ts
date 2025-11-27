"use client";

import { useEffect, useRef } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
];

export function useKonamiCode(callback: () => void) {
    // Use ref instead of state to avoid re-renders and unused variable warnings
    const inputRef = useRef<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const currentInput = inputRef.current;
            const newInput = [...currentInput, event.code].slice(-10);

            inputRef.current = newInput;

            if (newInput.join(",") === KONAMI_CODE.join(",")) {
                callback();
                inputRef.current = [];
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [callback]);
}
