"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, BadgeCheck, ChevronRight, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

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
        <div className="flex flex-col h-full bg-background/50">
            {/* Search Header */}
            <div className="p-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg tracking-tight">Sohbetler</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="Yeni Sohbet">
                        <MessageSquarePlus className="h-5 w-5 text-primary" />
                    </Button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Sohbetlerde ara..."
                        className="pl-9 bg-muted/40 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-xl h-10 shadow-sm text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground space-y-4">
                        <div className="p-4 bg-muted/30 rounded-full animate-pulse">
                            <Search className="h-8 w-8 opacity-50" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">
                                {searchQuery ? "Sonuç bulunamadı" : "Mesaj kutun boş"}
                            </p>
                            <p className="text-xs max-w-[200px] mx-auto opacity-70">
                                {searchQuery ? "Farklı bir isimle aramayı dene." : "Arkadaşlarınla konuşmaya başlamak için birini seç."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {filteredConversations.map((conv) => {
                            const isUnread = conv.lastMessage && !conv.lastMessage.is_read && conv.lastMessage.sender_id !== "me";
                            const isActive = activeId === conv.id;

                            return (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link href={`/mesajlar?c=${conv.id}`} className="block">
                                        <div className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden border border-transparent",
                                            isActive
                                                ? "bg-primary/10 border-primary/5 shadow-sm"
                                                : "hover:bg-muted/60 hover:border-border/40"
                                        )}>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full"
                                                />
                                            )}

                                            <div className="relative shrink-0">
                                                <Avatar className={cn(
                                                    "h-12 w-12 border-2 shadow-sm transition-transform group-hover:scale-105",
                                                    isActive ? "border-primary/20" : "border-background"
                                                )}>
                                                    <AvatarImage src={conv.otherUser?.avatar_url || ""} className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold text-sm">
                                                        {conv.otherUser?.full_name?.charAt(0) || conv.otherUser?.username?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isUnread && (
                                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-background flex items-center justify-center shadow-sm z-10">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className={cn(
                                                        "font-semibold truncate text-sm flex items-center gap-1.5",
                                                        isActive ? "text-primary" : "text-foreground"
                                                    )}>
                                                        {conv.otherUser?.full_name || conv.otherUser?.username}
                                                        {conv.otherUser?.is_verified && (
                                                            <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10 flex-shrink-0" />
                                                        )}
                                                    </span>
                                                    {conv.lastMessage && (
                                                        <span className={cn(
                                                            "text-[10px] flex-shrink-0 font-medium tabular-nums",
                                                            isUnread ? "text-primary" : "text-muted-foreground/60"
                                                        )}>
                                                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: false, locale: tr })}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.lastMessage && (
                                                    <div className="flex justify-between items-center gap-2">
                                                        <p className={cn(
                                                            "text-xs truncate max-w-[180px] leading-relaxed",
                                                            isUnread ? "font-medium text-foreground" : "text-muted-foreground"
                                                        )}>
                                                            {conv.lastMessage.sender_id === "me" && <span className="opacity-70 mr-1">Sen:</span>}
                                                            {conv.lastMessage.content}
                                                        </p>
                                                        {isActive && (
                                                            <ChevronRight className="h-3 w-3 text-primary/50" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
