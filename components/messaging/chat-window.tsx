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
        <div className="flex flex-col h-[85vh] sm:h-screen w-full bg-[#09090b] relative">

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Smile className="w-8 h-8 text-white" />
                        </div>
                        <p className="font-bold text-white">Sessizliği Boz</p>
                        <p className="text-xs">İlk mesajı gönderen sen ol.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const msgLikes = likes[msg.id] || { count: 0, likedByMe: false };
                        const prevMsg = messages[index - 1];
                        const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== msg.sender_id);
                        const isLiked = msgLikes.likedByMe;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                                key={msg.id}
                            >
                                <div className={cn("flex max-w-[85%] sm:max-w-[70%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>

                                    {/* Avatar (Only for other user, grouped) */}
                                    <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                                        {!isMe && showAvatar && (
                                            <Avatar className="w-8 h-8 border border-white/10">
                                                <AvatarImage src={otherUserAvatar || ""} />
                                                <AvatarFallback className="text-[10px] bg-zinc-800 text-white">?</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className="relative group">
                                        <div
                                            onDoubleClick={() => handleDoubleClick(msg.id)}
                                            className={cn(
                                                "px-4 py-2.5 shadow-md relative text-[15px] leading-relaxed select-none transition-all",
                                                isMe
                                                    ? "bg-[#FFC800] text-black font-medium rounded-2xl rounded-tr-sm"
                                                    : "bg-[#27272a] text-zinc-100 rounded-2xl rounded-tl-sm border border-white/5",
                                                isLiked && "scale-[1.02]" // Gentle pop when liked
                                            )}
                                        >
                                            {msg.content}

                                            {/* Timestamp (Bottom Right) */}
                                            <div className={cn("text-[9px] font-bold mt-1.5 opacity-40 flex items-center gap-1", isMe ? "justify-end text-black" : "justify-start text-white")}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <CheckCheck className="w-3 h-3 text-black/50" />}
                                            </div>
                                        </div>

                                        {/* Actions (Delete only for me) */}
                                        {isMe && (
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleDelete(msg.id)} className="p-1.5 hover:bg-red-500/20 rounded-full text-zinc-600 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Like Heart (Absolute Badge) */}
                                        <AnimatePresence>
                                            {msgLikes.count > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className={cn(
                                                        "absolute -bottom-2 border-2 border-[#09090b] rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-sm",
                                                        isLiked ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400"
                                                    )}
                                                    style={{ right: isMe ? 'auto' : -10, left: isMe ? -10 : 'auto' }}
                                                >
                                                    <Heart className="w-3 h-3 fill-current" />
                                                    {msgLikes.count > 1 && <span className="text-[10px] font-bold">{msgLikes.count}</span>}
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

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-zinc-900 border-t border-white/10 shrink-0">
                <div className="max-w-2xl mx-auto bg-black/50 border border-white/10 p-1.5 rounded-full flex items-center gap-2 pl-4 focus-within:ring-2 ring-[#FFC800]/50 transition-all">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Bir mesaj yaz..."
                        className="flex-1 bg-transparent text-white placeholder:text-zinc-500 text-sm font-medium focus:outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFC800] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>

        </div>
    );
}
