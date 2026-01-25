"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    FileText,
    MessageSquare,
    MessageCircle,
    Bookmark,
    PenTool,
    ThumbsUp,
    Eye,
    ArrowUpRight,
    Edit2
} from "lucide-react";

interface NeoProfileFeedProps {
    articles: any[];
    questions: any[];
    answers: any[];
    bookmarkedArticles: any[];
    bookmarkedQuestions: any[];
    drafts?: any[];
    isOwnProfile?: boolean;
}

type TabValue = "articles" | "questions" | "answers" | "drafts" | "saved";

export function NeoProfileFeed({
    articles,
    questions,
    answers,
    bookmarkedArticles,
    bookmarkedQuestions,
    drafts = [],
    isOwnProfile = true
}: NeoProfileFeedProps) {
    const [activeTab, setActiveTab] = useState<TabValue>("articles");

    const savedItems = useMemo(() => [
        ...(bookmarkedArticles || []).map((item: any) => ({
            type: 'article' as const,
            id: item.articles?.id || item.id,
            title: item.articles?.title || "Bilinmeyen Başlık",
            slug: item.articles?.slug,
            date: item.created_at,
            category: item.articles?.category,
        })),
        ...(bookmarkedQuestions || []).map((item: any) => ({
            type: 'question' as const,
            id: item.questions?.id || item.id,
            title: item.questions?.title || "Bilinmeyen Soru",
            date: item.created_at,
            category: item.questions?.category,
        }))
    ].filter(item => item.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [bookmarkedArticles, bookmarkedQuestions]);

    const tabs = [
        { value: "articles" as const, label: "MAKALE", icon: FileText, count: articles?.length || 0 },
        { value: "questions" as const, label: "SORU", icon: MessageSquare, count: questions?.length || 0 },
        { value: "answers" as const, label: "CEVAP", icon: MessageCircle, count: answers?.length || 0 },
        ...(isOwnProfile && drafts?.length > 0 ? [{ value: "drafts" as const, label: "TASLAK", icon: PenTool, count: drafts.length }] : []),
        ...(isOwnProfile && savedItems.length > 0 ? [{ value: "saved" as const, label: "KAYDI", icon: Bookmark, count: savedItems.length }] : []),
    ];

    return (
        <div className="w-full flex flex-col gap-6 mt-6 pb-20">
            {/* === NAVIGATION TABS === */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-card border-[3px] border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={cn(
                                "flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-tighter transition-all",
                                isActive
                                    ? "bg-primary text-black border-2 border-black"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[10px] bg-black/10 text-black font-bold",
                                    isActive ? "bg-black/20" : "bg-muted text-muted-foreground"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* === CONTENT FEED AREA === */}
            <div className="flex flex-col gap-4">
                {activeTab === "articles" && (
                    articles?.length > 0 ? articles.map(a => (
                        <FeedItem key={a.id} type="article" title={a.title} desc={a.excerpt} href={`/blog/${a.slug}`} date={a.created_at} stats={{ views: a.views, likes: a.likes_count }} cat={a.category} />
                    )) : <EmptyState icon={FileText} title="Makale Bulunmuyor" desc="Henüz bir bilimsel makale yayınlanmamış." />
                )}

                {activeTab === "questions" && (
                    questions?.length > 0 ? questions.map(q => (
                        <FeedItem key={q.id} type="question" title={q.title} href={`/forum/${q.id}`} date={q.created_at} stats={{ views: q.views, comments: q.answers_count }} cat={q.category} />
                    )) : <EmptyState icon={MessageSquare} title="Soru Bulunmuyor" desc="Ufukta henüz bir soru görünmüyor." />
                )}

                {activeTab === "answers" && (
                    answers?.length > 0 ? answers.map(ans => (
                        <FeedItem key={ans.id} type="answer" title={ans.questions?.title || "Bilinmeyen Soru"} desc={ans.content} href={`/forum/${ans.questions?.id || '#'}`} date={ans.created_at} />
                    )) : <EmptyState icon={MessageCircle} title="Cevap Bulunmuyor" desc="Henüz bir bilimsel tartışmaya katılınmamış." />
                )}

                {activeTab === "drafts" && (
                    drafts?.map(d => (
                        <FeedItem key={d.id} type="draft" title={d.title || "İsimsiz Taslak"} href={`/makale/duzenle/${d.id}`} date={d.created_at} cat={d.category} isDraft />
                    ))
                )}

                {activeTab === "saved" && (
                    savedItems?.map(s => (
                        <FeedItem key={`${s.type}-${s.id}`} type={s.type} title={s.title} href={s.type === 'article' ? `/blog/${s.slug}` : `/forum/${s.id}`} date={s.date} cat={s.category} />
                    ))
                )}
            </div>
        </div>
    );
}

function FeedItem({ type, title, desc, href, date, stats, cat, isDraft = false }: any) {
    const formattedDate = format(new Date(date), 'dd.MM.yyyy', { locale: tr });

    return (
        <Link href={href} className="group block">
            <div className="relative p-5 bg-card border-[3px] border-black dark:border-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={cn(
                        "px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-md",
                        type === 'article' ? "bg-sky-400" : type === 'question' ? "bg-amber-400" : "bg-emerald-400 text-black"
                    )}>
                        {type === 'article' ? "MAKALE" : type === 'question' ? "SORU" : "CEVAP"}
                    </span>
                    <span className="text-[10px] font-black tracking-widest text-muted-foreground opacity-60">
                        {formattedDate}
                    </span>
                </div>

                <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors mb-2 uppercase italic">
                    {title}
                </h3>

                {desc && (
                    <p className="text-sm font-semibold text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                        {desc}
                    </p>
                )}

                <div className="flex items-center justify-between border-t-2 border-dashed border-black/10 dark:border-white/10 pt-4 mt-2">
                    <div className="flex items-center gap-4">
                        {stats?.likes !== undefined && <Stat value={stats.likes} icon={ThumbsUp} />}
                        {stats?.comments !== undefined && <Stat value={stats.comments} icon={MessageCircle} />}
                        {stats?.views !== undefined && <Stat value={stats.views} icon={Eye} />}
                        {cat && <span className="text-[10px] font-black text-primary uppercase">{cat}</span>}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {isDraft && (
                    <div className="absolute top-4 right-4 bg-yellow-400 border-2 border-black p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Edit2 className="w-4 h-4 text-black" />
                    </div>
                )}
            </div>
        </Link>
    );
}

function Stat({ value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-1.5 text-xs font-black text-muted-foreground">
            <Icon className="w-3.5 h-3.5" />
            <span>{value}</span>
        </div>
    );
}

function EmptyState({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-card border-[3px] border-dashed border-black/10 dark:border-white/10 rounded-3xl">
            <div className="w-16 h-16 flex items-center justify-center bg-muted border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 -rotate-3">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tighter mb-1">{title}</h4>
            <p className="text-sm font-semibold text-muted-foreground max-w-[250px]">{desc}</p>
        </div>
    );
}
