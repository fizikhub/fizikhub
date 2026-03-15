"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Sadece admin (baranbozkurt), is_writer=true olan kullanıcılar veya 'editor' rolu olanlar erisebilir
const isAuthorAdmin = async (userId: string) => {
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from("profiles")
        .select("username, role, is_writer")
        .eq("id", userId)
        .single();
    
    return (
        profile?.username === "baranbozkurt" || 
        profile?.role === "admin" || 
        profile?.role === "editor" || 
        profile?.is_writer === true
    );
};

// İncelenmeyi bekleyen makaleleri getir (Onaylayanlarin profilleriyle birlikte)
export async function getPendingArticles() {
    const supabase = await createClient();
    
    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Yetkisiz erişim" };
    
    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { error: "Bu sayfaya erişim yetkiniz yok" };

    try {
        // İlgili makaleleri ve kimlerin onayladigini getir
        // published IS NOT TRUE (false veya null) ve status != 'draft' olanları getir
        const { data: articles, error } = await supabase
            .from("articles")
            .select(`
                id,
                title,
                slug,
                excerpt,
                created_at,
                published,
                author_id,
                author:profiles!author_id(full_name, avatar_url, username),
                article_approvals(user_id, approver:profiles!user_id(avatar_url, full_name, username))
            `)
            .or("published.eq.false,published.is.null")
            .neq("status", "draft") // Taslak olmayan ama henüz yayınlanmamış makaleler
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Bekleyen makaleler getirilirken hata:", error);
            return { error: error.message };
        }

        const formattedArticles = articles?.map(article => {
            const approvalsList = article.article_approvals || [];
            const approvalCount = approvalsList.length;
            const hasApproved = approvalsList.some(a => a.user_id === user.id);
            const approvers = approvalsList.map(a => a.approver); // Kimlerin onayladigini ayikla

            return {
                ...article,
                approvalCount,
                hasApproved,
                approvers
            };
        });

        return { articles: formattedArticles };

    } catch (err: any) {
        return { error: err.message };
    }
}

// Makaleye onay ver ve gerekiyorsa yayınla
export async function approveArticle(articleId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Yetkisiz erişim" };

    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { success: false, error: "Yetkiniz yok" };

    try {
        // 1. Onayı ekle
        const { error: insertError } = await supabase
            .from("article_approvals")
            .insert({
                article_id: articleId,
                user_id: user.id
            });
            
        if (insertError) {
             if (insertError.code !== '23505') { // Benzersiz kısıtlama ihlali
                  return { success: false, error: insertError.message };
             }
        }

        // 2. Toplam onayı kontrol et
        const { count, error: countError } = await supabase
            .from("article_approvals")
            .select('*', { count: 'exact', head: true })
            .eq("article_id", articleId);

        if (countError) {
             return { success: false, error: countError.message };
        }

        // 3. Eğer 4 veya daha fazla onay varsa makaleyi yayınla
        if (count && count >= 4) {
            const { error: updateError } = await supabase
                .from("articles")
                .update({ published: true, status: 'published' }) 
                .eq("id", articleId);
                
            if (updateError) {
                 return { success: false, error: "Makale yayınlanırken bir hata oluştu: " + updateError.message };
            }
        }

        revalidatePath("/yazar-paneli");
        return { success: true, count };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Makale onayını geri çek
export async function revokeApproval(articleId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Yetkisiz erişim" };

    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { success: false, error: "Yetkiniz yok" };

    try {
        const { error: deleteError } = await supabase
            .from("article_approvals")
            .delete()
            .match({
                article_id: articleId,
                user_id: user.id
            });

        if (deleteError) {
            return { success: false, error: deleteError.message };
        }

        revalidatePath("/yazar-paneli");
        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
