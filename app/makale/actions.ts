"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function toggleArticleLike(articleId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if like exists
    const { data: existingLike } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('article_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) return { success: false, error: error.message };
    } else {
        // Like
        const { error } = await supabase
            .from('article_likes')
            .insert({ article_id: articleId, user_id: user.id });

        if (error) return { success: false, error: error.message };

        // Potential: Add notification here if we had the author_id ready
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/[slug]`); // We'll rely on global revalidation or targeted
    return { success: true };
}

export async function toggleArticleBookmark(articleId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if bookmark exists
    const { data: existingBookmark } = await supabase
        .from('article_bookmarks')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .single();

    if (existingBookmark) {
        // Remove bookmark
        const { error } = await supabase
            .from('article_bookmarks')
            .delete()
            .eq('id', existingBookmark.id);

        if (error) return { success: false, error: error.message };
    } else {
        // Add bookmark
        const { error } = await supabase
            .from('article_bookmarks')
            .insert({ article_id: articleId, user_id: user.id });

        if (error) return { success: false, error: error.message };
    }

    revalidatePath('/blog');
    return { success: true };
}
