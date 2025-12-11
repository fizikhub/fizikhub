"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollFixer() {
    const pathname = usePathname();

    useLayoutEffect(() => {
        // Smooth scroll'u geçici olarak devre dışı bırak
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);

        // Biraz bekleyip smooth scroll'u geri aç (varsa)
        const timeout = setTimeout(() => {
            document.documentElement.style.removeProperty("scroll-behavior");
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
