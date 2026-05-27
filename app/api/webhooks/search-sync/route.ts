import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slug";
import { rateLimiter } from "@/lib/upstash";

type SearchSyncRecord = {
    id?: string | number | null;
    title?: string | null;
    term?: string | null;
    slug?: string | null;
    category?: string | null;
    excerpt?: string | null;
    content?: string | null;
    definition?: string | null;
    description?: string | null;
    status?: string | null;
    published?: boolean | null;
    tags?: unknown;
    cover_url?: string | null;
    image_url?: string | null;
};

type SearchSyncPayload = {
    type?: string;
    table?: string;
    record?: SearchSyncRecord | null;
    old_record?: SearchSyncRecord | null;
};

// Helper to determine singular resource name
function getTableSingular(table: string): string {
    if (table === "articles") return "article";
    if (table === "questions") return "question";
    if (table === "dictionary_terms") return "dictionary";
    if (table === "quizzes") return "quiz";
    return table;
}

// Clean and prepare searchable text representation for embedding
function buildSearchableText(table: string, record: SearchSyncRecord): string {
    if (table === "articles") {
        return `Title: ${record.title || ""}\nCategory: ${record.category || ""}\nExcerpt: ${record.excerpt || ""}\nContent: ${record.content || ""}`;
    }
    if (table === "questions") {
        const tagsStr = Array.isArray(record.tags) ? record.tags.join(", ") : "";
        return `Title: ${record.title || ""}\nCategory: ${record.category || ""}\nContent: ${record.content || ""}\nTags: ${tagsStr}`;
    }
    if (table === "dictionary_terms") {
        return `Term: ${record.term || ""}\nCategory: ${record.category || ""}\nDefinition: ${record.definition || ""}`;
    }
    if (table === "quizzes") {
        return `Quiz Title: ${record.title || ""}\nDescription: ${record.description || ""}`;
    }
    return "";
}

function getCanonicalPath(table: string, record: SearchSyncRecord): string | null {
    const tableSingular = getTableSingular(table);
    const recordId = record.id?.toString();
    const slug = record.slug || "";
    const category = record.category || "";
    const term = record.term || "";

    if (tableSingular === "article") {
        const slugOrId = slug || recordId;
        if (!slugOrId) return null;
        return `/${category === "Deney" ? "deney" : "makale"}/${slugOrId}`;
    }

    if (tableSingular === "question" && recordId) return `/forum/${recordId}`;
    if (tableSingular === "dictionary" && term) return `/sozluk/${slugify(term)}`;
    if (tableSingular === "quiz" && slug) return `/testler/${slug}`;

    return null;
}

// Helper to check if a record is active/published and should be indexed
function isRecordIndexable(table: string, record: SearchSyncRecord | null | undefined): boolean {
    if (!record) return false;
    if (table === "articles") {
        return record.status === "published" || record.published === true;
    }
    if (table === "questions") {
        return record.status === "published";
    }
    return true; // Dictionary terms and quizzes are indexable by default
}

export async function POST(req: Request) {
    // 1. Rate limiting check to prevent webhook spam / DDoS (60 requests per minute)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limitResult = await rateLimiter.limit(`webhook:search-sync:${ip}`, 60, 60);

    if (!limitResult.success) {
        return NextResponse.json({ error: "Too many webhook requests" }, { status: 429 });
    }

    try {
        // 2. Secret authentication check
        const authHeader = req.headers.get("Authorization");
        const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

        if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
            return NextResponse.json({ error: "Unauthorized", detail: "Secret mismatch" }, { status: 401 });
        }

        const payload = await req.json() as SearchSyncPayload;
        const { type, table, record, old_record } = payload;

        if (!table) {
            return NextResponse.json({ error: "Invalid payload: missing table" }, { status: 400 });
        }

        const tableSingular = getTableSingular(table);
        const supabase = createAdminClient();

        // 3. Handle DELETE operation
        if (type === "DELETE") {
            const oldId = old_record?.id ?? record?.id;
            if (!oldId) {
                return NextResponse.json({ error: "Missing record ID in DELETE payload" }, { status: 400 });
            }

            const { error: deleteError } = await supabase
                .from("documents")
                .delete()
                .filter("metadata->>source_id", "eq", oldId.toString())
                .filter("metadata->>source_type", "eq", tableSingular);

            if (deleteError) {
                console.error(`[Search-Sync DELETE] DB Error for ${tableSingular} ${oldId}:`, deleteError);
                return NextResponse.json({ error: "Database delete failed", details: deleteError }, { status: 500 });
            }

            return NextResponse.json({ message: "Document deleted successfully", source_type: tableSingular, source_id: oldId });
        }

        // 4. Handle INSERT and UPDATE operations
        if (type === "INSERT" || type === "UPDATE") {
            const recordId = record?.id;
            if (!recordId) {
                return NextResponse.json({ error: "Missing record ID in payload" }, { status: 400 });
            }

            const shouldIndex = isRecordIndexable(table, record);

            // If it shouldn't be indexed (e.g. drafted article, soft-deleted question), remove it from search
            if (!shouldIndex) {
                const { error: removeError } = await supabase
                    .from("documents")
                    .delete()
                    .filter("metadata->>source_id", "eq", recordId.toString())
                    .filter("metadata->>source_type", "eq", tableSingular);

                if (removeError) {
                    console.error(`[Search-Sync REMOVE] DB Error for non-indexable ${tableSingular} ${recordId}:`, removeError);
                    return NextResponse.json({ error: "Database remove failed", details: removeError }, { status: 500 });
                }

                return NextResponse.json({ message: "Document removed due to status change", source_type: tableSingular, source_id: recordId });
            }

            // --- ASYNC BACKGROUND EXECUTION VIA QSTASH ---
            const textContent = buildSearchableText(table, record);
            const metadata = {
                source_id: recordId.toString(),
                source_type: tableSingular,
                title: record.title || record.term || "FizikHub İçeriği",
                slug: record.slug || (record.term ? slugify(record.term) : ""),
                canonical_path: getCanonicalPath(table, record),
                cover_image: record.cover_url || record.image_url || null,
            };

            try {
                const { Client } = await import("@upstash/qstash");
                const qstash = new Client({ token: process.env.QSTASH_TOKEN || "" });
                
                // Ensure NEXT_PUBLIC_APP_URL does not end with a slash
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://fizikhub.com";
                const qstashUrl = `${baseUrl}/api/qstash/search-sync`;

                await qstash.publishJSON({
                    url: qstashUrl,
                    body: {
                        textContent,
                        tableSingular,
                        recordId,
                        metadata
                    },
                    retries: 3,
                });
                console.log(`[Search-Sync] Queued QStash job for ${tableSingular} ${recordId}`);
            } catch (qErr) {
                console.error("[Search-Sync] Failed to publish QStash job:", qErr);
                // We don't fail the webhook completely to allow Supabase to consider it delivered,
                // but we log the error.
            }

            // Return immediately without waiting for the embedding to finish
            return NextResponse.json({ 
                message: "Document indexing job queued successfully", 
                source_type: tableSingular, 
                source_id: recordId, 
                action: "queued" 
            });
        }

        return NextResponse.json({ error: "Unsupported operation type" }, { status: 400 });

    } catch (error: unknown) {
        console.error("[Search-Sync API] Webhook Error:", error);
        const detail = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: "Internal server error", detail }, { status: 500 });
    }
}
