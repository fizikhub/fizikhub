import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateEmbedding } from "@/lib/gemini";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
    try {
        const payload = await req.json();
        const { textContent, tableSingular, recordId, metadata } = payload;

        if (!textContent || !tableSingular || !recordId || !metadata) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();
        
        const embedding = await generateEmbedding(textContent);
        if (!embedding) {
            console.error(`[QStash Embedding] Failed to generate embedding for ${tableSingular} ${recordId}`);
            // Returning 500 will make QStash retry the job according to its backoff settings.
            return NextResponse.json({ error: "Failed to generate embedding" }, { status: 500 });
        }

        // Query if document already exists
        const { data: existingDoc, error: queryError } = await supabase
            .from("documents")
            .select("id")
            .filter("metadata->>source_id", "eq", recordId.toString())
            .filter("metadata->>source_type", "eq", tableSingular)
            .maybeSingle();

        if (queryError) {
            console.error(`[QStash Embedding] Error querying existing document:`, queryError);
        }

        let syncError = null;
        if (existingDoc?.id) {
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
            console.error(`[QStash Embedding UPSERT] DB Error for ${tableSingular} ${recordId}:`, syncError);
            return NextResponse.json({ error: "Database upsert failed", details: syncError }, { status: 500 });
        }

        console.log(`[QStash Embedding] Successfully processed embedding for ${tableSingular} ${recordId}`);
        return NextResponse.json({ message: "Embedding processed successfully" });
    } catch (error: unknown) {
        console.error("[QStash Embedding] Fatal error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export const POST = verifySignatureAppRouter(handler);
