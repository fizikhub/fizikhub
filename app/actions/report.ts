"use server";

import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { rateLimiter } from "@/lib/upstash";
import { z } from "zod";

const CreateReportSchema = z.object({
    resourceId: z.string().min(1).max(100),
    resourceType: z.enum(['question', 'answer', 'comment', 'user']),
    reason: z.string().min(3, "Sebep en az 3 karakter olmalıdır.").max(200, "Sebep en fazla 200 karakter olabilir."),
    description: z.string().max(2000, "Açıklama en fazla 2000 karakter olabilir.").optional(),
});

type CreateReportParams = z.infer<typeof CreateReportSchema>;

export async function createReport(params: CreateReportParams) {
    // Validate input before any database operation
    const validation = CreateReportSchema.safeParse(params);
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || "Geçersiz veri." };
    }
    const validData = validation.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Bildirimde bulunmak için giriş yapmalısınız." };
    }

    // Edge-based Rate Limiting (DDoS & Spam Protection)
    // Sınır: Kullanıcı başına dakikada maksimum 5 işlem (5 req/min)
    const rateLimit = await rateLimiter.limit(`report:${user.id}`, 5, 60);
    if (!rateLimit.success) {
        return { 
            success: false, 
            error: "Çok fazla şikayet gönderdiniz. Lütfen bir süre bekleyip tekrar deneyin." 
        };
    }

    const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        resource_id: validData.resourceId,
        resource_type: validData.resourceType,
        reason: validData.reason,
        description: validData.description
    });

    if (error) {
        console.error("Create Report Error:", error);
        return { success: false, error: "Şikayet oluşturulurken bir hata oluştu." };
    }

    // Notify admins (using centralized admin check)
    const { data: admins } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('role', 'admin');

    if (admins && admins.length > 0) {
        const { createNotification } = await import('@/app/notifications/actions');

        for (const admin of admins) {
            await createNotification({
                recipientId: admin.id,
                actorId: user.id,
                type: 'report',
                resourceId: validData.resourceId,
                resourceType: 'profile',
                content: `Yeni bir şikayet oluşturdu: ${validData.reason}`
            });
        }
    }

    return { success: true };
}

export async function getReports() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Centralized admin check
    const isAdmin = isAdminEmail(user.email);
    if (!isAdmin) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return [];
    }

    const { data: reports, error } = await supabase
        .from('reports')
        .select(`
            *,
            reporter:profiles!reporter_id(username, full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Get Reports Error:", error);
        return [];
    }

    return reports;
}

export async function updateReportStatus(reportId: number, status: 'pending' | 'resolved' | 'dismissed') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız." };
    }

    // Centralized admin check
    const isAdmin = isAdminEmail(user.email);
    if (!isAdmin) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') {
            return { success: false, error: "Bu işlem için admin yetkisi gereklidir." };
        }
    }

    const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

    if (error) {
        return { success: false, error: "Rapor durumu güncellenirken hata oluştu." };
    }

    return { success: true };
}
