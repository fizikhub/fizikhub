"use server";

import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

interface CreateReportParams {
    resourceId: string;
    resourceType: 'question' | 'answer' | 'comment' | 'user';
    reason: string;
    description?: string;
}

export async function createReport(params: CreateReportParams) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Bildirimde bulunmak için giriş yapmalısınız." };
    }

    const { error } = await supabase.from('reports').insert({
        reporter_id: user.id,
        resource_id: params.resourceId,
        resource_type: params.resourceType,
        reason: params.reason,
        description: params.description
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
                resourceId: params.resourceId,
                resourceType: 'profile',
                content: `Yeni bir şikayet oluşturdu: ${params.reason}`
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
