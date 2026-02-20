"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// ============================================
// TYPES
// ============================================

export interface Message {
    id: number;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    id: string;
    updated_at: string;
    otherUser: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    } | null;
    lastMessage: Message | null;
    unreadCount: number;
}

// ============================================
// ACTIONS
// ============================================

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    if (!content.trim()) {
        return { success: false, error: "Message cannot be empty" };
    }

    // Insert message
    const { data: message, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            is_read: false
        })
        .select()
        .single();

    if (error) {
        console.error("Send message error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/mesajlar');
    return { success: true, message };
}

/**
 * Get all conversations for the current user
 * Optimized to prevent N+1 queries
 */
export async function getConversations(): Promise<Conversation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Get all conversations the user is a part of, 
    // including other participants and their profiles, and the latest messages.
    // Supabase allows us to fetch related data in a single query.
    const { data: participations, error } = await supabase
        .from('conversation_participants')
        .select(`
            conversation_id,
            conversations:conversation_id (
                id,
                updated_at,
                messages:messages (
                    id,
                    conversation_id,
                    sender_id,
                    content,
                    is_read,
                    created_at
                )
            )
        `)
        .eq('user_id', user.id);

    if (error || !participations || participations.length === 0) return [];

    const conversationIds = participations.map(p => p.conversation_id);

    // 2. Get all participants for these conversations to find the "other" user
    const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select(`
            conversation_id,
            user_id,
            profiles:user_id (
                id,
                username,
                full_name,
                avatar_url
            )
        `)
        .in('conversation_id', conversationIds)
        .neq('user_id', user.id);

    const result: Conversation[] = [];

    for (const part of participations) {
        const conv: any = part.conversations;
        if (!conv) continue;

        // Find the other participant's profile
        const otherPart = allParticipants?.find(p => p.conversation_id === conv.id);
        const otherProfile: any = otherPart?.profiles;

        // Get the latest message (sorted by created_at desc in memory since we only grabbed top few or just sort here)
        const messages = conv.messages || [];
        const sortedMessages = [...messages].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

        // Count unread messages (not sent by me)
        const unreadCount = messages.filter((m: any) =>
            m.sender_id !== user.id && !m.is_read
        ).length;

        result.push({
            id: conv.id,
            updated_at: conv.updated_at,
            otherUser: otherProfile || null,
            lastMessage,
            unreadCount
        });
    }

    // Sort by updated_at descending
    return result.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
}

/**
 * Get all messages in a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Verify user is part of conversation
    const { data: participation } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

    if (!participation) return [];

    // Get messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    return messages || [];
}

/**
 * Mark all messages in a conversation as read
 */
export async function markAsRead(conversationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

    revalidatePath('/mesajlar');
}

/**
 * Start a conversation with another user (or get existing one)
 */
export async function startConversation(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();



    if (!user) {
        if (process.env.NODE_ENV === 'development') {
            console.error("User not authenticated");
        }
        return { success: false, error: "Not authenticated" };
    }

    // Use the database function to create or get conversation
    const { data: conversationId, error } = await supabase
        .rpc('create_conversation', { other_user_id: otherUserId });

    if (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Start conversation error:", error);
        }
        return { success: false, error: error.message };
    }

    // Verify participants were created
    const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('*')
        .eq('conversation_id', conversationId);

    revalidatePath('/mesajlar');
    return { success: true, conversationId };
}

/**
 * Delete a message (only sender can delete)
 */
export async function deleteMessage(messageId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Verify ownership
    const { data: message } = await supabase
        .from('messages')
        .select('sender_id, conversation_id')
        .eq('id', messageId)
        .single();

    if (!message || message.sender_id !== user.id) {
        return { success: false, error: "Bu mesajı silme yetkiniz yok" };
    }

    // Delete related notifications (message and like notifications)
    await supabase
        .from('notifications')
        .delete()
        .eq('resource_type', 'message')
        .eq('resource_id', messageId.toString());

    // Delete the message (this will also cascade delete likes)
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

    if (error) {
        console.error("Delete message error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/mesajlar');
    return { success: true };
}

/**
 * Like a message (double-click to like)
 */
export async function likeMessage(messageId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not authenticated" };
    }

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('message_likes')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

    if (existingLike) {
        // Unlike if already liked
        const { error } = await supabase
            .from('message_likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, liked: false };
    }

    // Like
    const { error } = await supabase
        .from('message_likes')
        .insert({
            message_id: messageId,
            user_id: user.id
        });

    if (error) {
        console.error("Like message error:", error);
        return { success: false, error: error.message };
    }

    return { success: true, liked: true };
}

/**
 * Get likes for messages in a conversation
 */
export async function getMessageLikes(conversationId: string): Promise<{ [messageId: number]: { count: number; likedByMe: boolean } }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return {};

    // Get all messages in conversation
    const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId);

    if (!messages || messages.length === 0) return {};

    const messageIds = messages.map(m => m.id);

    // Get likes for these messages
    const { data: likes } = await supabase
        .from('message_likes')
        .select('message_id, user_id')
        .in('message_id', messageIds);

    if (!likes) return {};

    // Build result
    const result: { [messageId: number]: { count: number; likedByMe: boolean } } = {};

    for (const msg of messages) {
        const msgLikes = likes.filter(l => l.message_id === msg.id);
        result[msg.id] = {
            count: msgLikes.length,
            likedByMe: msgLikes.some(l => l.user_id === user.id)
        };
    }

    return result;
}

/**
 * Get total unread count for all conversations
 */
export async function getTotalUnreadCount(): Promise<number> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    // Get all conversations user is part of
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (!participations || participations.length === 0) return 0;

    const conversationIds = participations.map(p => p.conversation_id);

    // Count unread messages in these conversations sent by OTHERS
    try {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .in('conversation_id', conversationIds)
            .neq('sender_id', user.id)
            .eq('is_read', false);

        if (error) return 0;
        return count || 0;
    } catch (error) {
        return 0;
    }
}
