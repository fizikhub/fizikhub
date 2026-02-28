"use client";

import { useEffect, useState } from "react";
import { Conversation, getConversations } from "@/app/mesajlar/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationListProps {
    initialConversations: Conversation[];
    currentUserId: string;
}

export function ConversationList({
    initialConversations,
    currentUserId,
}: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const supabase = createClient();

    // Realtime updates
    useEffect(() => {
        const channel = supabase
            .channel("inbox:updates")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "messages" },
                () => {
                    refreshConversations();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const refreshConversations = async () => {
        const data = await getConversations();
        setConversations(data);
    };

    const filteredConversations = conversations.filter((c) => {
        const name = c.otherUser?.full_name || c.otherUser?.username || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-2">
            {/* Search toggle */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="relative mb-3">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Konuşma ara..."
                                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FACC15]/30 transition-colors"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery("");
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search button */}
            {!showSearch && (
                <button
                    onClick={() => setShowSearch(true)}
                    className="w-full flex items-center gap-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-400 transition-all mb-3"
                >
                    <Search className="w-4 h-4" />
                    <span>Ara...</span>
                </button>
            )}

            {/* Conversation list */}
            {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">
                    Konuşma bulunamadı.
                </div>
            ) : (
                <div className="space-y-1.5">
                    {filteredConversations.map((conversation, i) => {
                        const otherUser = conversation.otherUser;
                        const hasUnread = conversation.unreadCount > 0;
                        const displayName = otherUser?.full_name || otherUser?.username || "Kullanıcı";
                        const initials = displayName.substring(0, 2).toUpperCase();

                        const lastMessageText = conversation.last_message_preview || conversation.lastMessage?.content;
                        const lastMessageTime = conversation.last_message_at || conversation.lastMessage?.created_at;
                        const isMyLastMessage = (conversation.last_message_sender_id || conversation.lastMessage?.sender_id) === currentUserId;

                        return (
                            <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.2 }}
                            >
                                <Link
                                    href={`/mesajlar/${conversation.id}`}
                                    className="block group"
                                >
                                    <div
                                        className={cn(
                                            "relative flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200",
                                            "bg-zinc-900/30 border border-transparent",
                                            "hover:bg-zinc-900/70 hover:border-white/[0.06]",
                                            hasUnread && "bg-zinc-900/60 border-[#FACC15]/10"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <Avatar className="h-12 w-12 border-2 border-zinc-800 group-hover:border-zinc-700 transition-colors rounded-full">
                                                <AvatarImage
                                                    src={otherUser?.avatar_url || ""}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-sm">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            {/* Online dot */}
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050505]" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3
                                                    className={cn(
                                                        "text-[15px] font-semibold truncate pr-2",
                                                        "group-hover:text-[#FACC15] transition-colors font-[family-name:var(--font-outfit)]",
                                                        hasUnread ? "text-white" : "text-zinc-200"
                                                    )}
                                                >
                                                    {displayName}
                                                </h3>
                                                {lastMessageTime && (
                                                    <span className="text-[11px] font-medium text-zinc-500 shrink-0 tabular-nums">
                                                        {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: false, locale: tr })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p
                                                    className={cn(
                                                        "text-[13px] truncate pr-3 max-w-[200px] sm:max-w-[280px]",
                                                        hasUnread
                                                            ? "text-zinc-200 font-medium"
                                                            : "text-zinc-500"
                                                    )}
                                                >
                                                    {lastMessageText ? (
                                                        <>
                                                            {isMyLastMessage && (
                                                                <span className="text-zinc-600 mr-1">Sen:</span>
                                                            )}
                                                            {lastMessageText}
                                                        </>
                                                    ) : (
                                                        <span className="italic opacity-50">Mesajlaşma başlatıldı</span>
                                                    )}
                                                </p>

                                                {/* Unread badge */}
                                                {hasUnread && (
                                                    <div className="w-5 h-5 bg-[#FACC15] text-black text-[10px] font-black flex items-center justify-center rounded-full shrink-0">
                                                        {conversation.unreadCount}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
