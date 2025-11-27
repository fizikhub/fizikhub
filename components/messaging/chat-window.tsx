"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCheck, Heart, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft, BadgeCheck, AlertTriangle } from "lucide-react";
import { sendMessage, getMessages, markAsRead, toggleLike } from "@/app/mesajlar/actions";
import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: number;
    content: string;
    sender_id: string;
    created_at: string;
    is_read: boolean;
    is_liked: boolean;
}

interface ChatWindowProps {
    conversationId: string;
    currentUser: any;
    otherUser: any;
}

export function ChatWindow({ conversationId, currentUser, otherUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const loadMessages = async () => {
            setLoading(true);
            const data = await getMessages(conversationId);
            setMessages(data || []);
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        };

        loadMessages();
        markAsRead(conversationId);

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    if (newMessage.sender_id !== currentUser.id) {
                        markAsRead(conversationId);
                    }
                    setMessages(prev => {
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        if (newMessage.sender_id === currentUser.id) {
                            const optimisticMatch = prev.find(m =>
                                m.sender_id === currentUser.id &&
                                m.content === newMessage.content &&
                                m.id > 1000000000000
                            );
                            if (optimisticMatch) {
                                return prev.map(m => m.id === optimisticMatch.id ? newMessage : m);
                            }
                        }
                        return [...prev, newMessage];
                    });
                    setTimeout(scrollToBottom, 100);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const updatedMessage = payload.new as Message;
                    setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    const handleLike = async (messageId: number, currentLikeStatus: boolean) => {
        setMessages(prev => prev.map(m =>
            m.id === messageId ? { ...m, is_liked: !currentLikeStatus } : m
        ));
        await toggleLike(messageId, currentLikeStatus);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage("");

        const optimisticMessage: Message = {
            id: Date.now(),
            content: content,
            sender_id: currentUser.id,
            created_at: new Date().toISOString(),
            is_read: false,
            is_liked: false,
        };
        setMessages(prev => [...prev, optimisticMessage]);
        setTimeout(scrollToBottom, 100);

        const result = await sendMessage(conversationId, content);
        if (!result.success) {
            toast.error("Mesaj gönderilemedi.");
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
    };

    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return "Bugün";
        if (isYesterday(date)) return "Dün";
        return format(date, "d MMMM yyyy", { locale: tr });
    };

    return (
        <div className="flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative pb-28 md:pb-0">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur-md border-b shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Link href="/mesajlar" className="md:hidden text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <Link href={`/kullanici/${otherUser?.username}`}>
                        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
                            <AvatarImage src={otherUser?.avatar_url || ""} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {otherUser?.full_name?.charAt(0) || otherUser?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col">
                        <Link href={`/kullanici/${otherUser?.username}`} className="font-semibold hover:underline decoration-primary/50 flex items-center gap-1">
                            {otherUser?.full_name || otherUser?.username}
                            {otherUser?.is_verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                            )}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            @{otherUser?.username}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 z-0">
                {/* Admin Warning */}
                {(otherUser?.username?.toLowerCase() === 'barannnbozkurttb' || otherUser?.email === 'barannnbozkurttb.b@gmail.com') && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4 flex items-start gap-3 mx-auto max-w-2xl">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">Dikkat!</h4>
                            <p className="text-sm text-yellow-700/90 dark:text-yellow-400/90">
                                Desdur! Admin hazretleri ile konuşacaksın.
                            </p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                        <div className="bg-primary/10 p-6 rounded-full">
                            <span className="text-4xl">👋</span>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">Sohbet Başladı</p>
                            <p className="text-sm text-muted-foreground">İlk mesajı göndererek sohbeti başlat!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const isMe = msg.sender_id === currentUser.id;
                            const showDate = index === 0 || formatMessageDate(messages[index - 1].created_at) !== formatMessageDate(msg.created_at);

                            return (
                                <div key={msg.id} className="space-y-6">
                                    {showDate && (
                                        <div className="flex justify-center sticky top-2 z-10">
                                            <span className="bg-card/80 backdrop-blur-sm shadow-sm px-3 py-1 rounded-full text-xs font-medium text-muted-foreground border">
                                                {formatMessageDate(msg.created_at)}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
                                    >
                                        <div
                                            className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm border ${isMe
                                                ? "bg-[#d9fdd3] dark:bg-[#005c4b] border-transparent rounded-tr-none"
                                                : "bg-white dark:bg-[#202c33] border-transparent rounded-tl-none"
                                                }`}
                                            onDoubleClick={() => handleLike(msg.id, msg.is_liked)}
                                        >
                                            <p className="text-sm sm:text-base leading-relaxed break-words text-foreground/90">
                                                {msg.content}
                                            </p>
                                            <div className="flex items-center justify-end gap-1 mt-1 select-none">
                                                <span className="text-[10px] text-muted-foreground/80">
                                                    {format(new Date(msg.created_at), "HH:mm", { locale: tr })}
                                                </span>
                                                {isMe && (
                                                    <span title={msg.is_read ? "Okundu" : "İletildi"}>
                                                        <CheckCheck className={`h-3.5 w-3.5 ${msg.is_read ? "text-blue-500" : "text-muted-foreground/60"}`} />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Like Heart */}
                                            <AnimatePresence>
                                                {msg.is_liked && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                        className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-md border"
                                                    >
                                                        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card/95 backdrop-blur-md border-t z-10">
                <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                        <Smile className="h-6 w-6" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    <div className="flex-1 bg-muted/50 rounded-2xl border focus-within:ring-1 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Bir mesaj yaz..."
                            className="border-0 bg-transparent focus-visible:ring-0 py-3 px-4 min-h-[44px]"
                        />
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className={`rounded-full h-11 w-11 transition-all duration-300 ${newMessage.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
