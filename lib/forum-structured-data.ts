import { stripMarkdownForMeta } from "@/lib/seo-utils";

export type ForumStructuredDataProfile = {
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    is_verified?: boolean | null;
};

export type ForumStructuredDataQuestion = {
    id: number | string;
    title?: string | null;
    content?: string | null;
    category?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    votes?: number | null;
    tags?: string[] | null;
    profiles?: ForumStructuredDataProfile | ForumStructuredDataProfile[] | null;
    answers?: Array<{ count?: number | null } | Record<string, unknown>> | null;
    all_answers?: Array<{ count?: number | null }> | null;
};

export function getForumAnswerUpvoteCount(answer: { likeCount?: number | null; votes?: number | null }) {
    if (typeof answer.likeCount === "number" && Number.isFinite(answer.likeCount) && answer.likeCount >= 0) {
        return answer.likeCount;
    }

    return typeof answer.votes === "number" && Number.isFinite(answer.votes) && answer.votes >= 0
        ? answer.votes
        : 0;
}

function firstProfile(profile: ForumStructuredDataQuestion["profiles"]) {
    if (Array.isArray(profile)) return profile[0] || null;
    return profile || null;
}

function encodePathSegment(value: string) {
    return encodeURIComponent(value).replace(/%2F/gi, "");
}

export function getForumStructuredDataAuthor(question: ForumStructuredDataQuestion, baseUrl: string) {
    const profile = firstProfile(question.profiles);
    const username = profile?.username?.trim();
    const name = profile?.full_name?.trim() || username || "Fizikhub Üyesi";

    return {
        "@type": "Person",
        name,
        url: username ? `${baseUrl}/kullanici/${encodePathSegment(username)}` : `${baseUrl}/forum`,
    };
}

export function getForumAnswerCount(question: ForumStructuredDataQuestion) {
    const countedAnswers = question.all_answers?.[0]?.count ?? question.answers?.[0]?.count;

    if (typeof countedAnswers === "number") return countedAnswers;
    if (Array.isArray(question.answers)) return question.answers.length;

    return 0;
}

export function buildForumDiscussionPostingItem(
    question: ForumStructuredDataQuestion,
    index: number,
    baseUrl: string,
) {
    const discussionUrl = `${baseUrl}/forum/${question.id}`;
    const title = question.title?.trim() || `Fizikhub forum sorusu ${question.id}`;
    const keywords = [question.category, ...(question.tags || [])]
        .filter((value): value is string => Boolean(value?.trim()))
        .slice(0, 8);

    return {
        "@type": "ListItem",
        position: index + 1,
        url: discussionUrl,
        name: title,
        item: {
            "@type": "DiscussionForumPosting",
            "@id": `${discussionUrl}#discussion`,
            mainEntityOfPage: discussionUrl,
            url: discussionUrl,
            headline: title,
            text: stripMarkdownForMeta(question.content).slice(0, 500) || title,
            articleSection: question.category || "Fizik",
            genre: "Bilim forumu",
            inLanguage: "tr-TR",
            ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
            datePublished: question.created_at,
            ...(question.updated_at ? { dateModified: question.updated_at } : {}),
            author: getForumStructuredDataAuthor(question, baseUrl),
            publisher: {
                "@type": "Organization",
                "@id": `${baseUrl}/#organization`,
                name: "Fizikhub",
                url: baseUrl,
            },
            commentCount: getForumAnswerCount(question),
            interactionStatistic: {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/LikeAction",
                userInteractionCount: question.votes || 0,
            },
        },
    };
}
