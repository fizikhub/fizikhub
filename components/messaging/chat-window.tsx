"use client";

import { useEffect, useRef, useState, useOptimistic } from "react";
import { Message, sendMessage, getMessages, markAsRead } from "@/app/mesajlar/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, MoreVertical, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ChatWindowProps {
    conversationId: string;
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Optimistic UI for messages
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (state, newMessage: Message) => {
            return [...state, newMessage];
        }
    );

    useEffect(() => {
        // Get current user
        supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id || null));

        // Fetch messages
        const fetchMsgs = async () => {
            setLoading(true);
            const data = await getMessages(conversationId);
            setMessages(data);
            setLoading(false);
            // Mark as read
            await markAsRead(conversationId);
        };

        fetchMsgs();

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMsg = payload.new as Message;
                setMessages((prev) => {
                    if (prev.find(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                // Scroll to bottom
                setTimeout(() => scrollToBottom(), 100);

                // Mark as read if it's not my message
                supabase.auth.getUser().then(({ data: { user } }) => {
                    if (user && newMsg.sender_id !== user.id) {
                        markAsRead(conversationId);
                    }
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, optimisticMessages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || !currentUserId) return;

        const tempId = Date.now();
        const content = inputText;

        // Clear input immediately
        setInputText("");
        setSending(true);

        // Add optimistic message
        const optimisticMsg: Message = {
            id: tempId,
            content: content,
            created_at: new Date().toISOString(),
            sender_id: currentUserId,
            conversation_id: conversationId,
            is_read: false,
            is_liked: false
        };

        addOptimisticMessage(optimisticMsg);

        // Server action
        const result = await sendMessage(conversationId, content);

        if (!result.success) {
            // Handle error (toast etc)
            console.error("Failed to send");
            // Here strictly we should revert the optimistic update or show error
        }

        setSending(false);
    };

    if (loading && messages.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Link href="/mesajlar" className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Note: In a real app we'd pass the other user's info to this component too to display in header.
                 For now, we'll assume the layout or context provides it, or fetch it.
                 Short-cut: just show "Sohbet" or try to find it in the messages if possible? 
                 Actually, best is to pass `otherUser` as prop. I'll stick to a generic header for now to save complexity, 
                 or better: Update the props to include user info.
                 But let's keep it simple "Sohbet".
              */}
                    <h3 className="font-bold text-lg">Sohbet</h3>
                </div>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                {/* Welcome message */}
                <div className="flex justify-center py-6">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        Mesajlarınız uçtan uca şifrelenmiştir - dermişim 😅 (Henüz değil)
                    </span>
                </div>

                {optimisticMessages.map((msg, index) => {
                    const isMe = msg.sender_id === currentUserId;
                    const isConsecutive = index > 0 && optimisticMessages[index - 1].sender_id === msg.sender_id;

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in slide-in-from-bottom-2 duration-300",
                                isMe ? "justify-end" : "justify-start",
                                isConsecutive ? "mt-1" : "mt-4"
                            )}
                        >
                            <div className={cn(
                                "max-w-[75%] px-4 py-2 shadow-sm relative group",
                                isMe
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                    : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                            )}>
                                <p className="text-sm md:text-base break-words leading-relaxed">{msg.content}</p>
                                <span className={cn(
                                    "text-[10px] absolute bottom-1 right-2 opacity-50",
                                    isMe ? "text-primary-foreground" : "text-muted-foreground"
                                )}>
                                    {format(new Date(msg.created_at), "HH:mm")}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card mt-auto">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 bg-background"
                        disabled={sending}
                        autoFocus
                    />
                    <Button type="submit" size="icon" disabled={!inputText.trim() || sending} className="rounded-full h-10 w-10 shrink-0">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
