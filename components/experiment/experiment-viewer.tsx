"use client";

// We can probably reuse ArticleReader or extend it, but for now let's create a specialized one for better control over the layout
// actually reusing ArticleReader logic but cleaner might be better. 
// However, the ArticleReader handles comments and likes which we need.
// Let's wrapping ArticleReader but overriding the hero part?
// ArticleReader is a bit monolithic (handles sidebar etc).

import { ArticleReader } from "@/components/blog/article-reader";
// It seems ArticleReader renders content itself. Let's see if we can use it.
// ArticleReader takes `article` and renders `MarkdownRenderer`.

// The `ArticleReader` has a layout with sidebar. We want that.
// BUT `ArticleReader` might have the ArticleHero built-in or assumes standard article structure.
// Let's check ArticleReader again. 
// Ah, in `makale/[slug]`, ArticleHero is separate!
// `<ArticleHero article={article} readingTime={formattedReadingTime} />`
// `<ArticleReader ... />`
// So I can just use ArticleReader for the content part!

// Wait, the content in `article.content` for experiments includes the metadata preamble `<!--meta ... -->`.
// We should probably strip that before passing to ArticleReader or MarkdownRenderer.
// The MarkdownRenderer might show it as comment (invisible) which is fine, or text.
// If it's HTML comment `<!-- -->` it won't show in markdown renderer usually.

import { ExperimentHero } from "./experiment-hero";

interface ExperimentViewerProps {
    article: any;
    readingTime: string;
    likeCount: number;
    initialLiked: boolean;
    initialBookmarked: boolean;
    comments: any[];
    isLoggedIn: boolean;
    isAdmin: boolean;
    userAvatar?: string;
    relatedArticles: any[];
}

export function ExperimentViewer({
    article,
    readingTime,
    likeCount,
    initialLiked,
    initialBookmarked,
    comments,
    isLoggedIn,
    isAdmin,
    userAvatar,
    relatedArticles
}: ExperimentViewerProps) {

    // Parse metadata
    let experimentMeta = {};
    try {
        const metaMatch = article.content?.match(/<!--meta ({.*}) -->/);
        if (metaMatch && metaMatch[1]) {
            experimentMeta = JSON.parse(metaMatch[1]);
        }
    } catch (e) {
        console.error("Failed to parse experiment meta", e);
    }

    // Prepare content (strip meta if needed, or leave it if invisible)
    // It's better to leave it if it's a comment.

    return (
        <div className="min-h-screen bg-background pb-20">
            <ExperimentHero
                article={article}
                readingTime={readingTime}
                experimentMeta={experimentMeta}
            />

            <ArticleReader
                article={article}
                readingTime={readingTime}
                likeCount={likeCount}
                initialLiked={initialLiked}
                initialBookmarked={initialBookmarked}
                comments={comments}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                userAvatar={userAvatar}
                relatedArticles={relatedArticles}
            />
        </div>
    );
}
