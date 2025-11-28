"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('[Notifications] No user logged in');
            return [];
        }

        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                actor:profiles!actor_id(username, full_name, avatar_url)
            `)
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('[Notifications] Error fetching notifications:', error);
            return [];
        }

        console.log('[Notifications] Fetched notifications:', data?.length || 0);
        return data || [];
    } catch (error) {
        console.error('[Notifications] Unexpected error:', error);
        return [];
    }
}

export async function getUnreadCount() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('[Notifications] No user for unread count');
            return 0;
        }

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('is_read', false);

        if (error) {
            console.error('[Notifications] Error fetching unread count:', error);
            return 0;
        }

        console.log('[Notifications] Unread count:', count);
        return count || 0;
    } catch (error) {
        console.error('[Notifications] Unexpected error getting unread count:', error);
        return 0;
    }
}

export async function markAsRead(notificationId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', user.id);

    revalidatePath('/');
}

export async function markAllAsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

    revalidatePath('/');
}

// Internal helper to create notifications
// This should be called from other actions
export async function createNotification({
    recipientId,
    actorId,
    type,
    resourceId,
    resourceType,
    content
}: {
    recipientId: string;
    actorId: string;
    type: 'like' | 'comment' | 'follow' | 'reply' | 'welcome' | 'report';
    resourceId?: string;
    resourceType?: 'question' | 'answer' | 'profile' | 'article';
    content?: string;
}) {
    // Don't notify self
    if (recipientId === actorId) return;

    const supabase = await createClient();

    await supabase.from('notifications').insert({
        recipient_id: recipientId,
        actor_id: actorId,
        type,
        resource_id: resourceId,
        resource_type: resourceType,
        content
    });
}
