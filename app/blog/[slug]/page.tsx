import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedArticles } from "@/components/blog/related-articles";
import { ArticleHero } from "@/components/articles/article-hero";
import { createClient } from "@/lib/supabase-server";
import { getArticleBySlug } from "@/lib/api";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";
import { Metadata } from "next";
import { ArticleReader } from "@/components/blog/article-reader";

interface PageProps {
    params: Promise<{ slug: string }>;
}
// ... (Metadata part unchanged) ...
// Calculate reading time
const readingTime = calculateReadingTime(article.content || "");
const formattedReadingTime = formatReadingTime(readingTime);

// JSON-LD structured data for Article
const jsonLd = {
// ...
                {/* State-managed Article Reader */ }
<ArticleReader
    article={article}
    readingTime={formattedReadingTime}
    likeCount={likeCount || 0}
    initialLiked={!!userLike}
    initialBookmarked={!!userBookmark}
    comments={comments || []}
    isLoggedIn={!!user}
    isAdmin={isAdmin}
    userAvatar={user ? (profiles?.find(p => p.id === user.id)?.avatar_url) : undefined}
/>
            </div >
        </>
    );
}
