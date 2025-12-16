"use client";

import { useState, useEffect, useRef } from "react";
import { Message, sendMessage, deleteMessage, likeMessage, getMessageLikes } from "@/app/mesajlar/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Heart, Trash2, MoreVertical } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
    initialLikes?: { [messageId: number]: { count: number; likedByMe: boolean } };
}

export function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    initialLikes = {},
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [likingId, setLikingId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Subscribe to new messages and deletions
    useEffect(() => {
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => {
                        // Prevent duplicates
                        if (prev.find(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const deletedId = (payload.old as any).id;
                    setMessages((prev) => prev.filter(m => m.id !== deletedId));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    // Subscribe to likes
    useEffect(() => {
        const channel = supabase
            .channel(`likes:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'message_likes',
                },
                async () => {
                    // Refresh likes when any like changes
                    const newLikes = await getMessageLikes(conversationId);
                    setLikes(newLikes);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || sending) return;

        const content = inputText;
        setInputText("");
        setSending(true);

        // Optimistic update
        const tempMessage: Message = {
            id: Date.now(),
            conversation_id: conversationId,
            sender_id: currentUserId,
            content: content,
            is_read: false,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);

        const result = await sendMessage(conversationId, content);
        setSending(false);

        if (!result.success) {
            // Remove optimistic message on error
            setMessages((prev) => prev.filter(m => m.id !== tempMessage.id));
            toast.error("Mesaj gönderilemedi: " + result.error);
        }
    };

    const handleDelete = async (messageId: number) => {
        // Optimistic update
        setMessages((prev) => prev.filter(m => m.id !== messageId));

        const result = await deleteMessage(messageId);
        if (!result.success) {
            toast.error("Mesaj silinemedi");
            // Revert - fetch messages again would be needed for proper revert
        }
    };

    const handleDoubleClick = async (messageId: number) => {
        if (likingId) return; // Prevent double-triggering
        setLikingId(messageId);

        // Optimistic update
        const currentLike = likes[messageId] || { count: 0, likedByMe: false };
        setLikes(prev => ({
            ...prev,
            [messageId]: {
                count: currentLike.likedByMe ? currentLike.count - 1 : currentLike.count + 1,
                likedByMe: !currentLike.likedByMe
            }
        }));

        const result = await likeMessage(messageId);
        setLikingId(null);

        if (!result.success) {
            // Revert optimistic update
            setLikes(prev => ({
                ...prev,
                [messageId]: currentLike
            }));
            toast.error("Beğenilemedi");
        } else if (result.liked) {
            // Show heart animation feedback
            toast.success("❤️", { duration: 1000 });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] overflow-hidden">
            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/20"
            >
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-20">
                        Henüz mesaj yok. İlk mesajı sen gönder! 👋
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        const msgLikes = likes[msg.id] || { count: 0, likedByMe: false };

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                            >
                                <div className="relative flex items-end gap-1">
                                    {/* Message bubble */}
                                    <div
                                        onDoubleClick={() => handleDoubleClick(msg.id)}
                                        className={cn(
                                            "max-w-[70%] px-4 py-2 rounded-2xl cursor-pointer select-none transition-transform active:scale-95",
                                            isMe
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-muted rounded-bl-sm"
                                        )}
                                    >
                                        <p className="text-sm break-words">{msg.content}</p>

                                        {/* Like indicator */}
                                        {msgLikes.count > 0 && (
                                            <div className="flex items-center gap-1 mt-1 justify-end">
                                                <Heart className={cn(
                                                    "w-3 h-3",
                                                    msgLikes.likedByMe ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                                )} />
                                                {msgLikes.count > 1 && (
                                                    <span className="text-[10px] opacity-70">{msgLikes.count}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions menu (only for own messages) */}
                                    {isMe && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32">
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Hint text */}
            <div className="text-center text-xs text-muted-foreground py-1 border-t">
                💡 Beğenmek için mesaja çift tıkla
            </div>

            {/* Input - Sticky Bottom */}
            <div className="p-4 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t mt-auto">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        disabled={sending}
                        className="flex-1"
                        autoFocus
                    />
                    <Button type="submit" disabled={!inputText.trim() || sending} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
