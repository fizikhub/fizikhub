
import { FeedItem } from "@/components/home/unified-feed";

type FeedAuthor = {
    full_name?: string | null;
    is_writer?: boolean | null;
};

type FeedArticle = {
    id: string;
    title: string;
    excerpt?: string | null;
    summary?: string | null;
    content?: string | null;
    category: string;
    cover_url?: string | null;
    image_url?: string | null;
    image?: string | null;
    slug: string;
    created_at: string;
    reading_time?: number | null;
    author?: FeedAuthor | null;
};

type FeedQuestion = {
    id: string | number;
    content?: string | null;
    answers?: { count?: number | null }[] | null;
    created_at: string;
    [key: string]: unknown;
};

function buildArticlePreview(article: FeedArticle) {
    const explicitPreview = article.excerpt || article.summary;
    if (explicitPreview) return explicitPreview;

    if (!article.content) return "";

    return article.content
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[[^\]]+\]\([^)]*\)/g, (match: string) => match.match(/\[([^\]]+)\]/)?.[1] || " ")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 360);
}

export function processFeedData(articles: FeedArticle[], questions: FeedQuestion[]): FeedItem[] {
    const feedItems: FeedItem[] = [];

    // Add Articles
    articles.forEach((originalA) => {
        const a = { ...originalA };
        let type: FeedItem['type'] = a.author?.is_writer ? 'article' : 'blog';
        if (a.category === 'Deney') {
            type = 'experiment';
        } else if (a.category === 'Kitap İncelemesi') {
            type = 'book-review';
        } else if (a.category === 'Terim') {
            type = 'term';
        }

        // Homepage feed must never ship full article bodies to the browser.
        // Build a short fallback preview server-side for cards without an explicit excerpt.
        a.summary = buildArticlePreview(a);
        delete a.content;

        feedItems.push({
            type: type,
            data: {
                ...a,
                likes_count: 0,
                comments_count: 0
            },
            sortDate: a.created_at
        });
    });

    // Add Questions
    questions.forEach((originalQ) => {
        const q = { ...originalQ };
        // --- Payload Optimization ---
        // Strip HTML and truncate question content to a max of 400 chars.
        // QuestionCard only needs the first 160-300 chars for its "Read More" state.
        if (q.content) {
            const plainContent = q.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            q.content = plainContent.length > 400 ? plainContent.substring(0, 400) + '...' : plainContent;
        }

        const answerCount = q.answers?.[0]?.count || 0;
        delete q.answers;

        feedItems.push({
            type: 'question',
            data: {
                ...q,
                answer_count: answerCount
            },
            sortDate: q.created_at
        });
    });

    // Sort by date descending
    return feedItems.sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime());
}

export function formatSliderArticles(articles: FeedArticle[]) {
    return articles
        .filter((a) => a.category === 'Makale' || a.author?.is_writer)
        .map((a) => {
            return {
                id: a.id,
                title: a.title,
                image: a.cover_url || a.image_url || a.image || null,
                slug: a.slug,
                category: a.category,
                author_name: a.author?.full_name || 'FizikHub',
                created_at: a.created_at,
                reading_time: a.reading_time || 5
            };
        });
}
