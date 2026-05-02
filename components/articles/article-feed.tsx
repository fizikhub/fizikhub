"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { m as motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    BookMarked,
    CalendarDays,
    Clock3,
    Compass,
    Layers3,
    LayoutGrid,
    LibraryBig,
    List,
    Search,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingMarquee } from "@/components/ui/trending-marquee";
import { type ScienceNewsItem } from "@/lib/rss";

interface ArticleFeedProps {
    articles: RawArticle[];
    categories: CategoryStat[];
    activeCategory?: string;
    sortParam: string;
    newsItems: ScienceNewsItem[];
    searchQuery?: string;
}

type CategoryStat = {
    name: string;
    count: number;
};

type RawArticle = {
    id: string | number;
    title: string;
    slug: string;
    excerpt?: string | null;
    summary?: string | null;
    content?: string | null;
    created_at: string;
    category?: string | null;
    image_url?: string | null;
    cover_url?: string | null;
    author?: {
        full_name?: string | null;
    } | null;
    profiles?: {
        full_name?: string | null;
    } | null;
};

type LibraryArticle = {
    id: string | number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    author: string;
    slug: string;
    readingTime: number;
};

type ViewMode = "covers" | "compact";
type SortMode = "newest" | "short" | "long" | "az";

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E")`;

const sortOptions: Array<{ value: SortMode; label: string }> = [
    { value: "newest", label: "Yeni" },
    { value: "short", label: "Kısa" },
    { value: "long", label: "Derin" },
    { value: "az", label: "A-Z" },
];

function makeMakaleHref(category?: string, searchQuery?: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);
    const query = params.toString();
    return query ? `/makale?${query}` : "/makale";
}

