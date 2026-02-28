"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/app/mesajlar/actions";
import { useChat } from "@/hooks/use-chat";
import { MessageBubble } from "./message-bubble";
import { DateSeparator } from "./date-separator";
import { cn } from "@/lib/utils";
import {
    Send,
    Sparkles,
    X,
    Paperclip,
    Reply,
    Search,
    ArrowDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchMessages } from "@/app/mesajlar/actions";

interface ChatWindowProps {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
    initialReactions?: Record<number, { reaction: string; count: number; myReaction: boolean }[]>;
    otherUserAvatar?: string | null;
}

export function ChatWindow({
    conversationId,
    initialMessages,
    currentUserId,
    initialReactions = {},
    otherUserAvatar,
}: ChatWindowProps) {
    const {
        messages,
        reactions,
        sending,
        replyTo,
        editingMessage,
        scrollRef,
        setReplyTo,
        setEditingMessage,
        handleSend,
        handleDelete,
        handleEdit,
        handleReact,
        scrollToBottom,
    } = useChat({
        conversationId,
        initialMessages,
        currentUserId,
        initialReactions,
    });

    const [inputText, setInputText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Message[]>([]);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [inputText]);

    // Focus on reply
    useEffect(() => {
        if (replyTo && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [replyTo]);

    // Edit mode
    useEffect(() => {
        if (editingMessage) {
            setInputText(editingMessage.content);
            textareaRef.current?.focus();
        }
    }, [editingMessage]);

    // Scroll detection
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
            setShowScrollDown(distanceFromBottom > 200);
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [scrollRef]);

    // Search handler
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            const results = await searchMessages(conversationId, searchQuery);
            setSearchResults(results);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, conversationId]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (editingMessage) {
            handleEdit(editingMessage.id, inputText);
            setInputText("");
        } else {
            handleSend(inputText);
            setInputText("");
        }
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    for (const msg of messages) {
        const msgDate = new Date(msg.created_at).toDateString();
        if (msgDate !== currentDate) {
            currentDate = msgDate;
            groupedMessages.push({ date: msg.created_at, messages: [msg] });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(msg);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100dvh-56px)] w-full bg-[#050505] font-[family-name:var(--font-outfit)] relative overflow-hidden">
            {/* Ambient gradient */}
            <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#FACC15]/[0.03] to-transparent pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-[5]" />

            {/* Search Bar (toggleable) */}
            <AnimatePresence>
                {isSearching && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-white/[0.06] bg-zinc-900/50 backdrop-blur-xl overflow-hidden z-20"
                    >
                        <div className="flex items-center gap-2 px-4 py-2.5">
                            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                            <input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Mesajlarda ara..."
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-500 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchQuery("");
                                    setSearchResults([]);
                                }}
                                className="text-zinc-400 hover:text-white p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="max-h-40 overflow-y-auto border-t border-white/[0.04] px-4 py-2 space-y-1">
                                {searchResults.map((r) => (
                                    <div
                                        key={r.id}
                                        className="text-[13px] text-zinc-300 bg-zinc-800/40 rounded-lg px-3 py-2 cursor-pointer hover:bg-zinc-800/80 transition-colors"
                                    >
                                        <p className="truncate">{r.content}</p>
                                        <span className="text-[10px] text-zinc-500">
                                            {new Date(r.created_at).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto scroll-smooth z-10 pb-4"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-5 opacity-60 px-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 border border-white/[0.06]">
                                <Sparkles className="w-8 h-8 text-[#FACC15]" />
                            </div>
                            <div className="absolute -inset-2 blur-2xl bg-[#FACC15]/10 -z-10 rounded-full" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-black text-xl text-white tracking-tight mb-1.5">
                                Sohbeti Başlat
                            </h3>
                            <p className="text-zinc-500 font-medium text-sm max-w-[240px]">
                                Bu sohbetteki ilk mesajı sen gönder.
                            </p>
                        </div>
                    </div>
                ) : (
                    groupedMessages.map((group, gi) => (
                        <div key={gi}>
                            <DateSeparator date={group.date} />
                            {group.messages.map((msg, mi) => {
                                const isMe = msg.sender_id === currentUserId;
                                const prevMsg = mi > 0 ? group.messages[mi - 1] : null;
                                const nextMsg = mi < group.messages.length - 1 ? group.messages[mi + 1] : null;
                                const isFirst = !prevMsg || prevMsg.sender_id !== msg.sender_id;
                                const isLast = !nextMsg || nextMsg.sender_id !== msg.sender_id;
                                const msgReactions = reactions[msg.id] || [];

                                return (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isMe={isMe}
                                        isFirstInSequence={isFirst}
                                        isLastInSequence={isLast}
                                        reactions={msgReactions}
                                        currentUserId={currentUserId}
                                        otherUserAvatar={otherUserAvatar}
                                        onReply={(m) => setReplyTo(m)}
                                        onDelete={handleDelete}
                                        onEdit={(m) => setEditingMessage(m)}
                                        onReact={handleReact}
                                    />
                                );
                            })}
                        </div>
                    ))
                )}
            </div>

            {/* Scroll to bottom FAB */}
            <AnimatePresence>
                {showScrollDown && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => scrollToBottom()}
                        className="absolute bottom-24 right-4 z-20 w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all shadow-lg"
                    >
                        <ArrowDown className="w-4 h-4" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Reply Preview */}
            <AnimatePresence>
                {replyTo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-zinc-900/80 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden z-20"
                    >
                        <div className="flex items-center gap-3 px-4 py-2.5">
                            <div className="w-1 h-8 bg-[#FACC15] rounded-full shrink-0" />
                            <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-[#FACC15]">
                                    <Reply className="w-3 h-3 inline mr-1" />
                                    {replyTo.sender_id === currentUserId ? "Kendine yanıt" : "Yanıtla"}
                                </span>
                                <p className="text-[13px] text-zinc-400 truncate">{replyTo.content}</p>
                            </div>
                            <button
                                onClick={() => setReplyTo(null)}
                                className="text-zinc-500 hover:text-white p-1 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Preview */}
            <AnimatePresence>
                {editingMessage && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-zinc-900/80 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden z-20"
                    >
                        <div className="flex items-center gap-3 px-4 py-2.5">
                            <div className="w-1 h-8 bg-blue-500 rounded-full shrink-0" />
                            <div className="flex-1">
                                <span className="text-[11px] font-bold text-blue-400">Mesaj düzenleniyor</span>
                                <p className="text-[13px] text-zinc-400 truncate">{editingMessage.content}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingMessage(null);
                                    setInputText("");
                                }}
                                className="text-zinc-500 hover:text-white p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <form
                onSubmit={onSubmit}
                className="p-3 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06] sticky bottom-0 z-20 safe-area-bottom"
            >
                <div className="max-w-4xl mx-auto flex items-end gap-2.5">
                    {/* Attachment */}
                    <button
                        type="button"
                        className="p-2.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-xl transition-all shrink-0 mb-0.5"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Input */}
                    <div
                        className={cn(
                            "flex-1 bg-zinc-900/80 border border-zinc-800 rounded-[22px] flex items-end transition-all",
                            "hover:border-zinc-700 focus-within:border-[#FACC15]/40 focus-within:shadow-[0_0_0_1px_rgba(250,204,21,0.1)]",
                            editingMessage && "border-blue-500/30 focus-within:border-blue-500/50"
                        )}
                    >
                        <textarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    onSubmit(e);
                                }
                                if (e.key === "Escape") {
                                    setReplyTo(null);
                                    setEditingMessage(null);
                                    setInputText("");
                                }
                            }}
                            placeholder={editingMessage ? "Mesajı düzenle..." : "Mesaj yaz..."}
                            className="w-full bg-transparent text-white placeholder:text-zinc-500 text-[14.5px] font-medium focus:outline-none py-3 px-4 max-h-32 min-h-[44px] resize-none leading-relaxed"
                            rows={1}
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!inputText.trim() || sending}
                        className={cn(
                            "h-11 w-11 shrink-0 rounded-full flex items-center justify-center transition-all mb-0.5",
                            "disabled:opacity-30 disabled:scale-100 disabled:shadow-none",
                            editingMessage
                                ? "bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
                                : "bg-[#FACC15] text-black shadow-[0_4px_12px_rgba(250,204,21,0.25)] hover:scale-105 active:scale-95"
                        )}
                    >
                        <Send
                            className={cn(
                                "w-[18px] h-[18px] ml-0.5 stroke-[2.5px]",
                                sending && "animate-pulse"
                            )}
                        />
                    </button>
                </div>
            </form>
        </div>
    );
}
