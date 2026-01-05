"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUp, MessageSquare, Clock, Hash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface CyberQuestionCardProps {
    question: any;
    userVote: number;
    votes: number;
    answerCount: number;
    onVote: (type: 1 | 0 | -1) => void;
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
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative w-full bg-black/90 border-l-2 border-l-cyan-500/50 border-y border-y-cyan-900/30 border-r border-r-cyan-900/30 mb-2 hover:border-l-cyan-400 hover:bg-cyan-950/10 transition-all cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,240,255,0.05)_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none z-0" />

            <div className="flex items-center p-3 gap-4 relative z-10">
                {/* 1. STATUS INDICATOR */}
                <div className="flex flex-col items-center justify-center w-12 border-r border-cyan-900/50 pr-4">
                    <div className={cn(
                        "font-mono text-lg font-bold",
                        votes > 0 ? "text-cyan-400" : "text-cyan-800"
                    )}>
                        {votes}
                    </div>
                    <div className="text-[8px] font-mono text-cyan-600 uppercase">RATING</div>
                </div>

                {/* 2. MAIN DATA */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono bg-cyan-900/30 text-cyan-300 px-1.5 py-0.5 border border-cyan-500/20">
                            {question.category}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-700">
                            ID_{question.id.slice(0, 6)}
                        </span>
                    </div>

                    <h3 className="text-cyan-100 font-mono text-sm md:text-base truncate group-hover:text-cyan-400 transition-colors">
                        {question.title}
                    </h3>
                </div>

                {/* 3. METADATA (Right aligned) */}
                <div className="hidden md:flex items-center gap-6 text-cyan-600/80 font-mono text-xs border-l border-cyan-900/50 pl-4">
                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3 h-3" />
                        <span>{answerCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-24 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true, locale: tr })}</span>
                    </div>
                </div>

                {/* Mobile Metadata */}
                <div className="md:hidden flex flex-col items-end gap-1 text-cyan-600 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {answerCount}
                    </div>
                </div>
            </div>

            {/* Hover Expansion Details (Optional/Advanced) */}
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 bg-cyan-950/20">
                <div className="p-2 pl-16 text-[10px] font-mono text-cyan-500/70 border-t border-cyan-900/30 flex justify-between">
                    <span>USER: {question.profiles?.username || 'GHOST_USER'}</span>
                    <span>TAGS: [{question.tags?.join(', ') || 'NULL'}]</span>
                </div>
            </div>
        </motion.div>
    );
}
