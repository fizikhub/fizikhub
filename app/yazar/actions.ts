"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reviewArticleWithAI } from "@/lib/ai-review";
import { getAuthorizedProfile } from "@/lib/auth-helpers";


// Helper: Save references for an article
async function saveReferences(supabase: any, articleId: number, referencesJson: string) {
    try {
        const references = JSON.parse(referencesJson || "[]");
        if (!Array.isArray(references) || references.length === 0) return;

        // Delete existing references
        await supabase.from("article_references").delete().eq("article_id", articleId);

        // Insert new references
        const refsToInsert = references.map((ref: any, index: number) => ({
            article_id: articleId,
            url: ref.url || null,
            title: ref.title || "Başlıksız kaynak",
            authors: ref.authors || null,
            publisher: ref.publisher || null,
            year: ref.year || null,
            doi: ref.doi || null,
            order_index: index,
        }));

        await supabase.from("article_references").insert(refsToInsert);
    } catch (e) {
        console.error("Error saving references:", e);
    }
}

// Helper: Trigger AI review (fire-and-forget)
async function triggerAIReview(supabase: any, articleId: number, title: string, content: string, referencesJson: string) {
    try {
        const references = JSON.parse(referencesJson || "[]");
        const result = await reviewArticleWithAI(title, content, references);
        
        if (result) {
            // Delete existing AI review for this article
            await supabase.from("article_ai_reviews").delete().eq("article_id", articleId);
            
            // Insert new review
            await supabase.from("article_ai_reviews").insert({
                article_id: articleId,
                overall_score: result.overall_score,
                content_accuracy: result.content_accuracy,
                grammar_check: result.grammar_check,
                source_reliability: result.source_reliability,
                source_content_match: result.source_content_match,
                suggestions: result.suggestions,
                raw_response: JSON.stringify(result),
                model_used: "gemini-2.0-flash-lite",
            });
        }
    } catch (e) {
        console.error("Error triggering AI review:", e);
    }
}

export async function createArticle(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Oturum açmanız gerekiyor." };
    }

    // Check if user is a writer using optimized helper
    const profile = await getAuthorizedProfile(user.id);

    if (!profile?.is_writer && profile?.role !== 'author' && profile?.role !== 'admin') {
        return { success: false, error: "Yazar yetkiniz yok." };
    }


    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("image_url") as string;
    const referencesJson = formData.get("references") as string;

    if (!title || !content || !category) {
        return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    // Create slug from title
    const slug = title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

    const { data: insertedArticle, error } = await supabase.from("articles").insert({
        title,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        excerpt,
        content,
        category,
        image_url: imageUrl,
        author_id: user.id,
        status: "pending",
        published: false
    }).select("id").single();

    if (error || !insertedArticle) {
        console.error("Error creating article:", error);
        return { success: false, error: "Makale oluşturulurken bir hata oluştu." };
    }

    // Save references
    await saveReferences(supabase, insertedArticle.id, referencesJson);

    // Trigger AI review (fire-and-forget — don't block the user)
    triggerAIReview(supabase, insertedArticle.id, title, content, referencesJson).catch(console.error);

    revalidatePath("/yazar-paneli");
    revalidatePath("/yazar");
    revalidatePath("/kesfet");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
}

export async function updateArticle(articleId: number, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Oturum açmanız gerekiyor." };
    }

    // Check if user is a writer using optimized helper
    const profile = await getAuthorizedProfile(user.id);

    if (!profile?.is_writer && profile?.role !== 'author' && profile?.role !== 'admin') {
        return { success: false, error: "Yazar yetkiniz yok." };
    }


    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("image_url") as string;
    const referencesJson = formData.get("references") as string;

    if (!title || !content || !category) {
        return { success: false, error: "Lütfen zorunlu alanları doldurun." };
    }

    const { error } = await supabase
        .from("articles")
        .update({
            title,
            excerpt,
            content,
            category,
            image_url: imageUrl,
            status: "pending", // Re-submit for approval on update
            published: false
        })
        .eq("id", articleId)
        .eq("author_id", user.id);

    if (error) {
        console.error("Error updating article:", error);
        return { success: false, error: "Makale güncellenirken bir hata oluştu." };
    }

    // Save references
    await saveReferences(supabase, articleId, referencesJson);

    // Trigger AI review (fire-and-forget)
    triggerAIReview(supabase, articleId, title, content, referencesJson).catch(console.error);

    revalidatePath("/yazar-paneli");
    revalidatePath("/yazar");
    revalidatePath(`/yazar/${articleId}`);
    revalidatePath("/kesfet");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
}

export async function uploadArticleImage(file: File | Blob) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Oturum açmanız gerekiyor." };
    }

    // Handle both File and Blob (browser-image-compression returns Blob)
    let fileName: string;
    if (file instanceof File && file.name) {
        const fileExt = file.name.split(".").pop() || "webp";
        fileName = `${user.id}/${Date.now()}.${fileExt}`;
    } else {
        // Blob case - default to webp since we compress to webp
        fileName = `${user.id}/${Date.now()}.webp`;
    }



    const { error: uploadError, data } = await supabase.storage
        .from("article-images")
        .upload(fileName, file, {
            contentType: file.type || "image/webp",
            cacheControl: "3600",
            upsert: false
        });

    if (uploadError) {
        console.error("[Upload] Error:", uploadError);
        return { success: false, error: `Resim yüklenirken hata: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);


    return { success: true, url: publicUrl };
}
