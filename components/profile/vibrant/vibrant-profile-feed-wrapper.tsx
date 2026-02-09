"use client";

import { useState } from "react";
import { VibrantHeader } from "./vibrant-header";
import { BentoStatCard } from "./bento-stat-card";
import { ContentTabs } from "./content-tabs";
import { ActionDock } from "./action-dock";
import {
    Zap, Users, BookOpen, MessageCircle, Star, Hash,
    TrendingUp, Award, Bookmark, FileEdit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VibrantProfileFeedWrapperProps {
    profile: any;
    user: any;
    stats: any;
    articles: any[];
    questions: any[];
    answers: any[];
    drafts: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    isOwnProfile: boolean;
}

export function VibrantProfileFeedWrapper({
    profile,
    user,
    stats,
    articles,
    questions,
    answers,
    drafts,
    bookmarkedArticles,
    bookmarkedQuestions,
    isOwnProfile
}: VibrantProfileFeedWrapperProps) {
    const [activeTab, setActiveTab] = useState("articles");

    const tabs = [
        { id: "articles", label: "Makaleler", count: articles?.length || 0 },
        { id: "questions", label: "Sorular", count: questions?.length || 0 },
        { id: "answers", label: "Cevaplar", count: answers?.length || 0 },
        { id: "bookmarks", label: "Kayıtlılar", count: (bookmarkedArticles?.length || 0) + (bookmarkedQuestions?.length || 0) },
    ];

    if (isOwnProfile && drafts?.length > 0) {
        tabs.push({ id: "drafts", label: "Taslaklar", count: drafts.length });
    }

    return (
        <div className="relative pb-24">
            {/* Header */}
            <VibrantHeader profile={profile} user={user} stats={stats} />

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <BentoStatCard
                    title="İtibar"
                    value={stats.reputation}
                    icon={Zap}
                    color="yellow"
                    description="Puan"
                />
                <BentoStatCard
                    title="Takipçi"
                    value={stats.followersCount}
                    icon={Users}
                    color="pink"
                    description="Kişi"
                />
                <BentoStatCard
                    title="Takip"
                    value={stats.followingCount}
                    icon={TrendingUp}
                    color="cyan"
                    description="Kişi"
                />
                <BentoStatCard
                    title="Rozetler"
                    value={0} // Badge count placeholder
                    icon={Award}
                    color="lime"
                    description="Kazanılan"
                />
            </div>

            {/* Tabs */}
            <div className="sticky top-4 z-30 bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-6 border-2 border-black/5">
                <ContentTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Content Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeTab === "articles" && articles?.map((item) => (
                    <ContentCard key={item.id} item={item} type="article" />
                ))}
                {activeTab === "questions" && questions?.map((item) => (
                    <ContentCard key={item.id} item={item} type="question" />
                ))}
                {activeTab === "drafts" && drafts?.map((item) => (
                    <ContentCard key={item.id} item={item} type="draft" />
                ))}
                {/* Empty States */}
                {activeTab === "articles" && articles?.length === 0 && <EmptyState type="Makale" />}
                {activeTab === "questions" && questions?.length === 0 && <EmptyState type="Soru" />}
                {activeTab === "answers" && answers?.length === 0 && <EmptyState type="Cevap" />}
                {activeTab === "drafts" && drafts?.length === 0 && <EmptyState type="Taslak" />}
                {activeTab === "bookmarks" && bookmarkedArticles?.length === 0 && bookmarkedQuestions?.length === 0 && <EmptyState type="Kayıtlı İçerik" />}
            </div>

            {/* Floating Action Dock */}
            <ActionDock isOwnProfile={isOwnProfile} />
        </div>
    );
}

function ContentCard({ item, type }: { item: any, type: "article" | "question" | "draft" }) {
    const typeLabel = {
        article: "Makale",
        question: "Soru",
        draft: "Taslak"
    }[type];

    const typeColor = {
        article: "bg-neo-vibrant-pink",
        question: "bg-neo-vibrant-cyan",
        draft: "bg-gray-300"
    }[type];

    return (
        <div className="group relative bg-white border-3 border-black p-5 rounded-xl shadow-neo hover:shadow-neo-lg transition-all hover:-translate-y-1 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border border-black ${typeColor}`}>
                    {typeLabel}
                </span>
                <span className="text-xs font-bold text-gray-500">
                    {new Date(item.created_at).toLocaleDateString("tr-TR")}
                </span>
            </div>

            <h3 className="text-xl font-black font-heading leading-tight mb-2 line-clamp-2 uppercase">
                {item.title}
            </h3>

            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                {/* Fallback for excerpt or content snippet */}
                {item.excerpt || item.content?.substring(0, 100) + "..."}
            </p>

            <div className="mt-auto flex items-center justify-between border-t-2 border-black/10 pt-3">
                <div className="flex items-center gap-4">
                    {/* Add views or likes here if available */}
                </div>
                <button className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg group-hover:bg-neo-vibrant-yellow group-hover:text-black transition-colors">
                    {type === "draft" ? "DÜZENLE" : "OKU"}
                </button>
            </div>
        </div>
    );
}

function EmptyState({ type }: { type: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-dashed border-4 border-gray-200 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Hash className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">Henüz {type} Yok</h3>
            <p className="text-gray-400">Burada henüz bir içerik bulunmuyor.</p>
        </div>
    );
}
