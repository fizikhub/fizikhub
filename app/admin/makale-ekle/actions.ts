"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: any) {
    const supabase = await createClient();

    // 1. Kullanıcıyı al (Sunucu tarafında)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Oturum açmanız gerekiyor." };
    }

    // 2. Admin kontrolü yap
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: "Bu işlem için yetkiniz yok." };
    }

    // 3. Makaleyi ekle
    const { error } = await supabase
        .from('articles')
        .insert({
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            image_url: formData.image_url,
            author_id: user.id,
            published: true
        });

    if (error) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/blog');
    return { success: true };
}
