"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const coverUrl = formData.get("cover_url") as string;
    const status = formData.get("status") as string || "draft";

    if (!title || !content) {
        return { success: false, error: "Başlık ve içerik gereklidir." };
    }

    // Generate slug from title
    const slug = title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
        .from("articles")
        .insert({
            title,
            content,
            excerpt: excerpt || content.substring(0, 200),
            category,
            cover_url: coverUrl || null,
            slug,
            status,
            author_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Article creation error:", error);
        return { success: false, error: `Hata: ${error.message}` };
    }

    revalidatePath("/profil");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/articles");

    return { success: true, article: data };
}

export async function updateArticle(articleId: number, formData: FormData) {
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
