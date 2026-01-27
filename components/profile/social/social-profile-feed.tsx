"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    MessageCircle,
    ArrowRight,
    MessageSquare,
    ThumbsUp,
    Eye,
    BarChart2,
    Share2
} from "lucide-react";

interface SocialProfileFeedProps {
    items: any[];
    type: "article" | "question" | "answer" | "draft" | "bookmark";
}

export function SocialProfileFeed({ items, type }: SocialProfileFeedProps) {
    if (!items || items.length === 0) {
        return (
            <div className="py-12 px-4 text-center">
                <p className="text-muted-foreground font-medium">Buralar henüz çok sessiz...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {items.map((item) => (
                <FeedItem key={item.id} item={item} type={type} />
            ))}
        </div>
    );
}

function FeedItem({ item, type }: { item: any; type: string }) {
    // Adapter logic to normalize data shape depending on type
    const title = type === 'answer' ? item.questions?.title : (item.title || item.articles?.title || item.questions?.title);
    const content = type === 'answer' ? item.content : (item.excerpt || item.content);
    const slug = type === 'article' ? (item.slug || item.articles?.slug) : (item.slug || item.questions?.slug);
    const id = type === 'bookmark' ? (item.articles?.id || item.questions?.id || item.id) : item.id;
    const cat = item.category || item.articles?.category || item.questions?.category;

    // Determine Href
    let href = "#";
    if (type === 'article' || (type === 'bookmark' && item.articles)) href = `/blog/${slug}`;
    else if (type === 'question' || type === 'answer' || (type === 'bookmark' && item.questions)) href = `/forum/${type === 'answer' ? item.questions?.id : id}`;
    else if (type === 'draft') href = `/makale/duzenle/${id}`;

    // Stats
    const views = item.views || item.articles?.views || item.questions?.views;
    const likes = item.likes_count;
    const comments = item.answers_count;

    return (
        <Link
            href={href}
            className="block p-4 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
        >
            {/* Meta Header */}
            <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                {type === 'answer' && <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Yanıtladı</span>}
                {type === 'question' && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Sordu</span>}
                {type === 'bookmark' && <span className="flex items-center gap-1 text-[#facc15]">Kaydedildi</span>}
                <span>·</span>
                <span>{format(new Date(item.created_at), 'd MMM', { locale: tr })}</span>
                {cat && (
                    <>
                        <span>·</span>
                        <span className="font-medium text-foreground">{cat}</span>
                    </>
                )}
            </div>

            {/* Content Body */}
            <div className="space-y-1">
                <h3 className="text-base font-bold leading-snug text-foreground">
                    {title}
                </h3>
                {content && (
                    <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {content}
                    </p>
                )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mt-3 text-muted-foreground max-w-sm">
                <div className="flex items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    {comments && <span className="text-xs group-hover:text-blue-500 transition-colors">{comments}</span>}
                </div>

                <div className="flex items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                    </div>
                    {likes && <span className="text-xs group-hover:text-green-500 transition-colors">{likes}</span>}
                </div>

                <div className="flex items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-[#facc15]/10 group-hover:text-[#facc15] transition-colors">
                        <BarChart2 className="w-4 h-4" />
                    </div>
                    {views && <span className="text-xs group-hover:text-[#facc15] transition-colors">{views}</span>}
                </div>

                <div className="group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
