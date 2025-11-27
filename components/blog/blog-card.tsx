import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { Article } from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Simple Badge component inline if not exists
function SimpleBadge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/20 text-primary hover:bg-primary/30 ${className}`}>
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
            <Card id={`article-${article.slug}`} className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_var(--color-primary)] group">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={(article.image_url && (article.image_url.startsWith('http') || article.image_url.startsWith('/')))
                            ? article.image_url
                            : "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                        <SimpleBadge>{article.category}</SimpleBadge>
                    </div>
                </div>
                <CardHeader className="p-4">
                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                        {article.title}
                    </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {article.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author?.full_name || article.author?.username || "Anonim"}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(article.created_at), "d MMMM yyyy", { locale: tr })}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
