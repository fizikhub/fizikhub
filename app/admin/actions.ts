"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Helper to verify admin
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { isAdmin: false, error: "Giriş yapmalısınız." };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin' || user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com';

    if (!isAdmin) {
        return { isAdmin: false, error: "Bu işlem için admin yetkisi gereklidir." };
    }

    return { isAdmin: true, supabase };
}

export async function deleteArticle(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('articles').delete().eq('id', id);

    if (error) {
        console.error("Delete Article Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/blog');
    return { success: true };
}

export async function deleteQuestion(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    // Delete answers first (cascade should handle this, but being explicit)
    const { error: answersError } = await adminCheck.supabase!
        .from('answers')
        .delete()
        .eq('question_id', id);

    if (answersError) {
        console.error("Delete Answers Error:", answersError);
        return { success: false, error: answersError.message };
    }

    // Delete question
    const { error } = await adminCheck.supabase!.from('questions').delete().eq('id', id);

    if (error) {
        console.error("Delete Question Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/forum');
    return { success: true };
}

export async function deleteAnswer(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('answers').delete().eq('id', id);

    if (error) {
        console.error("Delete Answer Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/forum');
    return { success: true };
}

export async function deleteDictionaryTerm(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!.from('dictionary_terms').delete().eq('id', id);

    if (error) {
        console.error("Delete Dictionary Term Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/sozluk');
    return { success: true };
}

export async function sendBroadcastNotification(message: string) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const supabase = adminCheck.supabase!;
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch all users
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');

    if (profilesError || !profiles) {
        console.error("Error fetching profiles:", profilesError);
        return { success: false, error: "Kullanıcılar getirilemedi." };
    }

    // 2. Create notifications
    const notifications = profiles.map(p => ({
        recipient_id: p.id,
        actor_id: user!.id,
        type: 'welcome', // Using 'welcome' as generic system type
        content: message,
        is_read: false,
        resource_id: 'admin_broadcast',
        resource_type: 'system'
    }));

    const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

    if (insertError) {
        console.error("Error inserting notifications:", insertError);
        return { success: false, error: "Bildirimler gönderilemedi." };
    }

    revalidatePath('/admin');
    return { success: true, count: notifications.length };
}

export async function approveArticle(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!
        .from('articles')
        .update({
            status: 'published',
            reviewed_at: new Date().toISOString(),
            reviewed_by: (await adminCheck.supabase!.auth.getUser()).data.user?.id
        })
        .eq('id', id);

    if (error) {
        console.error("Approve Article Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    revalidatePath('/kesfet');
    revalidatePath('/'); // Also revalidate home if it shows articles
    return { success: true };
}

export async function rejectArticle(id: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!
        .from('articles')
        .update({ status: 'rejected' })
        .eq('id', id);

    if (error) {
        console.error("Reject Article Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}

export async function toggleWriterStatus(userId: string, isWriter: boolean) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const { error } = await adminCheck.supabase!
        .from('profiles')
        .update({ is_writer: isWriter })
        .eq('id', userId);

    if (error) {
        console.error("Toggle Writer Status Error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
