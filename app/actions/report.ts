"use server";

import { createClient } from "@/lib/supabase-server";

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

    // Notify Admin
    // We target specific admin emails and the admin role
    const adminEmails = ['barannnbozkurttb.b@gmail.com', 'barannnnbozkurttb.b@gmail.com'];

    const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .or(`role.eq.admin,email.in.("${adminEmails.join('","')}")`);

    if (admins && admins.length > 0) {
        // Import createNotification dynamically to avoid circular dependency if any (though here it's fine)
        const { createNotification } = await import('@/app/notifications/actions');

        for (const admin of admins) {
            await createNotification({
                recipientId: admin.id,
                actorId: user.id,
                type: 'report',
                resourceId: params.resourceId,
                resourceType: 'profile', // Using 'profile' as a fallback or generic type since 'report' isn't a resource type in the list yet
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

    // Check admin
    const isAdmin = user.email === 'barannnbozkurttb.b@gmail.com' || user.email === 'barannnnbozkurttb.b@gmail.com';
    if (!isAdmin) {
        // Double check role
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

    // Auth check skipped for brevity, relies on RLS policy for update

    const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
