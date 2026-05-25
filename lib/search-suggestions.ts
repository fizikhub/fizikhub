import { simulations } from "@/components/simulations/data";
import { sanitizeSearchQuery } from "@/lib/security";
import { simulationMatchesQuery } from "@/lib/simulation-learning";
import { getTopicClusterHref, getTopicClustersForText, normalizeTopicSearchText } from "@/lib/seo-topic-clusters";
import { getSiteUrl, truncateForMeta } from "@/lib/seo-utils";
import { slugify } from "@/lib/slug";
import { createStaticClient, hasSupabasePublicConfig } from "@/lib/supabase-server";

export const MAX_SUGGESTION_QUERY_LENGTH = 80;
export const MAX_SEARCH_SUGGESTIONS = 8;

export type SearchSuggestionType = "article" | "question" | "dictionary" | "quiz" | "simulation" | "topic";

export type SearchSuggestion = {
    title: string;
    description?: string;
    url: string;
    type: SearchSuggestionType;
};

export type OpenSearchSuggestionPayload = [string, string[], string[], string[]];

type ArticleSuggestionRow = {
    title: string;
    slug: string | null;
    excerpt: string | null;
    category: string | null;
};

type QuestionSuggestionRow = {
    id: number;
    title: string;
    content: string | null;
    category: string | null;
};

type DictionarySuggestionRow = {
    term: string;
    definition: string | null;
    category: string | null;
};

type QuizSuggestionRow = {
    title: string;
    slug: string | null;
    description: string | null;
};

type SearchSuggestionRpcRow = {
    source_type: unknown;
    title: unknown;
    description: unknown;
    url: unknown;
};

type PublicSupabaseClient = ReturnType<typeof createStaticClient>;

const SEARCH_SUGGESTION_TYPES = new Set<SearchSuggestionType>([
    "article",
    "question",
    "dictionary",
    "quiz",
    "simulation",
    "topic",
]);

function isSearchSuggestionType(value: unknown): value is SearchSuggestionType {
    return typeof value === "string" && SEARCH_SUGGESTION_TYPES.has(value as SearchSuggestionType);
}

function toSnippet(value: string | null | undefined, maxLength = 120) {
    if (!value) return undefined;

    const clean = truncateForMeta(value, maxLength);
    return clean.length > 0 ? clean : undefined;
}

function buildSearchTerm(query: string) {
    const safeQuery = sanitizeSearchQuery(query).replace(/[(),]/g, " ");
    return `%${safeQuery}%`;
}

function toAbsoluteSuggestionUrl(url: string, baseUrl: string) {
    try {
        return new URL(url).toString();
    } catch {
        return new URL(url, baseUrl).toString();
    }
}

function addSuggestion(suggestions: SearchSuggestion[], suggestion: SearchSuggestion) {
    const exists = suggestions.some((item) => item.url === suggestion.url || item.title === suggestion.title);
    if (!exists) suggestions.push(suggestion);
}

export function mapSearchSuggestionRpcRows(rows: unknown[]): SearchSuggestion[] {
    return rows.flatMap((row) => {
        const suggestion = row as SearchSuggestionRpcRow;
        if (!isSearchSuggestionType(suggestion.source_type)) return [];
        if (typeof suggestion.title !== "string" || typeof suggestion.url !== "string") return [];

        return [{
            type: suggestion.source_type,
            title: suggestion.title,
            description: typeof suggestion.description === "string" ? toSnippet(suggestion.description) : undefined,
            url: suggestion.url,
        }];
    });
}

function getStaticSuggestions(query: string) {
    const suggestions: SearchSuggestion[] = [];
    const lowerQuery = normalizeTopicSearchText(query);

    for (const cluster of getTopicClustersForText(query, { limit: 4, minScore: 3 })) {
        addSuggestion(suggestions, {
            type: "topic",
            title: cluster.title,
            description: toSnippet([
                cluster.intentQuestions[0],
                cluster.aliases.length > 0 ? `Alt konular: ${cluster.aliases.join(", ")}` : null,
            ].filter(Boolean).join(" ")),
            url: getTopicClusterHref(cluster),
        });
    }

    if (lowerQuery.length < 2) return suggestions;

    for (const simulation of simulations) {
        if (!simulationMatchesQuery(simulation, query)) continue;

        addSuggestion(suggestions, {
            type: "simulation",
            title: simulation.title,
            description: toSnippet(simulation.description),
            url: `/simulasyonlar/${simulation.slug}`,
        });
    }

    return suggestions;
}

