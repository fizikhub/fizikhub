"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
    try {
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: "Giriş yapmalısınız." };
        }

        // 2. Data Extraction
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const excerpt = formData.get("excerpt") as string;
        const category = formData.get("category") as string;
        const coverUrl = formData.get("cover_url") as string;
        const status = formData.get("status") as string || "draft"; // Admin approval if 'pending'

        if (!title || !content) {
            return { success: false, error: "Başlık ve içerik gereklidir." };
        }

        // 3. Robust Slug Generation (Title + Random Suffix)
        const baseSlug = title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Add random suffix to guarantee uniqueness (timestamp + random chars)
        const suffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        const slug = `${baseSlug}-${suffix}`;

        // 4. Database Insert
        const { data, error } = await supabase.from("articles").insert({
            title,
            content,
            excerpt: excerpt || content.substring(0, 200),
            category: category || "Genel",
            cover_url: coverUrl || null,
            slug,
            status,
            author_id: user.id,
        }).select().single();

        if (error) {
            return { success: false, error: "Makale oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." };
        }

        // 5. Success
        return { success: true, articleId: data.id, slug: data.slug };

    } catch (error: any) {
        console.error("Unexpected error in createArticle:", error);
        return { success: false, error: "Beklenmeyen sunucu hatası" };
    }
}

export async function updateArticle(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const articleId = formData.get("id");
    if (!articleId) {
        return { success: false, error: "Makale ID eksik." };
    }

    // Verify ownership
    const { data: article } = await supabase
        .from("articles")
        .select("author_id")
        .eq("id", articleId)
        .single();

    if (!article || article.author_id !== user.id) {
        return { success: false, error: "Bu makaleyi düzenleme yetkiniz yok." };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const coverUrl = formData.get("cover_url") as string;
    const status = formData.get("status") as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (excerpt) updates.excerpt = excerpt;
    if (category) updates.category = category;
    if (coverUrl !== undefined) updates.cover_url = coverUrl || null;
    if (status) updates.status = status;

    const { error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", articleId);

    if (error) {
        console.error("Article update error:", error);
        return { success: false, error: "Makale güncellenirken hata oluştu." };
    }

    revalidatePath("/profil");
    revalidatePath("/blog");

    return { success: true };
}

export async function deleteArticle(articleId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Verify ownership
    const { data: article } = await supabase
        .from("articles")
        .select("author_id")
        .eq("id", articleId)
        .single();

    if (!article || article.author_id !== user.id) {
        return { success: false, error: "Bu makaleyi silme yetkiniz yok." };
    }

    const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

    if (error) {
        console.error("Article deletion error:", error);
        return { success: false, error: "Makale silinirken hata oluştu." };
    }

    revalidatePath("/profil");
    revalidatePath("/blog");

    return { success: true };
}
