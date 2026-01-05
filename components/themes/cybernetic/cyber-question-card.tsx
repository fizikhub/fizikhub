"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, MessageSquare, Clock, Hash, Zap, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useState, useEffect } from "react";

interface CyberQuestionCardProps {
    question: any;
    userVote: number;
    votes: number;
    answerCount: number;
    onVote: (type: 1 | -1) => void;
    onClick: () => void;
    currentUserId?: string;
}

export function CyberQuestionCard({
    question,
    userVote,
    votes,
    answerCount,
    onVote,
    onClick
}: CyberQuestionCardProps) {
    const [pulseState, setPulseState] = useState(false);
    const randomSysId = Math.floor(Math.random() * 999).toString().padStart(3, '0');

    useEffect(() => {
        const interval = setInterval(() => {
            setPulseState(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4, boxShadow: "0 0 20px rgba(0, 240, 255, 0.2)" }}
            className="group relative w-full bg-black/90 border-l-4 border-l-cyan-500/50 border-y border-y-cyan-900/30 border-r border-r-cyan-900/30 mb-2 hover:border-l-cyan-400 hover:bg-gradient-to-r hover:from-cyan-950/20 hover:to-transparent transition-all cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            {/* Animated scanline sweep */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[length:16px_16px] pointer-events-none opacity-30" />

            <div className="flex items-center p-3 gap-3 relative z-10">
                {/* VOTING TERMINAL */}
                <div className="flex flex-col items-center justify-center w-14 border-r border-cyan-900/50 pr-3 gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onVote(1); }}
                        className={cn(
                            "p-1 transition-all hover:bg-cyan-500/20 border border-transparent hover:border-cyan-500/50",
                            userVote === 1 && "bg-cyan-500/30 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                        )}
                    >
                        <ArrowUp className={cn("w-4 h-4", userVote === 1 ? "text-cyan-300" : "text-cyan-700")} />
                    </button>

                    <div className={cn(
                        "font-mono text-xl font-bold leading-none my-1 transition-all",
                        votes > 0 ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "text-cyan-800"
                    )}>
                        {votes}
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onVote(-1); }}
                        className={cn(
                            "p-1 transition-all hover:bg-red-500/20 border border-transparent hover:border-red-500/50",
                            userVote === -1 && "bg-red-500/30 border-red-400 shadow-[0_0_10px_rgba(255,0,100,0.3)]"
                        )}
                    >
                        <ArrowDown className={cn("w-4 h-4", userVote === -1 ? "text-red-400" : "text-cyan-700")} />
                    </button>
                </div>

                {/* MAIN DATA TERMINAL */}
                <div className="flex-1 min-w-0 space-y-2">
                    {/* System Header */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                            <Hash className="w-2.5 h-2.5" />
                            <span>{question.category}</span>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-700/70 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            SYS_{randomSysId}
                        </span>
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            pulseState ? "bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.8)]" : "bg-cyan-600"
                        )} />
                    </div>

                    {/* Question Title */}
                    <h3 className="text-cyan-100 font-mono text-sm md:text-base font-bold group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                        <span className="text-cyan-500/80">&gt;</span> {question.title}
                    </h3>

                    {/* Author Info - Terminal Style */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-600/70">
                        <span className="text-cyan-700/50">usr:</span>
                        <span className="text-cyan-500/80">{question.profiles?.username || 'ghost_user'}</span>
                    </div>
                </div>

                {/* METADATA HUD */}
                <div className="hidden md:flex flex-col items-end gap-2 text-cyan-600/80 font-mono text-[10px] border-l border-cyan-900/50 pl-4 min-w-[100px]">
                    <div className="flex items-center gap-1.5 bg-cyan-950/20 px-2 py-1 border border-cyan-900/50">
                        <MessageSquare className="w-3 h-3" />
                        <span className="text-cyan-400">{answerCount}</span>
                        <span className="text-cyan-700/50">ANS</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-700/70">
                        <Clock className="w-2.5 h-2.5" />
                        <span className="text-[9px]">{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                    </div>
                </div>

                {/* Mobile Metadata */}
                <div className="md:hidden flex flex-col items-center gap-1 text-cyan-600 font-mono text-[10px] pl-2 border-l border-cyan-900/50">
                    <div className="flex items-center gap-1 bg-cyan-950/20 px-1.5 py-0.5 border border-cyan-900/50">
                        <MessageSquare className="w-3 h-3" />
                        <span className="text-cyan-400">{answerCount}</span>
                    </div>
                </div>
            </div>

            {/* Hover Expansion Panel */}
            <motion.div
                initial={{ height: 0 }}
                whileHover={{ height: "auto" }}
                className="overflow-hidden transition-all duration-300 bg-gradient-to-r from-cyan-950/10 to-transparent border-t border-cyan-900/30"
            >
                <div className="p-2 pl-16 text-[9px] font-mono text-cyan-500/70 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-cyan-700/50">meta:</span>
                        <span>tags: [{question.tags?.join(', ') || 'null'}]</span>
                    </div>
                    <span className="text-cyan-500/90 animate-pulse">&gt;&gt; ACCESS</span>
                </div>
            </motion.div>

            {/* Corner indicators */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />
        </motion.div>
    );
}