export function normalizeSuggestionQuery(rawQuery: string) {
    return rawQuery.replace(/\s+/g, " ").trim().slice(0, MAX_SUGGESTION_QUERY_LENGTH);
}

export function buildOpenSearchSuggestions(
    query: string,
    suggestions: SearchSuggestion[],
    baseUrl = getSiteUrl(),
): OpenSearchSuggestionPayload {
    const limitedSuggestions = suggestions.slice(0, MAX_SEARCH_SUGGESTIONS);

    return [
        normalizeSuggestionQuery(query),
        limitedSuggestions.map((suggestion) => suggestion.title),
        limitedSuggestions.map((suggestion) => suggestion.description || `${suggestion.title} - Fizikhub`),
        limitedSuggestions.map((suggestion) => toAbsoluteSuggestionUrl(suggestion.url, baseUrl)),
    ];
}

async function fetchRpcSuggestions(
    supabase: PublicSupabaseClient,
    query: string,
    limit: number,
): Promise<SearchSuggestion[] | null> {
    const rpcClient = supabase as unknown as {
        rpc: (
            fn: "search_suggestions",
            args: { search_text: string; match_count: number },
        ) => Promise<{ data: unknown; error: unknown }>;
    };

    const { data, error } = await rpcClient.rpc("search_suggestions", {
        search_text: query,
        match_count: limit,
    });

    if (error || !Array.isArray(data)) return null;
    return mapSearchSuggestionRpcRows(data);
}

async function fetchFallbackDatabaseSuggestions(
    supabase: PublicSupabaseClient,
    query: string,
): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];
    const searchTerm = buildSearchTerm(query);

    const [articlesRes, questionsRes, dictionaryRes, quizzesRes] = await Promise.all([
        supabase
            .from("articles")
            .select("title, slug, excerpt, category")
            .eq("status", "published")
            .not("slug", "is", null)
            .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(3),
        supabase
            .from("questions")
            .select("id, title, content, category")
            .eq("status", "published")
            .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(2),
        supabase
            .from("dictionary_terms")
            .select("term, definition, category")
            .or(`term.ilike.${searchTerm},definition.ilike.${searchTerm},category.ilike.${searchTerm}`)
            .order("term", { ascending: true })
            .limit(3),
        supabase
            .from("quizzes")
            .select("title, slug, description")
            .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .order("created_at", { ascending: false })
            .limit(2),
    ]);

    for (const article of (articlesRes.data || []) as ArticleSuggestionRow[]) {
        if (!article.slug) continue;
        addSuggestion(suggestions, {
            type: "article",
            title: article.title,
            description: toSnippet(article.excerpt || article.category),
            url: `/makale/${article.slug}`,
        });
    }

    for (const question of (questionsRes.data || []) as QuestionSuggestionRow[]) {
        addSuggestion(suggestions, {
            type: "question",
            title: question.title,
            description: toSnippet(question.content || question.category),
            url: `/forum/${question.id}`,
        });
    }

    for (const term of (dictionaryRes.data || []) as DictionarySuggestionRow[]) {
        addSuggestion(suggestions, {
            type: "dictionary",
            title: term.term,
            description: toSnippet(term.definition || term.category),
            url: `/sozluk/${slugify(term.term)}`,
        });
    }

    for (const quiz of (quizzesRes.data || []) as QuizSuggestionRow[]) {
        if (!quiz.slug) continue;
        addSuggestion(suggestions, {
            type: "quiz",
            title: quiz.title,
            description: toSnippet(quiz.description || "Fizikhub fizik testi"),
            url: `/testler/${quiz.slug}`,
        });
    }

    return suggestions;
}

export async function getSearchSuggestions(rawQuery: string): Promise<SearchSuggestion[]> {
    const query = normalizeSuggestionQuery(rawQuery);
    if (query.length < 2) return [];

    const suggestions = getStaticSuggestions(query);
    if (!hasSupabasePublicConfig()) return suggestions.slice(0, MAX_SEARCH_SUGGESTIONS);

    try {
        const supabase = createStaticClient();
        const remainingLimit = MAX_SEARCH_SUGGESTIONS - suggestions.length;

        if (remainingLimit > 0) {
            const rpcSuggestions = await fetchRpcSuggestions(supabase, query, remainingLimit);
            const databaseSuggestions = rpcSuggestions ?? await fetchFallbackDatabaseSuggestions(supabase, query);

            for (const suggestion of databaseSuggestions) {
                addSuggestion(suggestions, suggestion);
            }
        }
    } catch (error) {
        console.error("search suggestions error:", error);
    }

    return suggestions.slice(0, MAX_SEARCH_SUGGESTIONS);
}
