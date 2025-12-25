"use client";

import { LazyMotion, domMax } from "framer-motion";

export function FramerMotionProvider({ children }: { children: React.ReactNode }) {
    return (
        <LazyMotion features={domMax}>
            {children}
        </LazyMotion>
    );
}
