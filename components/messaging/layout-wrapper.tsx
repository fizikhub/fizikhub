"use client";

import { useState, useEffect } from "react";
import { Conversation } from "@/app/mesajlar/actions";
import { ConversationList } from "./conversation-list";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MessagingLayoutWrapperProps {
    children: React.ReactNode;
    initialConversations: Conversation[];
}

export function MessagingLayoutWrapper({
    children,
    initialConversations,
}: MessagingLayoutWrapperProps) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [mobileView, setMobileView] = useState<"list" | "chat">("list");
    const searchParams = useSearchParams();
    const currentConversationId = searchParams.get("c");

    useEffect(() => {
        if (currentConversationId) {
            setMobileView("chat");
        } else {
            setMobileView("list");
        }
    }, [currentConversationId]);

    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Sidebar List */}
            <div
                className={cn(
                    "h-full w-full border-r bg-card md:w-[350px] lg:w-[400px]",
                    mobileView === "chat" && "hidden md:block"
                )}
            >
                <ConversationList
                    initialConversations={conversations}
                    currentConversationId={currentConversationId}
                />
            </div>

            {/* Main Chat Area */}
            <div
                className={cn(
                    "h-full w-full flex-1 bg-background",
                    mobileView === "list" && "hidden md:block" // On mobile detail view only show if view is chat
                )}
            >
                {children}
            </div>
        </div>
    );
}
