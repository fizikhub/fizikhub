"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface MessagingLayoutWrapperProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}

export function MessagingLayoutWrapper({
    children,
    sidebar,
}: MessagingLayoutWrapperProps) {
    const searchParams = useSearchParams();
    const currentConversationId = searchParams.get("c");

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-[#050505]">
            {/* Sidebar */}
            <div
                className={cn(
                    "h-full w-full border-r border-white/[0.06] md:w-[340px] lg:w-[380px] bg-[#050505]",
                    currentConversationId && "hidden md:block"
                )}
            >
                {sidebar}
            </div>

            {/* Main Chat */}
            <div
                className={cn(
                    "h-full w-full flex-1 bg-[#050505]",
                    !currentConversationId && "hidden md:block"
                )}
            >
                {children}
            </div>
        </div>
    );
}
