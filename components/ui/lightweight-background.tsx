"use client";

import { memo } from "react";

function LightweightBackgroundImpl() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
            {/* Ambient gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen" />

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </div>
    );
}

export const LightweightBackground = memo(LightweightBackgroundImpl);
