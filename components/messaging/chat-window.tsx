"use client";

import { useState, useEffect, useRef } from "react";
import { Message, sendMessage } from "@/app/mesajlar/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

interface ChatWindowProps {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
}

export function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Subscribe to new messages
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
            alert("Mesaj gönderilemedi: " + result.error);
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
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe
                                        ? "bg-primary text-primary-foreground rounded-br-sm"
                                        : "bg-muted rounded-bl-sm"
                                        }`}
                                >
                                    <p className="text-sm break-words">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
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
