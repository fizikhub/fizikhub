"use client";

import { useEffect, useState } from "react";
import { Conversation, getConversations } from "@/app/mesajlar/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-client";

interface ConversationListProps {
    initialConversations: Conversation[];
    currentConversationId: string | null;
}

export function ConversationList({
    initialConversations,
    currentConversationId,
}: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [searchQuery, setSearchQuery] = useState("");
    const supabase = createClient();

    // Optimistic updates via subscription
    useEffect(() => {
        // Determine the user ID from the initial conversations or fetch it
        // For simplicity, we just refetch on changes to 'conversations' table or 'messages'
        // A proper implementation would subscribe to specific user channels

        // Subscribe to realtime changes
        const channel = supabase
            .channel('public:conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
                // Simple approach: Refetch all conversations when a message changes
                // "Super" approach would be to patch the state locally
                refreshConversations();
            })
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
        <div className="flex h-full flex-col">
            <div className="p-4 border-b space-y-4">
                <h2 className="text-xl font-bold px-2">Mesajlar</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Konuşma ara..."
                        className="pl-8 bg-muted/50 border-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {filteredConversations.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Konuşma bulunamadı.
                        </div>
                    )}

                    {filteredConversations.map((conversation) => {
                        const isActive = conversation.id === currentConversationId;
                        const otherUser = conversation.otherUser;
                        const lastMsg = conversation.lastMessage;

                        return (
                            <Link
                                key={conversation.id}
                                href={`/mesajlar?c=${conversation.id}`}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-accent card-hover-effect",
                                    isActive ? "bg-accent/80 shadow-sm border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarImage src={otherUser?.avatar_url || ""} />
                                        <AvatarFallback>{otherUser?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {/* Online indicator placeholder - strict realtime online status is complex, skipping for now or faking */}
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold truncate">
                                            {otherUser?.full_name || otherUser?.username || "Silinmiş Kullanıcı"}
                                        </span>
                                        {lastMsg && (
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-1">
                                        <p className={cn(
                                            "truncate text-sm max-w-[180px]",
                                            conversation.unreadCount && conversation.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                                        )}>
                                            {lastMsg ? (
                                                <>
                                                    {lastMsg.sender_id === otherUser?.id ? "" : "Siz: "}
                                                    {lastMsg.content}
                                                </>
                                            ) : "Henüz bir mesaj yok"}
                                        </p>

                                        {conversation.unreadCount && conversation.unreadCount > 0 ? (
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-bounce">
                                                {conversation.unreadCount}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
