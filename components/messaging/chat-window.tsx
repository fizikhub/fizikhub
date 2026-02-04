"use client";

import { useState, useEffect, useRef } from "react";
import { Message, sendMessage, deleteMessage, likeMessage, getMessageLikes, markAsRead } from "@/app/mesajlar/actions";
import { Send, Heart, Trash2, MoreVertical, CheckCheck, Smile, Paperclip, Image as ImageIcon, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

    // SMOOTH SCROLL TO BOTTOM
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // REALTIME SUBSCRIPTIONS
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

    useEffect(() => {
        markAsRead(conversationId);
    }, [conversationId, messages.length]);

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

    // HANDLERS
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
            toast.error("Mesaj gönderilemedi");
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
        }
    };

    const handleDelete = async (messageId: number) => {
        setMessages((prev) => prev.filter(m => m.id !== messageId));
        await deleteMessage(messageId);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#050505] font-[family-name:var(--font-outfit)] relative overflow-hidden">

            {/* SUBTLE AURORA BACKGROUND */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#FACC15]/5 to-transparent pointer-events-none" />

            {/* CHAT AREA */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth z-10 space-y-2">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-60">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-tr from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3">
                                <Sparkles className="w-10 h-10 text-[#FACC15]" />
                            </div>
                            <div className="absolute -inset-1 blur-xl bg-[#FACC15]/20 -z-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-black text-2xl text-white tracking-tight mb-2">Sohbeti Başlat</h3>
                            <p className="text-zinc-500 font-medium">Bu sohbetteki ilk mesajı sen gönder.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender_id === currentUserId;
                        const msgLikes = likes[msg.id] || { count: 0, likedByMe: false };
                        const prevMsg = messages[index - 1];
                        const nextMsg = messages[index + 1];

                        const isFirstInSequence = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                        const isLastInSequence = !nextMsg || nextMsg.sender_id !== msg.sender_id;

                        const showAvatar = !isMe && isLastInSequence;
                        const isLiked = msgLikes.likedByMe;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                layout
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={cn(
                                    "flex w-full group relative",
                                    isMe ? "justify-end" : "justify-start",
                                    isFirstInSequence ? "mt-4" : "mt-1"
                                )}
                                key={msg.id}
                            >
                                <div className={cn("flex max-w-[85%] sm:max-w-[70%] items-end gap-2.5", isMe ? "flex-row-reverse" : "flex-row")}>

                                    {/* AVATAR SLOT (PRESERVE SPACE) */}
                                    <div className="w-8 flex-shrink-0">
                                        {!isMe && showAvatar && (
                                            <Avatar className="w-8 h-8 rounded-full ring-2 ring-[#050505]">
                                                <AvatarImage src={otherUserAvatar || ""} />
                                                <AvatarFallback className="bg-zinc-800 text-[10px] font-bold text-zinc-400">?</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>

                                    {/* BUBBLE */}
                                    <div className="relative">
                                        <div
                                            onDoubleClick={() => handleDoubleClick(msg.id)}
                                            className={cn(
                                                "px-5 py-3 text-[15px] leading-relaxed transition-all shadow-sm backdrop-blur-sm select-none",
                                                // SHAPE LOGIC
                                                isMe
                                                    ? "rounded-2xl rounded-tr-md bg-[#FACC15] text-black font-medium"
                                                    : "rounded-2xl rounded-tl-md bg-zinc-800/80 text-white border border-white/5",

                                                // SEQUENCE LOGIC
                                                !isFirstInSequence && isMe && "rounded-tr-2xl",
                                                !isFirstInSequence && !isMe && "rounded-tl-2xl",
                                                !isLastInSequence && isMe && "rounded-br-md",
                                                !isLastInSequence && !isMe && "rounded-bl-md",

                                                isLiked && "ring-2 ring-white/20 transform scale-[1.02]"
                                            )}
                                        >
                                            {msg.content}
                                        </div>

                                        {/* META INFO (TIMESTAMP + CHECKS) */}
                                        <div className={cn(
                                            "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 h-full -right-14",
                                            !isMe && "left-full pl-2 right-auto"
                                        )}>
                                            <span className="text-[10px] text-zinc-500 font-bold tabular-nums">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && <CheckCheck className="w-3 h-3 text-[#FACC15]" />}
                                        </div>

                                        {/* LIKE BADGE */}
                                        <AnimatePresence>
                                            {msgLikes.count > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className={cn(
                                                        "absolute -bottom-2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border-2 border-[#050505] shadow-sm",
                                                        isLiked ? "bg-red-500 text-white" : "bg-zinc-700 text-zinc-200"
                                                    )}
                                                    style={{ right: isMe ? 0 : 'auto', left: isMe ? 'auto' : 0 }}
                                                >
                                                    <Heart className="w-2.5 h-2.5 fill-current" />
                                                    {msgLikes.count > 1 && <span className="text-[9px] font-bold">{msgLikes.count}</span>}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* DELETE (ONLY ON HOVER & ME) */}
                                        {isMe && (
                                            <div className="absolute top-1/2 -translate-y-1/2 -left-8 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleDelete(msg.id)} className="p-1.5 bg-zinc-900/80 rounded-full text-zinc-400 hover:text-red-500 hover:bg-zinc-900">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* INPUT AREA - GLASS DOCK */}
            <div className="p-4 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 sticky bottom-0 z-20">
                <div className="max-w-4xl mx-auto flex items-end gap-3">

                    {/* ATTACHMENT BUTTONS */}
                    <div className="flex gap-1 pb-1">
                        <button className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                    </div>

                    {/* TEXT AREA */}
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus-within:border-[#FACC15]/50 rounded-[26px] flex items-center transition-all shadow-sm">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Mesaj yaz..."
                            className="w-full bg-transparent text-white placeholder:text-zinc-500 text-[15px] font-medium focus:outline-none py-3.5 px-5 max-h-32 min-h-[48px] resize-none overflow-hidden"
                            rows={1}
                            style={{ height: 'auto', minHeight: '48px' }}
                        />
                        <button onClick={() => toast.info('Yakında!')} className="pr-4 text-zinc-500 hover:text-[#FACC15] transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    {/* SEND BUTTON - POP COLOR */}
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending}
                        className="
                            h-12 w-12 shrink-0 
                            bg-[#FACC15] text-black 
                            rounded-full 
                            flex items-center justify-center 
                            shadow-[0px_4px_12px_rgba(250,204,21,0.3)]
                            hover:scale-105 active:scale-95 transition-all 
                            disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 disabled:shadow-none
                        "
                    >
                        <Send className={cn("w-5 h-5 ml-0.5 stroke-[2.5px]", sending && "animate-pulse")} />
                    </button>
                </div>
            </div>
        </div>
    );
}
