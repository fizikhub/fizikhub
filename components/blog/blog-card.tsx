import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, User, Eye } from "lucide-react";
import { Article } from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Simple Badge component inline if not exists
function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${className}`}>
            {children}
        </span>
    );
}

interface BlogCardProps {
    article: Article;
}

export function BlogCard({ article }: BlogCardProps) {
    return (
        <Link href={`/blog/${article.slug}`} scroll={true}>
            <Card
                id={`article-${article.slug}`}
                className="group h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
            >
                {/* Image Container */}
                <div className="relative h-56 sm:h-60 md:h-64 w-full overflow-hidden">
                    <Image
                        src={(article.image_url && (article.image_url.startsWith('http') || article.image_url.startsWith('/')))
                            ? article.image_url
                            : "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <SimpleBadge className="bg-primary/90 backdrop-blur-md text-primary-foreground shadow-lg">
                            {article.category}
                        </SimpleBadge>
                    </div>
                </div>

                {/* Content */}
                <CardHeader className="p-5 sm:p-6 pb-3">
                    <h3 className="line-clamp-2 text-xl sm:text-2xl font-bold tracking-tight leading-tight transition-colors group-hover:text-primary">
                        {article.title}
                    </h3>
                </CardHeader>

                <CardContent className="px-5 sm:px-6 pt-0 pb-4">
                    <p className="line-clamp-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {article.excerpt}
                    </p>
                </CardContent>

                {/* Footer */}
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                        <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="truncate max-w-[120px] sm:max-w-none">
                            {article.author?.full_name || article.author?.username || "Anonim"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="whitespace-nowrap">
                            {format(new Date(article.created_at), "d MMM yyyy", { locale: tr })}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
