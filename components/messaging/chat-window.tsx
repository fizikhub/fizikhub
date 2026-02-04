"use client";

import { useState, useEffect, useRef } from "react";
import { Message, sendMessage, deleteMessage, likeMessage, getMessageLikes, markAsRead } from "@/app/mesajlar/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Heart, Trash2, MoreVertical, CheckCheck, Smile } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
    initialLikes?: { [messageId: number]: { count: number; likedByMe: boolean } };
    otherUserAvatar?: string | null;
}

export function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    initialLikes = {},
    otherUserAvatar
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const [likes, setLikes] = useState(initialLikes);
    const [likingId, setLikingId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom logic
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Realtime Subs
    useEffect(() => {
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
                const newMessage = payload.new as Message;
                setMessages((prev) => prev.find(m => m.id === newMessage.id) ? prev : [...prev, newMessage]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
                const deletedId = (payload.old as any).id;
                setMessages((prev) => prev.filter(m => m.id !== deletedId));
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId, supabase]);

    // Mark as read
    useEffect(() => {
        markAsRead(conversationId);
    }, [conversationId, messages.length]);

    // Likes Sub
    useEffect(() => {
        const channel = supabase
            .channel(`likes:${conversationId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'message_likes' }, async () => {
                const newLikes = await getMessageLikes(conversationId);
                setLikes(newLikes);
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [conversationId, supabase]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || sending) return;

        const content = inputText;
        setInputText("");
        setSending(true);

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
            setMessages((prev) => prev.filter(m => m.id !== tempMessage.id));
            toast.error("İletilemedi. İnternetini falan filan kontrol et.");
        }
    };

    const handleDoubleClick = async (messageId: number) => {
        if (likingId) return;
        setLikingId(messageId);

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
            setLikes(prev => ({ ...prev, [messageId]: currentLike }));
        } else if (result.liked) {
            // Maybe play a sound?
        }
    };

    const handleDelete = async (messageId: number) => {
        setMessages((prev) => prev.filter(m => m.id !== messageId));
        await deleteMessage(messageId);
    };

    // Group messages by minute to avoid repeated timestamps/avatars
    // Simple logic: if previous msg sender is same, hide avatar

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#050505]">

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                            <Smile className="w-10 h-10 text-zinc-500" />
                        </div>
                        <p className="font-bold text-xl text-white">Sohbet Başlangıcı</p>
                        <p className="text-zinc-500 text-sm mt-1">İlk mesajı göndererek sessizliği boz.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const msgLikes = likes[msg.id] || { count: 0, likedByMe: false };
                        const prevMsg = messages[index - 1];
                        // const nextMsg = messages[index + 1];
                        const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== msg.sender_id);
                        const isLiked = msgLikes.likedByMe;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                                key={msg.id}
                            >
                                <div className={cn("flex max-w-[85%] sm:max-w-[70%] gap-3", isMe ? "flex-row-reverse" : "flex-row")}>

                                    {/* Avatar (Left side only) */}
                                    <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                                        {!isMe && showAvatar && (
                                            <Avatar className="w-8 h-8 ring-2 ring-[#050505]">
                                                <AvatarImage src={otherUserAvatar || ""} />
                                                <AvatarFallback className="text-[10px] bg-zinc-800 text-zinc-400 font-bold">?</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className="relative group">
                                        <div
                                            onDoubleClick={() => handleDoubleClick(msg.id)}
                                            className={cn(
                                                "px-4 py-2.5 text-[15px] leading-relaxed transition-all shadow-sm",
                                                isMe
                                                    ? "bg-[#FACC15] text-black font-medium rounded-2xl rounded-tr-sm" // My Bubble: Yellow, Top-Right Sharp
                                                    : "bg-zinc-800 text-white rounded-2xl rounded-tl-sm", // Other Bubble: Dark Grey, Top-Left Sharp
                                            )}
                                        >
                                            {msg.content}

                                            {/* Timestamp & Checks */}
                                            <div className={cn(
                                                "text-[9px] font-bold tracking-wide mt-1 flex items-center gap-1 opacity-70",
                                                isMe ? "justify-end text-black/60" : "justify-end text-zinc-400"
                                            )}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <CheckCheck className="w-3 h-3 text-black/50" />}
                                            </div>
                                        </div>

                                        {/* Actions (Delete only for me) */}
                                        {isMe && (
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDelete(msg.id)} className="p-1.5 hover:bg-zinc-800 text-zinc-600 hover:text-red-500 rounded-full transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Like Reaction */}
                                        <AnimatePresence>
                                            {msgLikes.count > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className={cn(
                                                        "absolute border-2 border-[#050505] px-1.5 py-0.5 flex items-center gap-1 rounded-full shadow-sm z-10",
                                                        isLiked ? "bg-red-500 text-white" : "bg-zinc-700 text-white"
                                                    )}
                                                    style={{
                                                        bottom: -10,
                                                        right: isMe ? 0 : 'auto',
                                                        left: isMe ? 'auto' : 0,
                                                    }}
                                                >
                                                    <Heart className="w-2.5 h-2.5 fill-current" />
                                                    {msgLikes.count > 1 && <span className="text-[9px] font-bold">{msgLikes.count}</span>}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Bar - Elegant & Fixed */}
            <div className="p-3 sm:p-4 bg-[#050505] border-t border-zinc-900 sticky bottom-0 z-20">
                <div className="max-w-4xl mx-auto flex items-end gap-3">

                    <button className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    <div className="flex-1 bg-zinc-900 rounded-[24px] flex items-center relative border-2 border-transparent focus-within:border-[#FACC15]/50 transition-colors">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Bir mesaj yaz..."
                            className="w-full bg-transparent text-white placeholder:text-zinc-500 text-base font-medium focus:outline-none py-3 px-4 max-h-32 min-h-[44px] resize-none overflow-hidden"
                            rows={1}
                            style={{ height: 'auto', minHeight: '44px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending}
                        className="h-12 w-12 shrink-0 bg-[#FACC15] text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                    >
                        <Send className={cn("w-5 h-5 ml-0.5", sending && "animate-pulse")} />
                    </button>
                </div>
            </div>

        </div>
    );
}
