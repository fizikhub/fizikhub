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
 */
export async function getConversations(): Promise<Conversation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get conversation IDs user is part of
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (!participations || participations.length === 0) return [];

    const conversationIds = participations.map(p => p.conversation_id);

    // Get conversation details
    const { data: conversations } = await supabase
        .from('conversations')
        .select('id, updated_at')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

    if (!conversations) return [];

    // Build conversation list with details
    const result: Conversation[] = [];

    for (const conv of conversations) {
        // Get other participant
        const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id)
            .single();

        if (!otherParticipant) continue;

        // Get other user's profile
        const { data: otherProfile } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', otherParticipant.user_id)
            .single();

        // Get last message
        const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(10);

        const lastMessage = messages && messages.length > 0 ? messages[0] : null;

        // Count unread messages (not sent by me)
        const unreadCount = messages
            ? messages.filter(m => m.sender_id !== user.id && !m.is_read).length
            : 0;

        result.push({
            id: conv.id,
            updated_at: conv.updated_at,
            otherUser: otherProfile,
            lastMessage,
            unreadCount
        });
    }

    return result;
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
