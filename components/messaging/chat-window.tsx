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
        <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-[#09090b] relative">
            {/* NOISE & GRID BACKGROUND */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth z-10 relative">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center mb-6 shadow-[8px_8px_0px_#27272a] transform -rotate-3 hover:rotate-0 transition-all duration-300">
                            <Smile className="w-12 h-12 text-[#FACC15] stroke-[1.5px]" />
                        </div>
                        <p className="font-black text-2xl text-white uppercase tracking-tight">Sinyal Yok</p>
                        <div className="h-1 w-12 bg-[#FACC15] my-3"></div>
                        <p className="text-zinc-500 font-mono text-sm">İlk frekansı sen başlat.</p>
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
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                                key={msg.id}
                            >
                                <div className={cn("flex max-w-[85%] sm:max-w-[70%] gap-3", isMe ? "flex-row-reverse" : "flex-row")}>

                                    {/* Avatar */}
                                    <div className="w-10 flex-shrink-0 flex flex-col justify-end">
                                        {!isMe && showAvatar && (
                                            <Avatar className="w-10 h-10 border-2 border-zinc-800 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                                                <AvatarImage src={otherUserAvatar || ""} />
                                                <AvatarFallback className="text-xs bg-[#FACC15] text-black font-bold">?</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className="relative group">
                                        <div
                                            onDoubleClick={() => handleDoubleClick(msg.id)}
                                            className={cn(
                                                "px-5 py-3.5 shadow-lg relative text-[15px] leading-relaxed select-none transition-all duration-200 border-2",
                                                isMe
                                                    ? "bg-[#FACC15] text-black font-bold border-black shadow-[5px_5px_0px_rgba(0,0,0,1)] rounded-none"
                                                    : "bg-[#18181b] text-zinc-100 border-zinc-700 shadow-[5px_5px_0px_rgba(0,0,0,1)] rounded-none",
                                                isLiked && "scale-[1.02] ring-2 ring-white/20"
                                            )}
                                        >
                                            {/* Neo-brutalist Notch */}
                                            <div className={cn(
                                                "absolute w-3 h-3 border-2 border-inherit bg-inherit rotate-45",
                                                isMe ? "-right-1.5 bottom-4 border-l-0 border-b-0" : "-left-1.5 bottom-4 border-r-0 border-t-0"
                                            )}></div>

                                            {msg.content}

                                            {/* Timestamp (Bottom Right) */}
                                            <div className={cn("text-[8px] font-black tracking-wider mt-2 flex items-center gap-1 opacity-70", isMe ? "justify-end text-black/60" : "justify-end text-zinc-500")}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && <CheckCheck className="w-3 h-3 text-black/50" />}
                                            </div>
                                        </div>

                                        {/* Actions (Delete only for me) */}
                                        {isMe && (
                                            <div className="absolute top-0 -left-10 opacity-0 group-hover:opacity-100 transition-opacity h-full flex items-center">
                                                <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-500 hover:text-white bg-zinc-900 border border-zinc-700 text-zinc-500 transition-all rounded-none shadow-[2px_2px_0px_#000]">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Like Heart (Absolute Badge with Pop) */}
                                        <AnimatePresence>
                                            {msgLikes.count > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0, rotate: 45 }}
                                                    className={cn(
                                                        "absolute border-2 border-black px-2 py-0.5 flex items-center gap-1 shadow-[3px_3px_0px_#000] z-10",
                                                        isLiked ? "bg-red-600 text-white" : "bg-zinc-800 text-white"
                                                    )}
                                                    style={{
                                                        bottom: -15,
                                                        right: isMe ? 'auto' : -10,
                                                        left: isMe ? -10 : 'auto',
                                                        transform: isMe ? 'rotate(-5deg)' : 'rotate(5deg)'
                                                    }}
                                                >
                                                    <Heart className="w-3 h-3 fill-current" />
                                                    {msgLikes.count > 1 && <span className="text-[10px] font-black">{msgLikes.count}</span>}
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

            {/* Input Bar - Floating Dock Style */}
            <div className="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex justify-center pb-6">
                <div className="w-full max-w-2xl bg-[#18181b]/90 backdrop-blur-xl border-2 border-zinc-700/50 p-2 shadow-[0px_8px_40px_rgba(0,0,0,0.5)] flex items-center gap-2 pointer-events-auto transition-all focus-within:border-[#FACC15] focus-within:shadow-[0px_0px_0px_2px_#FACC15] group hover:scale-[1.01]">

                    {/* Media Button (Mock) */}
                    <button className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Şifreli mesajını yaz..."
                        className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-base font-medium focus:outline-none px-2 font-mono"
                    />

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending}
                        className="w-12 h-10 bg-[#FACC15] text-black border-2 border-black flex items-center justify-center hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:shadow-none"
                    >
                        <Send className="w-5 h-5 stroke-[2.5px]" />
                    </button>
                </div>
            </div>

        </div>
    );
}
