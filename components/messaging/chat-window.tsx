"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCheck, Heart, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft, BadgeCheck, AlertTriangle, Image as ImageIcon, Mic } from "lucide-react";
import { sendMessage, getMessages, markAsRead, toggleLike } from "@/app/mesajlar/actions";
import { format, isToday, isYesterday } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

    const [isBlocked, setIsBlocked] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);
    const [showBlockMenu, setShowBlockMenu] = useState(false);

    useEffect(() => {
        const checkBlock = async () => {
            const { checkBlockStatus } = await import("@/app/mesajlar/actions");
            const status = await checkBlockStatus(otherUser.id);
            setIsBlocked(status.isBlocked);
            setIsBlocking(status.isBlocking);
        };
        checkBlock();
    }, [otherUser.id]);

    const handleBlockToggle = async () => {
        const { blockUser, unblockUser } = await import("@/app/mesajlar/actions");
        if (isBlocking) {
            await unblockUser(otherUser.id);
            setIsBlocking(false);
            toast.success("Kullanıcının engeli kaldırıldı.");
        } else {
            await blockUser(otherUser.id);
            setIsBlocking(true);
            toast.success("Kullanıcı engellendi.");
        }
        setShowBlockMenu(false);
    };

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
        <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#0b141a] relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl border-b z-20 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/mesajlar" className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <Link href={`/kullanici/${otherUser?.username}`} className="relative group">
                        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                            <AvatarImage src={otherUser?.avatar_url || ""} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                {otherUser?.full_name?.charAt(0) || otherUser?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {otherUser?.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                                <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                            </div>
                        )}
                    </Link>
                    <div className="flex flex-col">
                        <Link href={`/kullanici/${otherUser?.username}`} className="font-semibold hover:underline decoration-primary/50 flex items-center gap-1 text-sm">
                            {otherUser?.full_name || otherUser?.username}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            @{otherUser?.username}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <div className="relative">
                        <Button variant="ghost" size="icon" onClick={() => setShowBlockMenu(!showBlockMenu)} className="rounded-full">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                        <AnimatePresence>
                            {showBlockMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-popover border rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                                >
                                    <button
                                        onClick={handleBlockToggle}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors"
                                    >
                                        <AlertTriangle className="h-4 w-4" />
                                        {isBlocking ? "Engeli Kaldır" : "Kullanıcıyı Engelle"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 z-10 custom-scrollbar">
                {/* Admin Warning */}
                {(otherUser?.username?.toLowerCase() === 'barannnbozkurttb' || otherUser?.email === 'barannnbozkurttb.b@gmail.com') && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4 flex items-start gap-3 mx-auto max-w-2xl shadow-sm backdrop-blur-sm"
                    >
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 text-sm">Dikkat!</h4>
                            <p className="text-sm text-yellow-700/90 dark:text-yellow-400/90 leading-relaxed">
                                Desdur! Admin hazretleri ile konuşacaksın.
                            </p>
                        </div>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                        <div className="bg-primary/10 p-6 rounded-full animate-pulse">
                            <span className="text-4xl">👋</span>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-lg">Sohbet Başladı</p>
                            <p className="text-sm text-muted-foreground">İlk mesajı göndererek sohbeti başlat!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const isMe = msg.sender_id === currentUser.id;
                            const showDate = index === 0 || formatMessageDate(messages[index - 1].created_at) !== formatMessageDate(msg.created_at);
                            const isConsecutive = index > 0 && messages[index - 1].sender_id === msg.sender_id && !showDate;

                            return (
                                <div key={msg.id} className={cn("space-y-6", isConsecutive && "mt-1 space-y-1")}>
                                    {showDate && (
                                        <div className="flex justify-center sticky top-2 z-10 my-4">
                                            <span className="bg-background/80 backdrop-blur-md shadow-sm px-3 py-1 rounded-full text-xs font-medium text-muted-foreground border ring-1 ring-border/5">
                                                {formatMessageDate(msg.created_at)}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex group",
                                            isMe ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "relative max-w-[85%] sm:max-w-[70%] px-4 py-2 shadow-sm border text-sm sm:text-base leading-relaxed break-words",
                                                isMe
                                                    ? "bg-[#d9fdd3] dark:bg-[#005c4b] border-transparent rounded-2xl rounded-tr-none text-foreground/90"
                                                    : "bg-white dark:bg-[#202c33] border-transparent rounded-2xl rounded-tl-none text-foreground/90",
                                                isConsecutive && isMe && "rounded-tr-2xl",
                                                isConsecutive && !isMe && "rounded-tl-2xl"
                                            )}
                                            onDoubleClick={() => handleLike(msg.id, msg.is_liked)}
                                        >
                                            {/* Tail for first message in group */}
                                            {!isConsecutive && (
                                                <svg
                                                    className={cn(
                                                        "absolute top-0 w-3 h-3 fill-current",
                                                        isMe ? "-right-2 text-[#d9fdd3] dark:text-[#005c4b]" : "-left-2 text-white dark:text-[#202c33]"
                                                    )}
                                                    viewBox="0 0 10 10"
                                                >
                                                    <path d={isMe ? "M0 0 L10 0 L0 10 Z" : "M10 0 L0 0 L10 10 Z"} />
                                                </svg>
                                            )}

                                            <p>{msg.content}</p>

                                            <div className={cn(
                                                "flex items-center gap-1 mt-1 select-none opacity-70 text-[10px]",
                                                isMe ? "justify-end" : "justify-start"
                                            )}>
                                                <span>
                                                    {format(new Date(msg.created_at), "HH:mm", { locale: tr })}
                                                </span>
                                                {isMe && (
                                                    <span title={msg.is_read ? "Okundu" : "İletildi"}>
                                                        <CheckCheck className={cn(
                                                            "h-3.5 w-3.5",
                                                            msg.is_read ? "text-blue-500" : "text-muted-foreground/60"
                                                        )} />
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
                                                        className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-md border ring-2 ring-background"
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
            <div className="p-3 bg-background/80 backdrop-blur-xl border-t z-20 sticky bottom-0">
                {isBlocked ? (
                    <div className="text-center text-muted-foreground py-4 bg-muted/50 rounded-xl border border-dashed">
                        Bu kullanıcı sizi engellediği için mesaj gönderemezsiniz.
                    </div>
                ) : isBlocking ? (
                    <div className="text-center text-muted-foreground py-4 bg-muted/50 rounded-xl border border-dashed flex flex-col items-center gap-2">
                        <span>Bu kullanıcıyı engellediniz.</span>
                        <Button variant="outline" size="sm" onClick={handleBlockToggle} className="text-destructive hover:text-destructive">
                            Engeli Kaldır
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
                        <div className="flex gap-1">
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex rounded-full hover:bg-muted">
                                <Smile className="h-6 w-6" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex rounded-full hover:bg-muted">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 bg-muted/40 rounded-3xl border border-transparent focus-within:border-primary/20 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Bir mesaj yaz..."
                                className="border-0 bg-transparent focus-visible:ring-0 py-3 px-4 min-h-[44px] placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {newMessage.trim() ? (
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all duration-300 hover:scale-105"
                            >
                                <Send className="h-5 w-5 ml-0.5" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="rounded-full h-11 w-11 text-muted-foreground hover:bg-muted transition-all"
                            >
                                <Mic className="h-5 w-5" />
                            </Button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
