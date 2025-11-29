import { createClient } from "@/lib/supabase-server";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Compass } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string };
}) {
    const supabase = await createClient();
    const query = searchParams.q;
    const category = searchParams.category;

    let dbQuery = supabase
        .from("articles")
        .select(`
            *,
            profiles (
                username,
                full_name,
                avatar_url
            )
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (category) {
        dbQuery = dbQuery.eq("category", category);
    }

    const { data: articles } = await dbQuery;

    const categories = [
        "Kuantum Fiziği",
        "Astrofizik",
        "Modern Fizik",
        "Klasik Fizik",
        "Parçacık Fiziği",
        "Termodinamik",
        "Bilim Tarihi",
        "Popüler Bilim"
    ];

    return (
        <div className="container max-w-5xl py-8 space-y-8 pb-24">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Compass className="h-8 w-8 text-primary" />
                    Keşfet
                </h1>
                <p className="text-muted-foreground">
                    Topluluk tarafından yazılan en yeni makaleleri keşfedin.
                </p>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <form action="/kesfet" method="GET">
                            <Input
                                name="q"
                                placeholder="Makale ara..."
                                className="pl-9"
                                defaultValue={query}
                            />
                            {category && <input type="hidden" name="category" value={category} />}
                        </form>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                    <Link href="/kesfet">
                        <Badge variant={!category ? "default" : "outline"} className="cursor-pointer">
                            Tümü
                        </Badge>
                    </Link>
                    {categories.map((cat) => (
                        <Link key={cat} href={`/kesfet?category=${encodeURIComponent(cat)}${query ? `&q=${query}` : ''}`}>
                            <Badge
                                variant={category === cat ? "default" : "outline"}
                                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {cat}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {!articles || articles.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <p className="text-muted-foreground">Aradığınız kriterlere uygun makale bulunamadı.</p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <Link key={article.id} href={`/blog/${article.slug}`} className="group">
                            <div className="flex flex-col h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary/20">
                                            <Compass className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                            {article.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-5 space-y-3">
                                    <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                                        {article.excerpt || article.content.substring(0, 150)}...
                                    </p>
                                    <div className="flex items-center justify-between pt-4 mt-auto border-t">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {article.profiles?.avatar_url ? (
                                                <img src={article.profiles.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {article.profiles?.username?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                            <span className="truncate max-w-[100px]">{article.profiles?.username}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
