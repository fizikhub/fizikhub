"use client";

import { Message } from "@/app/mesajlar/actions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Trash2,
    Pencil,
    Reply,
    CheckCheck,
    Check,
    CornerDownRight,
} from "lucide-react";
import { useState, useRef } from "react";

const REACTIONS = ["❤️", "😂", "😮", "👍", "🔥", "👏"];

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    isFirstInSequence: boolean;
    isLastInSequence: boolean;
    reactions: { reaction: string; count: number; myReaction: boolean }[];
    currentUserId: string;
    otherUserAvatar?: string | null;
    onReply: (message: Message) => void;
    onDelete: (messageId: number) => void;
    onEdit: (message: Message) => void;
    onReact: (messageId: number, reaction: string) => void;
}

export function MessageBubble({
    message,
    isMe,
    isFirstInSequence,
    isLastInSequence,
    reactions,
    currentUserId,
    otherUserAvatar,
    onReply,
    onDelete,
    onEdit,
    onReact,
}: MessageBubbleProps) {
    const [showActions, setShowActions] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const showAvatar = !isMe && isLastInSequence;
    const time = new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Long press for mobile
    const handleTouchStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowReactions(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    // Double click for reactions
    const handleDoubleClick = () => {
        onReact(message.id, "❤️");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
                "flex w-full group relative px-4",
                isMe ? "justify-end" : "justify-start",
                isFirstInSequence ? "mt-3" : "mt-0.5"
            )}
        >
            <div
                className={cn(
                    "flex max-w-[82%] sm:max-w-[65%] items-end gap-2",
                    isMe ? "flex-row-reverse" : "flex-row"
                )}
            >
                {/* Avatar Slot */}
                {!isMe && (
                    <div className="w-7 flex-shrink-0">
                        {showAvatar && (
                            <Avatar className="w-7 h-7 rounded-full ring-2 ring-[#050505]">
                                <AvatarImage src={otherUserAvatar || ""} />
                                <AvatarFallback className="bg-zinc-800 text-[9px] font-bold text-zinc-400">
                                    ?
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                )}

                {/* Bubble Container */}
                <div className="relative">
                    {/* Reply Preview */}
                    {message.reply_to && (
                        <div
                            className={cn(
                                "mb-1 px-3 py-1.5 rounded-xl text-[12px] leading-tight border-l-2 max-w-[220px]",
                                isMe
                                    ? "bg-[#FACC15]/10 border-[#FACC15]/40 text-[#FACC15]/80 ml-auto"
                                    : "bg-zinc-800/40 border-zinc-600 text-zinc-400"
                            )}
                        >
                            <div className="flex items-center gap-1 mb-0.5">
                                <CornerDownRight className="w-2.5 h-2.5 opacity-60" />
                                <span className="font-semibold text-[10px] opacity-70">
                                    {message.reply_to.sender_id === currentUserId ? "Sen" : ""}
                                </span>
                            </div>
                            <p className="truncate opacity-80">{message.reply_to.content}</p>
                        </div>
                    )}

                    {/* Main Bubble */}
                    <div
                        onDoubleClick={handleDoubleClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseEnter={() => setShowActions(true)}
                        onMouseLeave={() => {
                            setShowActions(false);
                            setShowReactions(false);
                        }}
                        className={cn(
                            "px-4 py-2.5 text-[14.5px] leading-relaxed transition-all select-none relative",
                            // Color
                            isMe
                                ? "bg-[#FACC15] text-black font-medium"
                                : "bg-zinc-800/90 text-white border border-white/[0.06]",
                            // Shape - first/last logic
                            isMe
                                ? cn(
                                    "rounded-2xl",
                                    isFirstInSequence && isLastInSequence && "rounded-2xl",
                                    isFirstInSequence && !isLastInSequence && "rounded-2xl rounded-br-md",
                                    !isFirstInSequence && isLastInSequence && "rounded-2xl rounded-tr-md",
                                    !isFirstInSequence && !isLastInSequence && "rounded-2xl rounded-r-md"
                                )
                                : cn(
                                    "rounded-2xl",
                                    isFirstInSequence && isLastInSequence && "rounded-2xl",
                                    isFirstInSequence && !isLastInSequence && "rounded-2xl rounded-bl-md",
                                    !isFirstInSequence && isLastInSequence && "rounded-2xl rounded-tl-md",
                                    !isFirstInSequence && !isLastInSequence && "rounded-2xl rounded-l-md"
                                )
                        )}
                    >
                        {message.content}

                        {/* Inline meta */}
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 ml-2 align-bottom",
                                isMe ? "text-black/40" : "text-zinc-500"
                            )}
                        >
                            <span className="text-[10px] font-medium tabular-nums">{time}</span>
                            {message.edited_at && (
                                <span className="text-[9px] italic">düzenlendi</span>
                            )}
                            {isMe && (
                                message.is_read
                                    ? <CheckCheck className="w-3 h-3 text-black/50" />
                                    : <Check className="w-3 h-3 text-black/30" />
                            )}
                        </span>
                    </div>

                    {/* Reactions Display */}
                    <AnimatePresence>
                        {reactions.length > 0 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={cn(
                                    "absolute -bottom-3 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 shadow-lg",
                                    isMe ? "right-2" : "left-2"
                                )}
                            >
                                {reactions.map((r) => (
                                    <button
                                        key={r.reaction}
                                        onClick={() => onReact(message.id, r.reaction)}
                                        className={cn(
                                            "text-[12px] hover:scale-125 transition-transform",
                                            r.myReaction && "drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]"
                                        )}
                                    >
                                        {r.reaction}
                                        {r.count > 1 && (
                                            <span className="text-[9px] text-zinc-400 font-bold ml-0.5">
                                                {r.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Hover Actions */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                className={cn(
                                    "absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20",
                                    isMe ? "-left-[120px]" : "-right-[120px]"
                                )}
                            >
                                <div className="flex items-center gap-0.5 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl px-1.5 py-1 shadow-xl">
                                    {/* React */}
                                    <button
                                        onClick={() => setShowReactions(!showReactions)}
                                        className="p-1.5 text-zinc-400 hover:text-[#FACC15] rounded-lg hover:bg-zinc-800 transition-all text-[13px]"
                                    >
                                        😊
                                    </button>
                                    {/* Reply */}
                                    <button
                                        onClick={() => onReply(message)}
                                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
                                    >
                                        <Reply className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Edit (only own messages) */}
                                    {isMe && (
                                        <button
                                            onClick={() => onEdit(message)}
                                            className="p-1.5 text-zinc-400 hover:text-blue-400 rounded-lg hover:bg-zinc-800 transition-all"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {/* Delete (only own messages) */}
                                    {isMe && (
                                        <button
                                            onClick={() => onDelete(message.id)}
                                            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reaction Picker */}
                    <AnimatePresence>
                        {showReactions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.7, y: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className={cn(
                                    "absolute z-30 flex items-center gap-1 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-2 py-1.5 shadow-2xl",
                                    isMe ? "bottom-full mb-2 right-0" : "bottom-full mb-2 left-0"
                                )}
                            >
                                {REACTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            onReact(message.id, emoji);
                                            setShowReactions(false);
                                        }}
                                        className="text-[18px] hover:scale-150 active:scale-90 transition-transform p-1"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
