"use server";

import { createClient } from "@/lib/supabase-server";
import { generateEmbedding } from "@/lib/gemini";
import { sanitizeSearchQuery } from "@/lib/security";
import { slugify } from "@/lib/slug";
import { simulations } from "@/components/simulations/data";

export type SearchResultType = "article" | "question" | "user" | "dictionary" | "quiz" | "simulation";

export type SearchResult = {
    type: SearchResultType;
    id: string | number;
    title: string;
    description?: string;
    url: string;
    image?: string;
    category?: string;
    similarity?: number;
};

type VectorSearchRow = {
    id?: string | number;
    source_id?: string | number;
    source_type?: string;
    title?: string;
    content?: string | null;
    slug?: string | null;
    username?: string | null;
    cover_image?: string | null;
    image_url?: string | null;
    similarity?: number;
};

type ArticleSearchRow = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_url?: string | null;
    image_url?: string | null;
    category?: string | null;
};

type QuestionSearchRow = {
    id: number;
    title: string;
    content: string | null;
    category?: string | null;
};

type ProfileSearchRow = {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
};

type DictionarySearchRow = {
    id: number;
    term: string;
    definition: string;
    category: string | null;
};

type QuizSearchRow = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
};

const MAX_QUERY_LENGTH = 80;
const RESULT_LIMIT = 24;

function normalizeQuery(query: string): string {
    return query.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
}

function toSnippet(value: string | null | undefined, maxLength = 140): string | undefined {
    if (!value) return undefined;
    const clean = value
        .replace(/<!--meta .*? -->/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!clean) return undefined;
    return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}...` : clean;
}

function buildSearchTerm(query: string): string {
    const safeQuery = sanitizeSearchQuery(query).replace(/[(),]/g, " ");
    return `%${safeQuery}%`;
}

function getVectorUrl(item: VectorSearchRow): string | null {
    const type = item.source_type;
    const id = item.source_id ?? item.id;

    if (type === "question" && id) return `/forum/${id}`;
    if (type === "article") return `/makale/${item.slug || id}`;
    if (type === "user" && item.username) return `/kullanici/${item.username}`;
    if (type === "dictionary" && item.slug) return `/sozluk/${item.slug}`;
    if (type === "quiz" && item.slug) return `/testler/${item.slug}`;

    return null;
}

function addResult(results: SearchResult[], result: SearchResult) {
    const exists = results.some((item) => item.type === result.type && item.id === result.id);
    if (!exists) results.push(result);
}

export async function searchGlobal(rawQuery: string): Promise<SearchResult[]> {
    const query = normalizeQuery(rawQuery);
    if (query.length < 2) return [];

    const supabase = await createClient();
    const results: SearchResult[] = [];

    const embedding = await generateEmbedding(query);
    if (embedding) {
        const { data: vectorData } = await supabase.rpc("match_documents", {
            query_embedding: embedding,
            match_threshold: 0.52,
            match_count: 8,
        });

        const vectorRows = Array.isArray(vectorData) ? (vectorData as VectorSearchRow[]) : [];
        for (const item of vectorRows) {
            const type = item.source_type as SearchResultType | undefined;
            const id = item.source_id ?? item.id;
            const url = getVectorUrl(item);

            if (!type || !id || !item.title || !url) continue;

            addResult(results, {
                type,
                id,
                title: item.title,
                description: toSnippet(item.content),
                url,
                image: item.cover_image || item.image_url || undefined,
                similarity: item.similarity,
            });
        }
    }

    const searchTerm = buildSearchTerm(query);

    const [questionsRes, articlesRes, profilesRes, dictionaryRes, quizzesRes] = await Promise.all([
        supabase
            .from("questions")
            .select("id, title, content, category")
            .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(5),
        supabase
            .from("articles")
            .select("id, title, slug, excerpt, cover_url, image_url, category")
            .eq("status", "published")
            .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(6),
        supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url")
            .or(`username.ilike.${searchTerm},full_name.ilike.${searchTerm}`)
            .limit(4),
        supabase
            .from("dictionary_terms")
            .select("id, term, definition, category")
            .or(`term.ilike.${searchTerm},definition.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("term", { ascending: true })
            .limit(5),
        supabase
            .from("quizzes")
            .select("id, title, slug, description")
            .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(4),
    ]);

    for (const question of (questionsRes.data || []) as QuestionSearchRow[]) {
        addResult(results, {
            type: "question",
            id: question.id,
            title: question.title,
            description: toSnippet(question.content),
            url: `/forum/${question.id}`,
            category: question.category || "Forum",
        });
    }

    for (const article of (articlesRes.data || []) as ArticleSearchRow[]) {
        addResult(results, {
            type: "article",
            id: article.id,
            title: article.title,
            description: toSnippet(article.excerpt),
            url: `/makale/${article.slug || article.id}`,
            image: article.cover_url || article.image_url || undefined,
            category: article.category || "Makale",
        });
    }

    for (const profile of (profilesRes.data || []) as ProfileSearchRow[]) {
        const username = profile.username || profile.id;
        addResult(results, {
            type: "user",
            id: profile.id,
            title: profile.full_name || profile.username || "FizikHub üyesi",
            description: profile.username ? `@${profile.username}` : "Kullanıcı profili",
            url: `/kullanici/${username}`,
            image: profile.avatar_url || undefined,
            category: "Kullanıcı",
        });
    }

    for (const term of (dictionaryRes.data || []) as DictionarySearchRow[]) {
        addResult(results, {
            type: "dictionary",
            id: term.id,
            title: term.term,
            description: toSnippet(term.definition),
            url: `/sozluk/${slugify(term.term)}`,
            category: term.category || "Sözlük",
        });
    }

    for (const quiz of (quizzesRes.data || []) as QuizSearchRow[]) {
        addResult(results, {
            type: "quiz",
            id: quiz.id,
            title: quiz.title,
            description: toSnippet(quiz.description),
            url: `/testler/${quiz.slug}`,
            category: "Test",
        });
    }

    const lowerQuery = query.toLocaleLowerCase("tr-TR");
    for (const simulation of simulations) {
        const haystack = [
            simulation.title,
            simulation.description,
            simulation.formula,
            simulation.difficulty,
            ...simulation.tags,
            ...(simulation.seo?.keywords || []),
        ].join(" ").toLocaleLowerCase("tr-TR");

        if (!haystack.includes(lowerQuery)) continue;

        addResult(results, {
            type: "simulation",
            id: simulation.id,
            title: simulation.title,
            description: simulation.description,
            url: `/simulasyonlar/${simulation.slug}`,
            category: `Simülasyon • ${simulation.difficulty}`,
        });
    }

    return results.slice(0, RESULT_LIMIT);
}
