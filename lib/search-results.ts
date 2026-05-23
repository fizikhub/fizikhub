export type VectorSearchRow = {
    id?: string | number;
    source_id?: string | number;
    source_type?: string;
    title?: string;
    content?: string | null;
    slug?: string | null;
    username?: string | null;
    canonical_path?: string | null;
    cover_image?: string | null;
    image_url?: string | null;
    similarity?: number;
    hybrid_score?: number;
    keyword_rank?: number;
};

export function getVectorUrl(item: VectorSearchRow): string | null {
    if (item.canonical_path?.startsWith("/")) return item.canonical_path;

    const type = item.source_type;
    const id = item.source_id ?? item.id;

    if (type === "question" && id) return `/forum/${id}`;
    if (type === "article") return `/makale/${item.slug || id}`;
    if (type === "user" && item.username) return `/kullanici/${item.username}`;
    if (type === "dictionary" && item.slug) return `/sozluk/${item.slug}`;
    if (type === "quiz" && item.slug) return `/testler/${item.slug}`;

    return null;
}
