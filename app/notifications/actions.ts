"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {

            return [];
        }

        // 1. Fetch notifications without the join first
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('recipient_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Notifications] Error fetching notifications:', error);
            }
            return [];
        }

        if (!notifications || notifications.length === 0) {
            return [];
        }

        // 2. Get unique actor IDs
        const actorIds = [...new Set(notifications.map(n => n.actor_id))];

        // 3. Fetch profiles for these actors
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', actorIds);

        if (profilesError && process.env.NODE_ENV === 'development') {
            console.error('[Notifications] Error fetching profiles:', profilesError);
        }

        // 4. Map profiles to notifications
        const notificationsWithActors = notifications.map(notification => {
            const actorProfile = profiles?.find(p => p.id === notification.actor_id);
            return {
                ...notification,
                actor: actorProfile ? {
                    username: actorProfile.username,
                    full_name: actorProfile.full_name,
                    avatar_url: actorProfile.avatar_url
                } : {
                    username: 'Unknown',
                    full_name: 'Unknown User',
                    avatar_url: null
                }
            };
        });


        return notificationsWithActors;

    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('[Notifications] Unexpected error:', error);
        }
        return [];
    }
}

export async function getUnreadCount() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {

            return 0;
        }

        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('is_read', false);

        if (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('[Notifications] Error fetching unread count:', error);
            }
            return 0;
        }


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
    type: 'like' | 'comment' | 'follow' | 'reply' | 'welcome' | 'report' | 'message';
    resourceId?: string;
    resourceType?: 'question' | 'answer' | 'profile' | 'article' | 'conversation';
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
