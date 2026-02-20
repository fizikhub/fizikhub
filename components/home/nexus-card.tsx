"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, Play, BookOpen, BrainCircuit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- Types ---

export type NexusCardType =
    | "article"
    | "blog"
    | "question"
    | "simulation"
    | "book-review"
    | "term"
    | "experiment"
    | "fact"
    | "meme"
    | "answer";

export interface NexusCardDeviceProps {
    type: NexusCardType;
    data: any; // We'll type this more strictly if needed, but for now flexibility helps
    className?: string;
    featured?: boolean; // If true, might utilize more space or distinct styling
    index?: number; // For staggered animation
}

// --- Component ---

export function NexusCard({ type, data, className, featured, index = 0 }: NexusCardDeviceProps) {

    // Base Neo-Brutalist Card Style
    const baseCardStyle = "relative overflow-hidden border-3 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 dark:bg-zinc-900 dark:border-white dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-xl h-full flex flex-col";

    // Staggered Animation Variant
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } }
    };

    // --- Content Renderers ---

    const renderArticleContent = () => (
        <>
            <div className="relative aspect-video w-full overflow-hidden border-b-3 border-black dark:border-white">
                {data.image_url ? (
                    <Image
                        src={data.image_url}
                        alt={data.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-emerald-400 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-black" />
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <span className="neo-badge bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {type === 'blog' ? 'BLOG' : 'MAKALE'}
                    </span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-heading font-black text-lg leading-tight mb-2 line-clamp-3">
                    {data.title}
                </h3>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-grow">
                    {data.summary || data.content?.substring(0, 100) + "..."}
                </p>

                <div className="flex items-center justify-between text-xs font-bold border-t-2 border-dashed border-black/20 dark:border-white/20 pt-3">
                    <div className="flex items-center gap-2">
                        {data.author?.avatar_url && (
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-black dark:border-white relative">
                                <Image src={data.author.avatar_url} alt={data.author.username} fill />
                            </div>
                        )}
                        <span>{data.author?.username || "Anonim"}</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {data.likes_count || 0}</span>
                    </div>
                </div>
            </div>
        </>
    );

    const renderQuestionContent = () => (
        <div className="p-5 h-full flex flex-col bg-yellow-400 dark:bg-yellow-600 dark:text-black">
            <div className="flex items-center justify-between mb-3">
                <span className="neo-badge bg-black text-white border-none shadow-none">SORU</span>
                <BrainCircuit className="w-5 h-5" />
            </div>

            <h3 className="font-heading font-black text-xl leading-tight mb-auto">
                {data.title}
            </h3>

            <div className="mt-4 flex items-center justify-between font-bold">
                <div className="flex -space-x-2">
                    {/* Mock avatars for "people answering" feeling */}
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center text-[10px]">?</div>
                </div>
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border-2 border-black text-xs">
                    <MessageCircle className="w-3 h-3" /> {data.answer_count || 0} Cevap
                </span>
            </div>
        </div>
    );

    const renderAnswerContent = () => (
        <div className="p-5 h-full flex flex-col bg-zinc-800 text-white">
            <div className="flex items-center justify-between mb-3 text-emerald-400">
                <span className="neo-badge bg-[#FFC800] text-black border-none shadow-none text-[10px]">YANIT</span>
                <MessageCircle className="w-5 h-5 text-[#FFC800]" />
            </div>

            <h3 className="font-heading font-black text-lg leading-tight mb-2 line-clamp-2">
                {Array.isArray(data.questions) ? data.questions[0]?.title : data.questions?.title || "Soru Başlığı"}
            </h3>

            <div className="text-zinc-400 text-sm leading-relaxed pl-3 border-l-2 border-[#FFC800] line-clamp-3 mb-auto">
                {data.content?.replace(/<[^>]*>?/gm, "").slice(0, 100)}...
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-bold pt-3 border-t border-white/10">
                <span>{data.profiles?.username || "Anonim"}</span>
                <span>{new Date(data.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
        </div>
    );

    const renderSimulationContent = () => (
        <div className="relative h-full flex flex-col group">
            <div className="absolute inset-0 bg-blue-500 z-0">
                {/* Abstract grid pattern or simple visual */}
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            </div>

            <div className="relative z-10 p-5 flex flex-col h-full items-center justify-center text-center text-white">
                <div className="w-16 h-16 bg-white border-3 border-black text-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 ml-1" />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {data.title}
                </h3>
                <span className="mt-2 text-sm font-bold bg-black px-2 py-0.5 text-white">İNTERAKTİF DENEY</span>
            </div>
        </div>
    );

    // --- Main Render ---

    // Determine Link href based on type
    let href = "/";
    if (type === 'article' || type === 'blog') href = `/makale/${data.slug}`;
    if (type === 'question') href = `/forum/${data.slug}`;
    if (type === 'answer') {
        const qSlug = Array.isArray(data.questions) ? data.questions[0]?.slug : data.questions?.slug;
        href = qSlug ? `/forum/${qSlug}` : `/profil`;
    }
    if (type === 'simulation') href = `/simulasyonlar/${data.slug}`;
    if (type === 'book-review') href = `/kitap-inceleme/${data.slug}`;


    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            className={cn("h-full", className)}
        >
            <Link href={href} className="block h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-xl">
                <article className={baseCardStyle}>
                    {type === 'question' ? renderQuestionContent() :
                        type === 'answer' ? renderAnswerContent() :
                            type === 'simulation' ? renderSimulationContent() :
                                renderArticleContent()}
                </article>
            </Link>
        </motion.div>
    );
}
