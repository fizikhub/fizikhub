"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createArticle(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Oturum açmanız gerekiyor." };
    }

    // Check if user is a writer
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_writer")
        .eq("id", user.id)
        .single();

    if (!profile?.is_writer) {
        return { success: false, error: "Yazar yetkiniz yok." };
    }

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("image_url") as string;

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

    const { error } = await supabase.from("articles").insert({
        title,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        excerpt,
        content,
        category,
        image_url: imageUrl,
        author_id: user.id,
        status: "pending"
    });

    if (error) {
        console.error("Error creating article:", error);
        return { success: false, error: "Makale oluşturulurken bir hata oluştu." };
    }

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

    // Check if user is a writer
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_writer")
        .eq("id", user.id)
        .single();

    if (!profile?.is_writer) {
        return { success: false, error: "Yazar yetkiniz yok." };
    }

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const imageUrl = formData.get("image_url") as string;

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
            status: "pending" // Re-submit for approval on update
        })
        .eq("id", articleId)
        .eq("author_id", user.id);

    if (error) {
        console.error("Error updating article:", error);
        return { success: false, error: "Makale güncellenirken bir hata oluştu." };
    }

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
