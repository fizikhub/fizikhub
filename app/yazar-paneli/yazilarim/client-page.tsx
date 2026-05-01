"use client";

import { useState, useMemo, memo } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, UserIcon, Bot, Search, Filter, Edit3 } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const REQUIRED_APPROVALS = 4;

// Memoized Article Card for performance
const ArticleCard = memo(({ article }: { article: any }) => {
    const author = article.author;
    const count = article.approvalCount || 0;
    const approvers = article.approvers || [];
    
    // Memoize date formatting
    const formattedDate = useMemo(() => {
        try {
            return format(new Date(article.created_at), "d MMM", { locale: tr });
        } catch (e) {
            return "---";
        }
    }, [article.created_at]);

    return (
        <div className="group relative bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] flex flex-col transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] will-change-transform">
            
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-dashed border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {author?.avatar_url ? (
                            <img src={author.avatar_url} alt={author.full_name || "Yazar"} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <UserIcon className="w-4 h-4 text-zinc-500" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold leading-tight truncate max-w-[120px]">{author?.full_name || "Bilinmeyen Yazar"}</span>
                        <span className="text-[10px] text-zinc-500">@{author?.username || "kullanici"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {article.aiScore != null && (
                        <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-md border ${
                            article.aiScore >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                            article.aiScore >= 60 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                            'bg-red-500/10 border-red-500/30 text-red-500'
                        }`}>
                            <Bot className="w-3 h-3" />
                            {article.aiScore}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 mb-6">
                <h3 className="text-xl font-black mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    <Link target="_blank" rel="noopener noreferrer" href={`/makale/${article.slug}`} className="hover:underline underline-offset-4 decoration-2">
                        {article.title}
                    </Link>
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {article.excerpt || "İçerik özeti bulunamadı..."}
                </p>
                {article.category && (
                    <Badge variant="outline" className="mt-2 text-[10px] font-bold">{article.category}</Badge>
                )}
            </div>

            <div className="mt-auto">
                {/* Approvers Display */}
                {approvers.length > 0 && (
                    <div className="flex -space-x-2 overflow-hidden mb-3">
                        {approvers.map((approverUser: any, idx: number) => (
                            <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                    <Avatar className="inline-block border-2 border-background w-8 h-8">
                                        <AvatarImage src={approverUser?.avatar_url} alt={approverUser?.full_name} />
                                        <AvatarFallback className="text-[10px] bg-zinc-800">
                                            {approverUser?.full_name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{approverUser?.full_name} (@{approverUser?.username}) onayladı</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}

                <div className="mb-4">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Onay Durumu</span>
                        <div className="flex items-center gap-2">
                            {article.published && <span className="text-xs font-bold text-emerald-500">YAYINLANDI</span>}
                            <span className="text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                {count} / {REQUIRED_APPROVALS}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-primary transition-all duration-500 ease-out will-change-[width]" style={{ width: `${Math.min(100, (count / REQUIRED_APPROVALS) * 100)}%` }} />
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Link href={`/yazar/${article.id}`} className="w-full">
                        <Button className="w-full font-black h-11 border-2 border-transparent bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Makaleyi Düzenle
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
});

ArticleCard.displayName = "ArticleCard";

export function MyArticlesClient({ initialArticles }: { initialArticles: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    if (initialArticles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 lg:p-24 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
                <Edit3 className="w-16 h-16 text-zinc-500 mb-6" />
                <h3 className="text-xl font-bold mb-2">Henüz bir yazınız yok</h3>
                <p className="text-zinc-500 text-center mb-6">İlk yazınızı oluşturmak için Yazı Yaz butonunu kullanabilirsiniz.</p>
                <Link href="/yazar-paneli/manifesto">
                    <Button variant="outline" className="font-bold border-2 border-black dark:border-zinc-800">Yazar Rehberi'ni Oku</Button>
                </Link>
            </div>
        );
    }

    const filteredArticles = initialArticles.filter(article => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            article.title?.toLowerCase().includes(q) ||
            article.excerpt?.toLowerCase().includes(q) ||
            article.category?.toLowerCase().includes(q)
        );
    });

    return (
        <TooltipProvider>
            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Makale veya kategori ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-muted/30 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl font-medium"
                />
            </div>

            {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
                    <Filter className="w-12 h-12 text-zinc-500 mb-4" />
                    <h3 className="text-lg font-bold mb-1">Sonuç bulunamadı</h3>
                    <p className="text-zinc-500 text-sm">"{searchQuery}" ile eşleşen makale yok.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <ArticleCard 
                            key={article.id}
                            article={article}
                        />
                    ))}
                </div>
            )}
        </TooltipProvider>
    );
}
