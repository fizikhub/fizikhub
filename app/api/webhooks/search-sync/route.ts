import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateEmbedding } from "@/lib/gemini";
import { slugify } from "@/lib/slug";
import { rateLimiter } from "@/lib/upstash";

// Helper to determine singular resource name
function getTableSingular(table: string): string {
    if (table === "articles") return "article";
    if (table === "questions") return "question";
    if (table === "dictionary_terms") return "dictionary";
    if (table === "quizzes") return "quiz";
    return table;
}

// Clean and prepare searchable text representation for embedding
function buildSearchableText(table: string, record: any): string {
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

function getCanonicalPath(table: string, record: Record<string, unknown>): string | null {
    const tableSingular = getTableSingular(table);
    const recordId = record.id?.toString();
    const slug = typeof record.slug === "string" ? record.slug : "";
    const category = typeof record.category === "string" ? record.category : "";
    const term = typeof record.term === "string" ? record.term : "";

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
function isRecordIndexable(table: string, record: any): boolean {
    if (!record) return false;
    if (table === "articles") {
        return record.status === "published" || record.published === true;
    }
    if (table === "questions") {
        return record.status !== "deleted";
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

        const payload = await req.json();
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

            // Construct text content and request embedding from Gemini
            const textContent = buildSearchableText(table, record);
            const embedding = await generateEmbedding(textContent);

            if (!embedding) {
                console.error(`[Search-Sync] Failed to generate embedding for ${tableSingular} ${recordId}`);
                return NextResponse.json({ error: "Embedding generation failed" }, { status: 500 });
            }

            // Construct standard metadata schema expected by the RPC & search Global Action
            const metadata = {
                source_id: recordId.toString(),
                source_type: tableSingular,
                title: record.title || record.term || "FizikHub İçeriği",
                slug: record.slug || (record.term ? slugify(record.term) : ""),
                canonical_path: getCanonicalPath(table, record as Record<string, unknown>),
                cover_image: record.cover_url || record.image_url || null,
            };

            // Query if document already exists
            const { data: existingDoc, error: queryError } = await supabase
                .from("documents")
                .select("id")
                .filter("metadata->>source_id", "eq", recordId.toString())
                .filter("metadata->>source_type", "eq", tableSingular)
                .maybeSingle();

            if (queryError) {
                console.error(`[Search-Sync] Error querying existing document:`, queryError);
            }

            let syncError = null;

            if (existingDoc?.id) {
                // Update existing document
                const { error } = await supabase
                    .from("documents")
                    .update({
                        content: textContent,
                        embedding: embedding,
                        metadata: metadata,
                    })
                    .eq("id", existingDoc.id);
                syncError = error;
            } else {
                // Insert new document
                const { error } = await supabase
                    .from("documents")
                    .insert({
                        content: textContent,
                        embedding: embedding,
                        metadata: metadata,
                    });
                syncError = error;
            }

            if (syncError) {
                console.error(`[Search-Sync UPSERT] DB Error for ${tableSingular} ${recordId}:`, syncError);
                return NextResponse.json({ error: "Database upsert failed", details: syncError }, { status: 500 });
            }

            return NextResponse.json({ 
                message: "Document indexed successfully", 
                source_type: tableSingular, 
                source_id: recordId, 
                action: existingDoc?.id ? "updated" : "inserted" 
            });
        }

        return NextResponse.json({ error: "Unsupported operation type" }, { status: 400 });

    } catch (error: any) {
        console.error("[Search-Sync API] Webhook Error:", error);
        return NextResponse.json({ error: "Internal server error", detail: error?.message }, { status: 500 });
    }
}
