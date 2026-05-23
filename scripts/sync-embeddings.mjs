import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Environment Variables from .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;

if (!supabaseUrl || !serviceKey || !geminiKey) {
    console.error("❌ Error: Missing required environment variables in .env.local!");
    console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY are configured.");
    process.exit(1);
}

// 2. Initialize Clients
const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});
const genAI = new GoogleGenerativeAI(geminiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

// Helper to delay executions (avoid Gemini Rate Limits)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Turkish-friendly slugify helper
function slugify(text) {
    const maps = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    let str = text.toString();
    for (const key in maps) {
        str = str.replaceAll(key, maps[key]);
    }
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Helper to generate embedding via Gemini with exponential backoff for 429 rate limits
async function getEmbedding(text, retries = 5, backoffMs = 3000) {
    try {
        const result = await embeddingModel.embedContent({
            content: { parts: [{ text: text }] },
            outputDimensionality: 768
        });
        return result.embedding.values;
    } catch (err) {
        if ((err.message.includes("429") || err.message.includes("quota")) && retries > 0) {
            console.warn(`  ⚠️ Rate limited (429). Retrying in ${backoffMs / 1000}s... (Retries left: ${retries})`);
            await delay(backoffMs);
            return getEmbedding(text, retries - 1, backoffMs * 2);
        }
        console.error(`  ⚠️ Embedding generation failed:`, err.message);
        return null;
    }
}

async function main() {
    console.log("🚀 Starting Fizikhub Semantik Arama İndeksleme (Backfill) Süreci...");

    // ==========================================
    // A. ARTICLE & BLOG INDEXING
    // ==========================================
    console.log("\n📖 [1/4] Makaleler taranıyor...");
    const { data: articles, error: artErr } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, content, category, cover_url, image_url, published, status")
        .or("status.eq.published,published.eq.true");

    if (artErr) {
        console.error("❌ Makaleler çekilemedi:", artErr.message);
    } else {
        console.log(`Found ${articles.length} published articles. Indexing...`);
        for (const item of articles) {
            console.log(` -> Indexing Article: "${item.title}" (ID: ${item.id})`);
            const text = `Title: ${item.title || ""}\nCategory: ${item.category || ""}\nExcerpt: ${item.excerpt || ""}\nContent: ${item.content || ""}`;
            const embedding = await getEmbedding(text);

            if (embedding) {
                const metadata = {
                    source_id: item.id.toString(),
                    source_type: "article",
                    title: item.title,
                    slug: item.slug,
                    canonical_path: `/${item.category === "Deney" ? "deney" : "makale"}/${item.slug || item.id}`,
                    cover_image: item.cover_url || item.image_url || null
                };

                // Upsert checking unique (source_type, source_id)
                const { data: existing } = await supabase
                    .from("documents")
                    .select("id")
                    .filter("metadata->>source_id", "eq", item.id.toString())
                    .filter("metadata->>source_type", "eq", "article")
                    .maybeSingle();

                if (existing) {
                    await supabase.from("documents").update({ content: text, embedding, metadata }).eq("id", existing.id);
                } else {
                    await supabase.from("documents").insert({ content: text, embedding, metadata });
                }
            }
            await delay(250); // respect rate limits
        }
    }

    // ==========================================
    // B. QUESTIONS (FORUM) INDEXING
    // ==========================================
    console.log("\n💬 [2/4] Forum soruları taranıyor...");
    const { data: questions, error: qErr } = await supabase
        .from("questions")
        .select("id, title, content, category, tags")
        .neq("status", "deleted");

    if (qErr) {
        console.error("❌ Sorular çekilemedi:", qErr.message);
    } else {
        console.log(`Found ${questions.length} active questions. Indexing...`);
        for (const item of questions) {
            console.log(` -> Indexing Question: "${item.title}" (ID: ${item.id})`);
            const tagsStr = Array.isArray(item.tags) ? item.tags.join(", ") : "";
            const text = `Title: ${item.title || ""}\nCategory: ${item.category || ""}\nContent: ${item.content || ""}\nTags: ${tagsStr}`;
            const embedding = await getEmbedding(text);

            if (embedding) {
                const metadata = {
                    source_id: item.id.toString(),
                    source_type: "question",
                    title: item.title,
                    slug: "",
                    canonical_path: `/forum/${item.id}`,
                    cover_image: null
                };

                const { data: existing } = await supabase
                    .from("documents")
                    .select("id")
                    .filter("metadata->>source_id", "eq", item.id.toString())
                    .filter("metadata->>source_type", "eq", "question")
                    .maybeSingle();

                if (existing) {
                    await supabase.from("documents").update({ content: text, embedding, metadata }).eq("id", existing.id);
                } else {
                    await supabase.from("documents").insert({ content: text, embedding, metadata });
                }
            }
            await delay(250);
        }
    }

    // ==========================================
    // C. DICTIONARY TERMS INDEXING
    // ==========================================
    console.log("\n📚 [3/4] Sözlük terimleri taranıyor...");
    const { data: terms, error: termErr } = await supabase
        .from("dictionary_terms")
        .select("id, term, definition, category");

    if (termErr) {
        console.error("❌ Sözlük terimleri çekilemedi:", termErr.message);
    } else {
        console.log(`Found ${terms.length} terms. Indexing...`);
        for (const item of terms) {
            console.log(` -> Indexing Term: "${item.term}" (ID: ${item.id})`);
            const text = `Term: ${item.term || ""}\nCategory: ${item.category || ""}\nDefinition: ${item.definition || ""}`;
            const embedding = await getEmbedding(text);

            if (embedding) {
                const metadata = {
                    source_id: item.id.toString(),
                    source_type: "dictionary",
                    title: item.term,
                    slug: slugify(item.term),
                    canonical_path: `/sozluk/${slugify(item.term)}`,
                    cover_image: null
                };

                const { data: existing } = await supabase
                    .from("documents")
                    .select("id")
                    .filter("metadata->>source_id", "eq", item.id.toString())
                    .filter("metadata->>source_type", "eq", "dictionary")
                    .maybeSingle();

                if (existing) {
                    await supabase.from("documents").update({ content: text, embedding, metadata }).eq("id", existing.id);
                } else {
                    await supabase.from("documents").insert({ content: text, embedding, metadata });
                }
            }
            await delay(250);
        }
    }

    // ==========================================
    // D. QUIZZES INDEXING
    // ==========================================
    console.log("\n✏️ [4/4] Testler (Quizzes) taranıyor...");
    const { data: quizzes, error: quizErr } = await supabase
        .from("quizzes")
        .select("id, title, slug, description");

    if (quizErr) {
        console.error("❌ Testler çekilemedi:", quizErr.message);
    } else {
        console.log(`Found ${quizzes.length} quizzes. Indexing...`);
        for (const item of quizzes) {
            console.log(` -> Indexing Quiz: "${item.title}" (ID: ${item.id})`);
            const text = `Quiz Title: ${item.title || ""}\nDescription: ${item.description || ""}`;
            const embedding = await getEmbedding(text);

            if (embedding) {
                const metadata = {
                    source_id: item.id.toString(),
                    source_type: "quiz",
                    title: item.title,
                    slug: item.slug,
                    canonical_path: `/testler/${item.slug}`,
                    cover_image: null
                };

                const { data: existing } = await supabase
                    .from("documents")
                    .select("id")
                    .filter("metadata->>source_id", "eq", item.id.toString())
                    .filter("metadata->>source_type", "eq", "quiz")
                    .maybeSingle();

                if (existing) {
                    await supabase.from("documents").update({ content: text, embedding, metadata }).eq("id", existing.id);
                } else {
                    await supabase.from("documents").insert({ content: text, embedding, metadata });
                }
            }
            await delay(250);
        }
    }

    console.log("\n✅ Fizikhub Semantik Arama İndeksleme İşlemi Başarıyla Tamamlandı!");
}

main().catch(err => {
    console.error("❌ Backfill execution failed:", err);
    process.exit(1);
});
