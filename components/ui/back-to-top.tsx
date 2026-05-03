"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            setIsVisible(window.scrollY > 400);
        };

        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="
                        fixed bottom-24 right-6 z-40
                        w-12 h-12
                        bg-black text-[#FACC15]
                        border-2 border-white
                        shadow-[4px_4px_0px_#FACC15]
                        rounded-xl
                        flex items-center justify-center
                        cursor-pointer
                        transition-transform duration-150
                        hover:-translate-y-1 hover:scale-105 active:scale-95
                        md:bottom-8
                    "
        >
            <ArrowUp className="w-6 h-6 stroke-[3px]" />
        </button>
    );
}