function cleanExcerpt(article: RawArticle) {
    const raw = article.summary || article.excerpt || article.content || "";
    const text = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/^[#\s]+/, "").trim();
    return text || "Bu makale için kısa özet hazırlanıyor. Kapak sayfasını açıp yazının tamamına geçebilirsin.";
}

function readingTime(content?: string | null) {
    const plainText = String(content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const words = plainText ? plainText.split(" ").length : 500;
    return Math.max(1, Math.ceil(words / 220));
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(date));
}

function ArticleBook({ article, index, featured = false }: { article: LibraryArticle; index: number; featured?: boolean }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24), ease: "easeOut" }}
            className={cn("group h-full", featured && "lg:col-span-2")}
        >
            <Link href={`/makale/${article.slug}`} className="block h-full">
                <div
                    className={cn(
                        "relative h-full min-h-[340px] overflow-hidden rounded-[8px] border-[3px] border-black bg-[#08152b] text-white sm:min-h-[390px]",
                        "shadow-[5px_5px_0px_0px_#000] transition-all duration-200 sm:shadow-[8px_8px_0px_0px_#000]",
                        "group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-[4px_4px_0px_0px_#000]",
                        featured && "min-h-[380px] sm:min-h-[460px]"
                    )}
                >
                    <Image
                        src={article.image}
                        alt={`${article.title} makale kapağı`}
                        fill
                        sizes={featured ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 640px) 100vw, 330px"}
                        priority={featured}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />
                    <div className="absolute inset-y-4 right-0 w-3 rounded-l-sm border-y border-l border-white/20 bg-white/25 shadow-[inset_5px_0_12px_rgba(255,255,255,.3)]" />
                    <div className="absolute inset-x-14 top-0 h-2 bg-gradient-to-b from-white/35 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-12 border-r-[3px] border-black bg-[#07132a]/95 shadow-[inset_-10px_0_20px_rgba(0,0,0,.35)] sm:w-14">
                        <span className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 -rotate-90 text-center font-serif text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
                            {article.category}
                        </span>
                    </div>
                    <div className="absolute right-0 top-0 h-24 w-24 bg-[#ffcc00] [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-[7px] border-[3px] border-black bg-white text-black shadow-[3px_3px_0_#000]">
                        <BookMarked className="h-5 w-5" />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 pl-16 pr-4 pb-4 sm:pl-20 sm:pr-6 sm:pb-7">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="border-2 border-black bg-[#ffcc00] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0_#000]">
                                {article.category}
                            </span>
                            <span className="border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                                {article.readingTime} dk okuma
                            </span>
                            <span className="border border-white/25 bg-black/35 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                                {formatDate(article.date)}
                            </span>
                        </div>
                        <h2
                            className={cn(
                                "font-serif font-black leading-[1.04] text-white drop-shadow-[0_2px_0_rgba(0,0,0,.65)]",
                                featured ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
                            )}
                        >
                            {article.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 max-w-xl text-sm font-medium leading-relaxed text-zinc-200">
                            {article.excerpt}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/20 pt-4">
                            <span className="min-w-0 truncate text-xs font-black uppercase tracking-widest text-zinc-300">
                                {article.author}
                            </span>
                            <span className="inline-flex flex-shrink-0 items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffcc00]">
                                Oku <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

function CompactArticleRow({ article, index }: { article: LibraryArticle; index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18), ease: "easeOut" }}
        >
            <Link href={`/makale/${article.slug}`} className="group block">
                <div className="grid grid-cols-[86px_1fr] gap-3 rounded-[8px] border-[3px] border-black bg-[#f7f2df] p-2 text-black shadow-[5px_5px_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] sm:grid-cols-[118px_1fr] sm:gap-4 sm:p-3">
                    <div className="relative min-h-[122px] overflow-hidden rounded-[6px] border-[3px] border-black bg-[#07132a] sm:min-h-[154px]">
                        <Image
                            src={article.image}
                            alt={`${article.title} makale kapağı`}
                            fill
                            sizes="130px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <div className="absolute inset-y-0 left-0 w-5 border-r-2 border-black bg-[#07132a]/95" />
                    </div>
                    <div className="flex min-w-0 flex-col py-1 pr-1">
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-[5px] border-2 border-black bg-[#ffcc00] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                {article.category}
                            </span>
                            <span className="rounded-[5px] border border-black/20 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                {article.readingTime} dk
                            </span>
                        </div>
                        <h2 className="line-clamp-2 font-serif text-lg font-black leading-[1.05] text-black sm:text-2xl">
                            {article.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-relaxed text-zinc-700 sm:line-clamp-3 sm:text-sm">
                            {article.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-dashed border-black/15 pt-2">
                            <span className="min-w-0 truncate text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {article.author}
                            </span>
                            <span className="inline-flex flex-shrink-0 items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#07132a]">
                                Oku <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}

function CatalogueControls({
    viewMode,
    setViewMode,
    sortMode,
    setSortMode,
}: {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    sortMode: SortMode;
    setSortMode: (mode: SortMode) => void;
}) {
    return (
        <div className="rounded-[8px] border-[3px] border-black bg-[#f7f2df] p-2 text-black shadow-[4px_4px_0_#000] sm:p-3 sm:shadow-[6px_6px_0_#000]">
            <div className="grid gap-2 sm:grid-cols-[1fr_1.3fr] sm:gap-3">
                <div>
                    <div className="mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 sm:mb-2 sm:text-[10px]">
                        Görünüm
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setViewMode("covers")}
                            className={cn(
                                "flex h-9 items-center justify-center gap-1.5 rounded-[7px] border-2 border-black text-[9px] font-black uppercase tracking-widest transition-all sm:h-10 sm:gap-2 sm:text-[10px]",
                                viewMode === "covers"
                                    ? "bg-[#ffcc00] shadow-[3px_3px_0_#000]"
                                    : "bg-white hover:bg-zinc-100"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Kapak
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("compact")}
                            className={cn(
                                "flex h-9 items-center justify-center gap-1.5 rounded-[7px] border-2 border-black text-[9px] font-black uppercase tracking-widest transition-all sm:h-10 sm:gap-2 sm:text-[10px]",
                                viewMode === "compact"
                                    ? "bg-[#ffcc00] shadow-[3px_3px_0_#000]"
                                    : "bg-white hover:bg-zinc-100"
                            )}
                        >
                            <List className="h-4 w-4" />
                            Liste
                        </button>
                    </div>
                </div>
                <div>
                    <div className="mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 sm:mb-2 sm:text-[10px]">
                        Sıralama
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSortMode(option.value)}
                                className={cn(
                                    "h-9 min-w-[74px] rounded-[7px] border-2 border-black px-2 text-[9px] font-black uppercase tracking-widest transition-all sm:h-10 sm:min-w-0 sm:text-[10px]",
                                    sortMode === option.value
                                        ? "bg-[#07132a] text-white shadow-[3px_3px_0_#000]"
                                        : "bg-white text-black hover:bg-zinc-100"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReadingRoute({ articles }: { articles: LibraryArticle[] }) {
    if (articles.length === 0) return null;

    return (
        <div className="min-w-0 rounded-[8px] border-[3px] border-black bg-[#07132a] p-2 text-white shadow-[4px_4px_0_#000] sm:p-3 sm:shadow-[6px_6px_0_#000]">
            <div className="mb-2 flex items-center gap-2 px-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#ffcc00] sm:mb-3 sm:text-[10px]">
                <Layers3 className="h-4 w-4" />
                Okuma Rotası
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:overflow-visible sm:pb-0">
                {articles.map((article, index) => (
                    <Link
                        key={article.id}
                        href={`/makale/${article.slug}`}
                        className="group/route grid min-w-[220px] grid-cols-[32px_1fr] items-center gap-2 rounded-[7px] border-2 border-white/15 bg-white/[0.08] px-2 py-2 transition-all hover:border-[#ffcc00] hover:bg-white/[0.12] sm:min-w-0 sm:grid-cols-[38px_1fr_auto] sm:gap-3"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-[6px] border-2 border-black bg-[#ffcc00] text-[11px] font-black text-black shadow-[2px_2px_0_#000] sm:h-8 sm:w-8 sm:text-xs">
                            {index + 1}
                        </span>
                        <span className="min-w-0">
                            <span className="line-clamp-2 block font-serif text-xs font-black leading-tight text-white sm:truncate sm:text-sm">
                                {article.title}
                            </span>
                            <span className="mt-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400 sm:gap-2 sm:text-[10px]">
                                <CalendarDays className="h-3 w-3" />
                                {article.category}
                            </span>
                        </span>
                        <ArrowRight className="hidden h-4 w-4 text-[#ffcc00] transition-transform group-hover/route:translate-x-1 sm:block" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function CategoryShelf({
    categories,
    activeCategory,
    searchQuery,
}: {
    categories: CategoryStat[];
    activeCategory?: string;
    searchQuery?: string;
}) {
    const totalCount = categories.reduce((total, category) => total + category.count, 0);

    return (
        <div className="min-w-0 rounded-[8px] border-[3px] border-black bg-[#f7f2df] p-2 text-black shadow-[4px_4px_0_#000] sm:p-3 sm:shadow-[6px_6px_0_#000]">
            <div className="mb-2 flex items-center gap-2 px-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 sm:mb-3 sm:text-[10px]">
                <LibraryBig className="h-4 w-4" />
                Raflar
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                <Link
                    href={makeMakaleHref(undefined, searchQuery)}
                    className={cn(
                        "whitespace-nowrap rounded-[7px] border-[2px] border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all sm:px-4 sm:py-2 sm:text-[11px]",
                        !activeCategory
                            ? "bg-[#ffcc00] text-black shadow-[3px_3px_0_#000]"
                            : "bg-white text-black hover:bg-zinc-100 hover:shadow-[3px_3px_0_#000]"
                    )}
                >
                    Tüm Makaleler
                    <span className="ml-2 rounded bg-black/10 px-1.5 py-0.5">{totalCount}</span>
                </Link>
                {categories.map((cat) => (
                    <Link
                        key={cat.name}
                        href={makeMakaleHref(cat.name, searchQuery)}
                        className={cn(
                            "whitespace-nowrap rounded-[7px] border-[2px] border-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all sm:py-2 sm:text-[11px]",
                            activeCategory === cat.name
                                ? "bg-[#07132a] text-white shadow-[3px_3px_0_#000]"
                                : "bg-white text-black hover:bg-zinc-100 hover:shadow-[3px_3px_0_#000]"
                        )}
                    >
                        {cat.name}
                        <span className={cn("ml-2 rounded px-1.5 py-0.5", activeCategory === cat.name ? "bg-white/15" : "bg-black/10")}>
                            {cat.count}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function ArticleFeed({ articles, categories, activeCategory, sortParam, newsItems, searchQuery }: ArticleFeedProps) {
    const router = useRouter();
    const [inputValue, setInputValue] = useState(searchQuery || "");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("covers");
    const [sortMode, setSortMode] = useState<SortMode>("newest");

    const libraryArticles = useMemo<LibraryArticle[]>(
        () =>
            articles.map((a) => ({
                id: a.id,
                title: a.title,
                excerpt: cleanExcerpt(a),
                image: a.cover_url || a.image_url || "/images/placeholder-article.webp",
                category: a.category || "Makale",
                date: a.created_at,
                author: a.author?.full_name || a.profiles?.full_name || "FizikHub Editör",
                slug: a.slug,
                readingTime: readingTime(a.content),
            })),
        [articles]
    );

    const sortedArticles = useMemo(() => {
        return [...libraryArticles].sort((a, b) => {
            if (sortMode === "short") return a.readingTime - b.readingTime;
            if (sortMode === "long") return b.readingTime - a.readingTime;
            if (sortMode === "az") return a.title.localeCompare(b.title, "tr");
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [libraryArticles, sortMode]);

    const featuredArticle = sortedArticles[0];
    const restArticles = sortedArticles.slice(1);
    const visibleCategories = categories.filter((category) => category.name);
    const routeArticles = sortedArticles.slice(0, 3);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        const q = inputValue.trim();
        if (q) params.set("q", q);
        if (activeCategory) params.set("category", activeCategory);
        if (sortParam !== "latest") params.set("sort", sortParam);
        router.push(`/makale${params.toString() ? `?${params.toString()}` : ""}`);
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#292929] pb-32 text-white selection:bg-[#ffcc00] selection:text-black">
            {newsItems && newsItems.length > 0 && <TrendingMarquee items={newsItems} />}

            <main className="relative mx-auto max-w-[1180px] px-2 pt-4 sm:px-6 sm:pt-10">
                <div className="absolute inset-x-0 top-0 z-0 h-[460px] overflow-hidden opacity-70">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#292929]/80 to-[#292929]" />
                </div>

                <motion.header
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="relative z-10 mb-5 overflow-hidden rounded-[8px] border-[3px] border-black bg-[#f7f2df] text-black shadow-[5px_5px_0_#000] sm:mb-7 sm:shadow-[8px_8px_0_#000]"
                    style={{ backgroundImage: PAPER_TEXTURE }}
                >
                    <div className="grid gap-4 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[1.05fr_.95fr] lg:p-9">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-[7px] border-[2px] border-black bg-[#ffcc00] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0_#000] sm:mb-4 sm:py-2 sm:text-[11px]">
                                <Sparkles className="h-4 w-4" />
                                Makale Atlası
                            </div>
                            <h1 className="max-w-3xl font-serif text-4xl font-black uppercase leading-[.95] tracking-normal text-black sm:text-6xl">
                                Bilim Makaleleri
                            </h1>
                            <p className="mt-3 max-w-2xl text-xs font-bold leading-relaxed text-zinc-700 sm:mt-4 sm:text-base">
                                Ana akış karışık akar; burası sadece makaleler için ayrılmış düzenli bir çalışma masası. Konuya göre raf seç, başlığa göre ara, ilgini çeken cildi aç.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 self-end sm:gap-3">
                            <div className="rounded-[8px] border-[3px] border-black bg-white p-2 shadow-[3px_3px_0_#000] sm:p-3 sm:shadow-[4px_4px_0_#000]">
                                <BookMarked className="mb-2 h-4 w-4 sm:mb-3 sm:h-5 sm:w-5" />
                                <div className="text-xl font-black sm:text-2xl">{sortedArticles.length}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 sm:text-[10px]">Eser</div>
                            </div>
                            <div className="rounded-[8px] border-[3px] border-black bg-[#07132a] p-2 text-white shadow-[3px_3px_0_#000] sm:p-3 sm:shadow-[4px_4px_0_#000]">
                                <Compass className="mb-2 h-4 w-4 text-[#ffcc00] sm:mb-3 sm:h-5 sm:w-5" />
                                <div className="text-xl font-black sm:text-2xl">{visibleCategories.length}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300 sm:text-[10px]">Kategori</div>
                            </div>
                            <div className="rounded-[8px] border-[3px] border-black bg-[#23a9fa] p-2 text-black shadow-[3px_3px_0_#000] sm:p-3 sm:shadow-[4px_4px_0_#000]">
                                <Clock3 className="mb-2 h-4 w-4 sm:mb-3 sm:h-5 sm:w-5" />
                                <div className="text-xl font-black sm:text-2xl">{featuredArticle?.readingTime || 0}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-zinc-900 sm:text-[10px]">İlk Okuma</div>
                            </div>
                        </div>
                    </div>
                </motion.header>

                <section className="relative z-10 mb-7 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="grid min-w-0 gap-3">
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.06 }}
                            className="rounded-[8px] border-[3px] border-black bg-white p-2 text-black shadow-[4px_4px_0_#000] sm:p-3 sm:shadow-[6px_6px_0_#000]"
                        >
                            <div
                                className={cn(
                                    "flex min-h-[48px] items-center overflow-hidden rounded-[7px] border-[3px] border-black bg-[#f7f2df] transition-all sm:min-h-[60px]",
                                    isSearchFocused && "bg-white shadow-[inset_0_0_0_3px_#ffcc00]"
                                )}
                            >
                                <div className="flex h-full items-center px-3 sm:px-4">
                                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Makale ara..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="min-w-0 flex-1 bg-transparent py-3 pr-2 text-xs font-black outline-none placeholder:text-zinc-500 sm:py-4 sm:pr-3 sm:text-base"
                                />
                                <button
                                    type="submit"
                                    className="m-1.5 inline-flex h-9 w-11 items-center justify-center rounded-[7px] border-[3px] border-black bg-[#ffcc00] text-[10px] font-black uppercase tracking-widest text-black shadow-[2px_2px_0_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] sm:m-2 sm:h-11 sm:w-auto sm:px-5 sm:text-xs sm:shadow-[3px_3px_0_#000]"
                                >
                                    Ara
                                </button>
                            </div>
                        </motion.form>
                        <CatalogueControls
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            sortMode={sortMode}
                            setSortMode={setSortMode}
                        />
                    </div>

                    <div className="grid min-w-0 gap-3">
                        <CategoryShelf categories={visibleCategories} activeCategory={activeCategory} searchQuery={searchQuery} />
                        <ReadingRoute articles={routeArticles} />
                    </div>
                </section>

                {(searchQuery || activeCategory) && (
                    <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border-[2px] border-white/15 bg-black/25 px-4 py-3 text-sm text-zinc-200">
                        <p>
                            {searchQuery && <span>&quot;{searchQuery}&quot; araması</span>}
                            {searchQuery && activeCategory && <span> · </span>}
                            {activeCategory && <span>{activeCategory} rafı</span>}
                            <span className="font-black text-[#ffcc00]"> {sortedArticles.length} makale</span>
                        </p>
                        <Link href="/makale" className="text-xs font-black uppercase tracking-widest text-white underline decoration-[#ffcc00] underline-offset-4">
                            Filtreleri temizle
                        </Link>
                    </div>
                )}

                {sortedArticles.length > 0 ? (
                    <section className="relative z-10">
                        {viewMode === "covers" && featuredArticle && (
                            <div className="mb-10">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300">Öne Çıkan Cilt</span>
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                </div>
                                <ArticleBook article={featuredArticle} index={0} featured />
                            </div>
                        )}

                        {viewMode === "covers" && restArticles.length > 0 && (
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300">Makale Rafları</span>
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {restArticles.map((article, index) => (
                                        <ArticleBook key={article.id} article={article} index={index + 1} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewMode === "compact" && (
                            <div>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300">Hızlı Tarama</span>
                                    <div className="h-[2px] flex-1 bg-white/15" />
                                </div>
                                <div className="grid gap-4">
                                    {sortedArticles.map((article, index) => (
                                        <CompactArticleRow key={article.id} article={article} index={index} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                ) : (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 mx-auto mt-12 max-w-xl rounded-[8px] border-[3px] border-black bg-[#f7f2df] p-8 text-center text-black shadow-[8px_8px_0_#000]"
                        style={{ backgroundImage: PAPER_TEXTURE }}
                    >
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[8px] border-[3px] border-black bg-[#ffcc00] shadow-[4px_4px_0_#000]">
                            <Search className="h-7 w-7" />
                        </div>
                        <h2 className="font-serif text-2xl font-black uppercase tracking-normal">Sonuç Bulunamadı</h2>
                        <p className="mx-auto mt-3 max-w-sm text-sm font-bold leading-relaxed text-zinc-700">
                            Bu raflarda aradığın makale yok. Başka bir anahtar kelime dene veya tüm makalelere dön.
                        </p>
                        <Link
                            href="/makale"
                            className="mt-6 inline-flex items-center justify-center rounded-[7px] border-[3px] border-black bg-[#07132a] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_#000]"
                        >
                            Tüm Makaleler
                        </Link>
                    </motion.section>
                )}
            </main>
        </div>
    );
}
