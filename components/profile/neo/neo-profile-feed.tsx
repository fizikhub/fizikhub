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
    Edit2,
    Grid3X3,
    LayoutList
} from "lucide-react";
import { useRouter } from "next/navigation";

// ============================================
// TYPES
// ============================================

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

// ============================================
// MAIN COMPONENT
// ============================================

export function NeoProfileFeed({
    articles,
    questions,
    answers,
    bookmarkedArticles,
    bookmarkedQuestions,
    drafts = [],
    isOwnProfile = true
}: NeoProfileFeedProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabValue>("articles");

    // Combine bookmarked items
    const savedItems = useMemo(() => [
        ...(bookmarkedArticles || []).map((item: any) => ({
            type: 'article' as const,
            id: item.articles?.id || item.id,
            title: item.articles?.title || "Bilinmeyen Başlık",
            slug: item.articles?.slug,
            date: item.created_at,
            category: item.articles?.category,
            author: item.articles?.author
        })),
        ...(bookmarkedQuestions || []).map((item: any) => ({
            type: 'question' as const,
            id: item.questions?.id || item.id,
            title: item.questions?.title || "Bilinmeyen Soru",
            date: item.created_at,
            category: item.questions?.category,
        }))
    ].filter(item => item.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [bookmarkedArticles, bookmarkedQuestions]);

    // Tab configuration
    const tabs = [
        { value: "articles" as const, label: "MAKALELER", icon: FileText, count: articles?.length || 0 },
        { value: "questions" as const, label: "SORULAR", icon: MessageSquare, count: questions?.length || 0 },
        { value: "answers" as const, label: "CEVAPLAR", icon: MessageCircle, count: answers?.length || 0 },
        ...(isOwnProfile && drafts?.length > 0 ? [{ value: "drafts" as const, label: "TASLAKLAR", icon: PenTool, count: drafts.length }] : []),
        ...(isOwnProfile && savedItems.length > 0 ? [{ value: "saved" as const, label: "KAYDEDİLENLER", icon: Bookmark, count: savedItems.length }] : []),
    ];

    return (
        <div className="w-full mt-6">
            {/* === NAV TABS === */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="inline-flex items-center gap-1 p-1 bg-muted/30 border-3 border-black dark:border-white rounded-xl min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap",
                                    isActive
                                        ? "bg-primary text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                {tab.count > 0 && (
                                    <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded-md font-bold",
                                        isActive
                                            ? "bg-black/20 text-black"
                                            : "bg-muted-foreground/20"
                                    )}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* === CONTENT === */}
            <div className="mt-4">
                {/* Articles */}
                {activeTab === "articles" && (
                    articles?.length > 0 ? (
                        <div className="space-y-3">
                            {articles.map((article) => (
                                <NeoFeedCard
                                    key={article.id}
                                    type="article"
                                    title={article.title}
                                    description={article.excerpt}
                                    href={`/blog/${article.slug}`}
                                    date={article.created_at}
                                    category={article.category}
                                    stats={{
                                        likes: article.likes_count,
                                        views: article.views
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <NeoEmptyState
                            icon={FileText}
                            title={isOwnProfile ? "HENÜZ MAKALE YOK" : "MAKALE BULUNAMADI"}
                            description={isOwnProfile ? "Bilimsel yazılarını burada paylaş." : "Bu kullanıcı henüz makale yayınlamamış."}
                        />
                    )
                )}

                {/* Questions */}
                {activeTab === "questions" && (
                    questions?.length > 0 ? (
                        <div className="space-y-3">
                            {questions.map((question) => (
                                <NeoFeedCard
                                    key={question.id}
                                    type="question"
                                    title={question.title}
                                    href={`/forum/${question.id}`}
                                    date={question.created_at}
                                    category={question.category}
                                    stats={{
                                        comments: question.answers_count,
                                        views: question.views
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <NeoEmptyState
                            icon={MessageSquare}
                            title={isOwnProfile ? "HENÜZ SORU YOK" : "SORU BULUNAMADI"}
                            description={isOwnProfile ? "Takıldığın yerlerde topluluğa sor." : "Bu kullanıcı henüz soru sormamış."}
                        />
                    )
                )}

                {/* Answers */}
                {activeTab === "answers" && (
                    answers?.length > 0 ? (
                        <div className="space-y-3">
                            {answers.map((answer) => (
                                <NeoFeedCard
                                    key={answer.id}
                                    type="answer"
                                    title={answer.questions?.title || "Silinmiş Soru"}
                                    description={answer.content}
                                    href={`/forum/${answer.questions?.id || '#'}`}
                                    date={answer.created_at}
                                />
                            ))}
                        </div>
                    ) : (
                        <NeoEmptyState
                            icon={MessageCircle}
                            title={isOwnProfile ? "HENÜZ CEVAP YOK" : "CEVAP BULUNAMADI"}
                            description={isOwnProfile ? "Başkalarının sorularına yardım et." : "Bu kullanıcı henüz cevap vermemiş."}
                        />
                    )
                )}

                {/* Drafts */}
                {activeTab === "drafts" && (
                    drafts?.length > 0 ? (
                        <div className="space-y-3">
                            {drafts.map((draft: any) => (
                                <NeoFeedCard
                                    key={draft.id}
                                    type="draft"
                                    title={draft.title || "(Başlıksız Taslak)"}
                                    href={`/makale/duzenle/${draft.id}`}
                                    date={draft.created_at}
                                    category={draft.category}
                                    status="draft"
                                    onEdit={() => router.push(`/makale/duzenle/${draft.id}`)}
                                />
                            ))}
                        </div>
                    ) : null
                )}

                {/* Saved */}
                {activeTab === "saved" && (
                    savedItems?.length > 0 ? (
                        <div className="space-y-3">
                            {savedItems.map((item) => (
                                <NeoFeedCard
                                    key={`${item.type}-${item.id}`}
                                    type={item.type}
                                    title={item.title}
                                    href={item.type === 'article' ? `/blog/${item.slug}` : `/forum/${item.id}`}
                                    date={item.date}
                                    category={item.category}
                                />
                            ))}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}

// ============================================
// FEED CARD COMPONENT
// ============================================

interface NeoFeedCardProps {
    type: "article" | "question" | "answer" | "draft";
    title: string;
    description?: string;
    href: string;
    date: string | Date;
    stats?: {
        views?: number;
        likes?: number;
        comments?: number;
    };
    category?: string;
    status?: string;
    onEdit?: () => void;
}

function NeoFeedCard({
    type,
    title,
    description,
    href,
    date,
    stats,
    category,
    status,
    onEdit
}: NeoFeedCardProps) {
    const formattedDate = format(new Date(date), 'dd MMM yyyy', { locale: tr });

    const typeLabels = {
        article: "Makale",
        question: "Soru",
        answer: "Cevap",
        draft: "Taslak"
    };

    const typeColors = {
        article: "bg-sky-400",
        question: "bg-amber-400",
        answer: "bg-emerald-400",
        draft: "bg-zinc-400"
    };

    return (
        <Link
            href={href}
            className="group block"
        >
            <div className={cn(
                "relative p-4 bg-card border-3 border-black dark:border-white rounded-xl",
                "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]",
                "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
                "transition-all duration-200"
            )}>
                {/* Type Badge */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black border-2 border-black rounded-md",
                            typeColors[type]
                        )}>
                            {typeLabels[type]}
                        </span>

                        {category && (
                            <span className="text-xs text-primary font-semibold">
                                {category}
                            </span>
                        )}

                        {status === "draft" && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-yellow-400/20 text-yellow-600 border border-yellow-500 rounded">
                                Taslak
                            </span>
                        )}
                    </div>

                    <span className="text-xs text-muted-foreground font-medium">
                        {formattedDate}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {title}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                        {description}
                    </p>
                )}

                {/* Stats Footer */}
                {stats && (
                    <div className="flex items-center gap-4 pt-2 border-t border-border/40">
                        {stats.likes !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span className="font-medium">{stats.likes}</span>
                            </div>
                        )}
                        {stats.comments !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="font-medium">{stats.comments}</span>
                            </div>
                        )}
                        {stats.views !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="font-medium">{stats.views}</span>
                            </div>
                        )}

                        {/* Arrow */}
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Edit button for drafts */}
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onEdit();
                        }}
                        className="absolute top-4 right-4 p-2 bg-muted hover:bg-primary hover:text-black rounded-lg opacity-0 group-hover:opacity-100 transition-all border-2 border-transparent hover:border-black"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </Link>
    );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

interface NeoEmptyStateProps {
    icon: any;
    title: string;
    description: string;
}

function NeoEmptyState({ icon: Icon, title, description }: NeoEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-muted border-3 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] mb-4">
                <Icon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-1">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
                {description}
            </p>
        </div>
    );
}
