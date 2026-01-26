"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Zap, FileText } from "lucide-react";

interface MobileProfileContentProps {
    articles: any[];
    questions: any[];
    drafts: any[];
}

export function MobileProfileContent({ articles, questions, drafts }: MobileProfileContentProps) {
    const [activeTab, setActiveTab] = useState<'articles' | 'questions'>('articles');

    const items = activeTab === 'articles' ? articles : questions;
    const emptyMsg = activeTab === 'articles' ? "Henüz bir makale yayınlanmamış." : "Henüz bir soru sorulmamış.";

    return (
        <div className="block sm:hidden mt-8">
            {/* Tab Switcher */}
            <div className="flex w-full border-b-2 border-zinc-800 mb-6">
                <button
                    onClick={() => setActiveTab('articles')}
                    className={cn(
                        "flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-colors relative",
                        activeTab === 'articles' ? "text-white" : "text-zinc-600"
                    )}
                >
                    Makaleler
                    <span className="ml-2 text-[10px] text-zinc-500 font-mono">({articles?.length || 0})</span>
                    {activeTab === 'articles' && (
                        <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#3B82F6] shadow-[0_-2px_10px_rgba(59,130,246,0.5)]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={cn(
                        "flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-colors relative",
                        activeTab === 'questions' ? "text-white" : "text-zinc-600"
                    )}
                >
                    Forum
                    <span className="ml-2 text-[10px] text-zinc-500 font-mono">({questions?.length || 0})</span>
                    {activeTab === 'questions' && (
                        <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-[#FFC800] shadow-[0_-2px_10px_rgba(255,200,0,0.5)]" />
                    )}
                </button>
            </div>

            {/* Content Feed */}
            <div className="flex flex-col gap-3 min-h-[200px]">
                {items?.length === 0 ? (
                    <div className="py-12 text-center">
                        <span className="text-zinc-600 font-mono text-sm">{emptyMsg}</span>
                    </div>
                ) : (
                    items.map((item: any) => (
                        <Link
                            key={item.id}
                            href={item.answers_count !== undefined ? `/forum/${item.id}` : `/makale/${item.slug}`}
                            className="block group"
                        >
                            <div className={cn(
                                "relative bg-[#18181b] border-l-[3px] border-y border-r border-black/50 p-4 transition-all hover:bg-[#202024]",
                                item.answers_count !== undefined ? "border-l-[#FFC800]" : "border-l-[#3B82F6]"
                            )}>
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-bold leading-snug truncate">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            {item.views !== undefined && <span>• {item.views} OKUMA</span>}
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "text-zinc-700 transition-colors",
                                        item.answers_count !== undefined ? "group-hover:text-[#FFC800]" : "group-hover:text-[#3B82F6]"
                                    )}>
                                        {item.answers_count !== undefined ? <Zap className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Drafts Indicator (if any) */}
            {drafts?.length > 0 && activeTab === 'articles' && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3"> TASLAKLAR ({drafts.length})</h2>
                </div>
            )}
        </div>
    );
}
