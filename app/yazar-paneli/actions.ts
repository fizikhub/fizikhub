"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { reviewArticleWithAI } from "@/lib/ai-review";
import { cache } from "react";
import { getAuthorizedProfile } from "@/lib/auth-helpers";
import { isAdminEmail } from "@/lib/admin-shared";



// Sadece admin (baranbozkurt), is_writer=true olan kullanıcılar veya 'editor' rolu olanlar erisebilir
const isAuthorAdmin = async (userId: string) => {
    const profile = await getAuthorizedProfile(userId);
    return profile?.isAuthorized || false;
};



// İncelenmeyi bekleyen makaleleri getir
export async function getPendingArticles() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Yetkisiz erişim" };
    
    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { error: "Bu sayfaya erişim yetkiniz yok" };

    try {
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
                article_approvals(user_id, approver:profiles!user_id(avatar_url, full_name, username)),
                article_ai_reviews(overall_score)
            `)
            .or("published.eq.false,published.is.null")
            .neq("status", "draft")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Bekleyen makaleler getirilirken hata:", error);
            return { error: error.message };
        }

        const formattedArticles = articles?.map(article => {
            const approvalsList = article.article_approvals || [];
            const approvalCount = approvalsList.length;
            const hasApproved = approvalsList.some(a => a.user_id === user.id);
            const approvers = approvalsList.map(a => a.approver);
            const aiReview = (article as any).article_ai_reviews?.[0] || null;

            return {
                ...article,
                approvalCount,
                hasApproved,
                approvers,
                aiScore: aiReview?.overall_score ?? null,
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
        const { error: insertError } = await supabase
            .from("article_approvals")
            .insert({ article_id: articleId, user_id: user.id });
            
        if (insertError) {
             if (insertError.code !== '23505') {
                  return { success: false, error: insertError.message };
             }
        }

        const { count, error: countError } = await supabase
            .from("article_approvals")
            .select('*', { count: 'exact', head: true })
            .eq("article_id", articleId);

        if (countError) return { success: false, error: countError.message };

        // Admin profil kontrolü
        const { data: adminProfile } = await supabase
            .from("profiles")
            .select("role, username")
            .eq("id", user.id)
            .single();

        const isStrictAdmin = adminProfile?.role === "admin" || isAdminEmail(user.email);

        // Admin onaylarsa direkt yayına al, diğer yazarlar için 4 onay gerekli
        if (isStrictAdmin || (count && count >= 4)) {
            await supabase.from("articles")
                .update({ published: true, status: 'published' }) 
                .eq("id", articleId);
        }

        revalidatePath("/yazar-paneli");
        revalidatePath("/makale");
        revalidatePath("/kesfet");
        revalidatePath("/makale");
        revalidatePath("/");
        // @ts-ignore - Next.js 16 type definitions issue
        revalidateTag('articles');
        // @ts-ignore
        revalidateTag('feed');
        return { success: true, count, published: isStrictAdmin || (count && count >= 4) };

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
            .match({ article_id: articleId, user_id: user.id });

        if (deleteError) return { success: false, error: deleteError.message };

        revalidatePath("/yazar-paneli");
        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ==================== Review Detail Actions ====================

// Makale detayını getir
export async function getArticleDetail(articleId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Yetkisiz erişim" };
    
    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { error: "Bu sayfaya erişim yetkiniz yok" };

    try {
        const { data: article, error: articleError } = await supabase
            .from("articles")
            .select(`
                id, title, slug, excerpt, content, category, created_at, published, status,
                author:profiles!author_id(id, full_name, avatar_url, username)
            `)
            .eq("id", articleId)
            .single();

        if (articleError || !article) return { error: articleError?.message || "Makale bulunamadı" };

        const { data: references } = await supabase
            .from("article_references")
            .select("*")
            .eq("article_id", articleId)
            .order("order_index", { ascending: true });

        const { data: aiReview } = await supabase
            .from("article_ai_reviews")
            .select("*")
            .eq("article_id", articleId)
            .single();

        const { data: notes } = await supabase
            .from("article_notes")
            .select(`*, user:profiles!user_id(full_name, avatar_url, username)`)
            .eq("article_id", articleId)
            .order("created_at", { ascending: false });

        const { data: approvals } = await supabase
            .from("article_approvals")
            .select(`user_id, approver:profiles!user_id(full_name, avatar_url, username)`)
            .eq("article_id", articleId);

        const hasApproved = approvals?.some(a => a.user_id === user.id) || false;
        
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, username")
            .eq("id", user.id)
            .single();
            
        const isAdminUser = profile?.role === "admin" || isAdminEmail(user.email);

        return {
            article,
            references: references || [],
            aiReview,
            notes: notes || [],
            approvals: approvals || [],
            hasApproved,
            currentUserId: user.id,
            isAdmin: isAdminUser,
        };

    } catch (err: any) {
        return { error: err.message };
    }
}

// Not ekle
export async function addArticleNote(articleId: number, content: string, type: "correction" | "suggestion" | "question") {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Yetkisiz erişim" };

    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { success: false, error: "Yetkiniz yok" };

    try {
        const { error } = await supabase
            .from("article_notes")
            .insert({ article_id: articleId, user_id: user.id, content, type });

        if (error) return { success: false, error: error.message };

        revalidatePath(`/yazar-paneli/makale/${articleId}`);
        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Notu çözüldü olarak işaretle
export async function resolveNote(noteId: string) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Yetkisiz erişim" };

    try {
        const { error } = await supabase
            .from("article_notes")
            .update({ resolved: true })
            .eq("id", noteId);

        if (error) return { success: false, error: error.message };
        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Manuel AI inceleme tetikle
export async function triggerManualAIReview(articleId: number) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Yetkisiz erişim" };

    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { success: false, error: "Yetkiniz yok" };

    try {
        const { data: article } = await supabase
            .from("articles")
            .select("title, content")
            .eq("id", articleId)
            .single();

        if (!article) return { success: false, error: "Makale bulunamadı" };

        const { data: refs } = await supabase
            .from("article_references")
            .select("url, title, authors, publisher, year, doi")
            .eq("article_id", articleId)
            .order("order_index");

        const result = await reviewArticleWithAI(article.title, article.content, refs || []);
        if (!result) return { success: false, error: "AI inceleme başarısız oldu" };

        await supabase.from("article_ai_reviews").delete().eq("article_id", articleId);
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

        revalidatePath(`/yazar-paneli/makale/${articleId}`);
        revalidatePath("/yazar-paneli");
        return { success: true };

    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// Link sağlık kontrolü (Link Health Check)
export async function checkLinkHealth(url: string) {
    if (!url || !url.startsWith("http")) {
        return { ok: false, error: "Geçersiz URL" };
    }

    try {
        // First try a HEAD request (faster, doesn't download body)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        let response;
        try {
            response = await fetch(url, { 
                method: "HEAD", 
                signal: controller.signal,
                headers: {
                    "User-Agent": "FizikHubBot/1.0 (LinkHealthChecker)"
                },
                cache: 'no-store'
            });
        } catch (headError) {
            // Some servers block HEAD requests, fallback to GET (with a small limit)
            const getController = new AbortController();
            const getTimeoutId = setTimeout(() => getController.abort(), 10000);
            
            response = await fetch(url, { 
                method: "GET", 
                signal: getController.signal,
                headers: {
                    "User-Agent": "FizikHubBot/1.0 (LinkHealthChecker)"
                },
                cache: 'no-store'
                // Note: We can't really limit response body easily with fetch in server actions 
                // without stream readers, but we only care about the status code here.
            });
            clearTimeout(getTimeoutId);
        }

        clearTimeout(timeoutId);

        return { 
            ok: response.ok, 
            status: response.status,
            statusText: response.statusText
        };
    } catch (err: any) {
        console.error(`Link check failed for ${url}:`, err.message);
        return { 
            ok: false, 
            error: err.name === 'AbortError' ? "Zaman aşımı (Timeout)" : "Erişim hatası",
            errorCode: err.name
        };
    }
}

// Yazarın sadece kendi makalelerini getir
export async function getMyArticles() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Yetkisiz erişim" };
    
    // Yazar veya admin olmak zorunda
    const isAdmin = await isAuthorAdmin(user.id);
    if (!isAdmin) return { error: "Bu sayfaya erişim yetkiniz yok" };

    try {
        const { data: articles, error } = await supabase
            .from("articles")
            .select(`
                id,
                title,
                slug,
                excerpt,
                created_at,
                published,
                status,
                author_id,
                author:profiles!author_id(full_name, avatar_url, username),
                article_approvals(user_id, approver:profiles!user_id(avatar_url, full_name, username)),
                article_ai_reviews(overall_score)
            `)
            .eq("author_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Yazarın makaleleri getirilirken hata:", error);
            return { error: error.message };
        }

        const formattedArticles = articles?.map(article => {
            const approvalsList = article.article_approvals || [];
            const approvalCount = approvalsList.length;
            const approvers = approvalsList.map(a => a.approver);
            const aiReview = (article as any).article_ai_reviews?.[0] || null;

            return {
                ...article,
                approvalCount,
                approvers,
                aiScore: aiReview?.overall_score ?? null,
            };
        });

        return { articles: formattedArticles };

    } catch (err: any) {
        return { error: err.message };
    }
}
