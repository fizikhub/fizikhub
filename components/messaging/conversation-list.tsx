"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, BadgeCheck } from "lucide-react";
import { useState } from "react";

interface Conversation {
    id: string;
    otherUser: {
        username: string;
        full_name: string | null;
        avatar_url: string | null;
        is_verified?: boolean;
    } | null;
    lastMessage: {
        content: string;
        created_at: string;
        is_read: boolean;
        sender_id: string;
    } | null;
}

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
    const searchParams = useSearchParams();
    const activeId = searchParams.get("c");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = conversations.filter(conv =>
        conv.otherUser?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="p-3 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Sohbetlerde ara..."
                        className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all rounded-xl h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        {searchQuery ? "Sonuç bulunamadı." : "Henüz hiç mesajın yok."}
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const isUnread = conv.lastMessage && !conv.lastMessage.is_read && conv.lastMessage.sender_id !== "me";

                        return (
                            <Link href={`/mesajlar?c=${conv.id}`} key={conv.id}>
                                <div className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden",
                                    activeId === conv.id
                                        ? "bg-primary/10 hover:bg-primary/15"
                                        : "hover:bg-muted/80"
                                )}>
                                    {activeId === conv.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                    )}

                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarImage src={conv.otherUser?.avatar_url || ""} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {conv.otherUser?.full_name?.charAt(0) || conv.otherUser?.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className={cn(
                                                "font-medium truncate text-sm flex items-center gap-1",
                                                activeId === conv.id ? "text-primary font-semibold" : "text-foreground"
                                            )}>
                                                {conv.otherUser?.full_name || conv.otherUser?.username}
                                                {conv.otherUser?.is_verified && (
                                                    <BadgeCheck className="h-3 w-3 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                                                )}
                                            </span>
                                            {conv.lastMessage && (
                                                <span className={cn(
                                                    "text-[10px] flex-shrink-0 ml-2",
                                                    isUnread ? "text-primary font-bold" : "text-muted-foreground"
                                                )}>
                                                    {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: false, locale: tr })}
                                                </span>
                                            )}
                                        </div>
                                        {conv.lastMessage && (
                                            <div className="flex justify-between items-center gap-2">
                                                <p className={cn(
                                                    "text-xs truncate max-w-[180px]",
                                                    isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {conv.lastMessage.sender_id === "me" && <span className="mr-1">Sen:</span>}
                                                    {conv.lastMessage.content}
                                                </p>
                                                {isUnread && (
                                                    <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm animate-pulse" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
