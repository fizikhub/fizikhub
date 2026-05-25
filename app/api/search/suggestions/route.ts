import { buildOpenSearchSuggestions, getSearchSuggestions, normalizeSuggestionQuery } from "@/lib/search-suggestions";
import { getSiteUrl } from "@/lib/seo-utils";

export const revalidate = 60;

export async function GET(request: Request) {
    const url = new URL(request.url);
    const query = normalizeSuggestionQuery(url.searchParams.get("q") || url.searchParams.get("searchTerms") || "");
    const suggestions = await getSearchSuggestions(query);
    const payload = buildOpenSearchSuggestions(query, suggestions, getSiteUrl());

    return new Response(JSON.stringify(payload), {
        headers: {
            "Content-Type": "application/x-suggestions+json; charset=utf-8",
            "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
            "X-Robots-Tag": "noindex, follow",
        },
    });
}
