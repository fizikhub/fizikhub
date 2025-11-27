"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/app/notifications/actions";

// Toggle like on an article
export async function toggleLike(articleId: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if user already liked
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
            .eq('article_id', articleId)
            .eq('user_id', user.id);

        if (error) {
            return { success: false, error: "Beğeni kaldırılamadı." };
        }

        revalidatePath(`/blog/${articleId}`);
        return { success: true, liked: false };
    } else {
        // Like
        const { error } = await supabase
            .from('article_likes')
            .insert({ article_id: articleId, user_id: user.id });

        if (error) {
            return { success: false, error: "Beğenilemedi." };
        }

        // Notify article author
        // First get article details to find author
        const { data: article } = await supabase
            .from('articles')
            .select('author_id, title, slug') // Assuming slug exists for linking
            .eq('id', articleId)
            .single();

        if (article) {
            await createNotification({
                recipientId: article.author_id,
                actorId: user.id,
                type: 'like',
                resourceId: article.slug || articleId.toString(), // Use slug if available for better links
                resourceType: 'article',
                content: `"${article.title}" makaleni beğendi.`
            });
        }

        revalidatePath(`/blog/${articleId}`);
        return { success: true, liked: true };
    }
}

// Create a comment or reply
export async function createComment(articleId: number, content: string, parentCommentId?: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    if (!content || content.trim().length === 0) {
        return { success: false, error: "Yorum boş olamaz." };
    }

    const { error } = await supabase
        .from('article_comments')
        .insert({
            article_id: articleId,
            user_id: user.id,
            content: content.trim(),
            parent_comment_id: parentCommentId || null
        });

    if (error) {
        console.error("Comment creation error:", error);
        return { success: false, error: "Yorum eklenemedi." };
    }

    // Notify logic
    if (parentCommentId) {
        // Reply: Notify parent comment author
        const { data: parentComment } = await supabase
            .from('article_comments')
            .select('user_id')
            .eq('id', parentCommentId)
            .single();

        // Also need article slug for linking
        const { data: article } = await supabase
            .from('articles')
            .select('slug, title')
            .eq('id', articleId)
            .single();

        if (parentComment && article) {
            await createNotification({
                recipientId: parentComment.user_id,
                actorId: user.id,
                type: 'reply',
                resourceId: article.slug || articleId.toString(),
                resourceType: 'article',
                content: `"${article.title}" makalesindeki yorumuna yanıt verdi.`
            });
        }
    } else {
        // Top level comment: Notify article author
        const { data: article } = await supabase
            .from('articles')
            .select('author_id, title, slug')
            .eq('id', articleId)
            .single();

        if (article) {
            await createNotification({
                recipientId: article.author_id,
                actorId: user.id,
                type: 'comment',
                resourceId: article.slug || articleId.toString(),
                resourceType: 'article',
                content: `"${article.title}" makalene yorum yaptı.`
            });
        }
    }

    revalidatePath(`/blog/${articleId}`);
    return { success: true };
}

// Delete a comment (admin or owner)
export async function deleteComment(commentId: number) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Check if user is admin (explicit check for safety)
    const adminEmails = ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'];
    const isEmailAdmin = adminEmails.includes(user.email?.toLowerCase().trim() || '');

    let isAdmin = isEmailAdmin;
    if (!isAdmin) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    // If admin, use service role to bypass RLS if needed, or just rely on RLS
    // For now, we rely on RLS but the explicit check helps us return better errors

    const { error } = await supabase
        .from('article_comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error("Comment deletion error:", error);
        return { success: false, error: "Yorum silinemedi. Yetkiniz olmayabilir." };
    }

    revalidatePath(`/blog/*`);
    return { success: true };
}
