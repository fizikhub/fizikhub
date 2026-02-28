"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { getClientMetadata, checkContent } from "@/lib/moderation";

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
    message_type: 'text' | 'image' | 'system';
    edited_at: string | null;
    reply_to_id: number | null;
    reply_to?: {
        id: number;
        content: string;
        sender_id: string;
    } | null;
    sender?: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    } | null;
}

export interface Conversation {
    id: string;
    updated_at: string;
    last_message_preview: string | null;
    last_message_at: string | null;
    last_message_sender_id: string | null;
    otherUser: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string;
    } | null;
    lastMessage: Message | null;
    unreadCount: number;
}

export interface Reaction {
    id: string;
    message_id: number;
    user_id: string;
    reaction: string;
    created_at: string;
}

// ============================================
// SEND MESSAGE
// ============================================

export async function sendMessage(
    conversationId: string,
    content: string,
    replyToId?: number | null
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız" };
    }

    if (!content.trim()) {
        return { success: false, error: "Mesaj boş olamaz" };
    }

    const { ip, ua } = await getClientMetadata();
    const modResult = checkContent(content.trim());

    const insertData: any = {
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        is_read: false,
        message_type: 'text',
        author_ip: ip,
        user_agent: ua,
        is_flagged: modResult.isFlagged
    };

    if (replyToId) {
        insertData.reply_to_id = replyToId;
    }

    const { data: message, error } = await supabase
        .from('messages')
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Send message error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/mesajlar');
    return { success: true, message };
}

// ============================================
// GET CONVERSATIONS (Optimized)
// ============================================

export async function getConversations(): Promise<Conversation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Get all conversation IDs for this user
    const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (partError || !participations || participations.length === 0) return [];

    const conversationIds = participations.map(p => p.conversation_id);

    // Get conversations with preview data (no need to fetch all messages!)
    const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id, updated_at, last_message_preview, last_message_at, last_message_sender_id')
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false, nullsFirst: false });

    if (convError || !conversations) return [];

    // Get other participants separately
    const { data: otherParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id, user_id')
        .in('conversation_id', conversationIds)
        .neq('user_id', user.id);

    // Get other participants' profiles in one separate query to avoid join issues
    const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', otherParticipants?.map((p: any) => p.user_id) || []);

    const profileMap: Record<string, any> = {};
    if (allProfiles) {
        for (const p of allProfiles) {
            profileMap[p.id] = p;
        }
    }

    // Get unread counts per conversation
    const { data: unreadMessages } = await supabase
        .from('messages')
        .select('conversation_id')
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .eq('is_read', false);

    const unreadMap: Record<string, number> = {};
    if (unreadMessages) {
        for (const msg of unreadMessages) {
            unreadMap[msg.conversation_id] = (unreadMap[msg.conversation_id] || 0) + 1;
        }
    }

    return conversations.map(conv => {
        const otherPart = otherParticipants?.find(p => p.conversation_id === conv.id);
        const otherProfile = otherPart ? profileMap[otherPart.user_id] : null;

        return {
            id: conv.id,
            updated_at: conv.updated_at,
            last_message_preview: conv.last_message_preview,
            last_message_at: conv.last_message_at,
            last_message_sender_id: conv.last_message_sender_id,
            otherUser: otherProfile || null,
            lastMessage: conv.last_message_preview ? {
                id: 0,
                conversation_id: conv.id,
                sender_id: conv.last_message_sender_id || '',
                content: conv.last_message_preview,
                is_read: true,
                created_at: conv.last_message_at || conv.updated_at,
                message_type: 'text' as const,
                edited_at: null,
                reply_to_id: null,
            } : null,
            unreadCount: unreadMap[conv.id] || 0,
        };
    });
}

// ============================================
// GET MESSAGES (with pagination & replies)
// ============================================

export async function getMessages(
    conversationId: string,
    limit = 50,
    before?: string
): Promise<{ messages: Message[]; hasMore: boolean }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { messages: [], hasMore: false };

    // Verify user is part of conversation
    const { data: participation } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

    if (!participation) return { messages: [], hasMore: false };

    // Build query
    let query = supabase
        .from('messages')
        .select(`
            id,
            conversation_id,
            sender_id,
            content,
            is_read,
            created_at,
            message_type,
            edited_at,
            reply_to_id
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit + 1); // +1 to check if there are more

    if (before) {
        query = query.lt('created_at', before);
    }

    const { data: messages } = await query;

    if (!messages) return { messages: [], hasMore: false };

    const hasMore = messages.length > limit;
    const sliced = hasMore ? messages.slice(0, limit) : messages;

    // Get reply-to messages if any
    const replyIds = sliced.filter(m => m.reply_to_id).map(m => m.reply_to_id!);
    let replyMap: Record<number, { id: number; content: string; sender_id: string }> = {};

    if (replyIds.length > 0) {
        const { data: replies } = await supabase
            .from('messages')
            .select('id, content, sender_id')
            .in('id', replyIds);

        if (replies) {
            for (const r of replies) {
                replyMap[r.id] = { id: r.id, content: r.content, sender_id: r.sender_id };
            }
        }
    }

    // Get unique sender IDs and fetch profiles
    const senderIds = [...new Set(sliced.map(m => m.sender_id))];
    let profileMap: Record<string, any> = {};

    if (senderIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', senderIds);

        if (profiles) {
            for (const p of profiles) {
                profileMap[p.id] = p;
            }
        }
    }

    const enrichedMessages: Message[] = sliced.map(m => ({
        ...m,
        message_type: (m.message_type || 'text') as 'text' | 'image' | 'system',
        reply_to: m.reply_to_id ? (replyMap[m.reply_to_id] || null) : null,
        sender: profileMap[m.sender_id] || null,
    })).reverse(); // Reverse to get chronological order

    return { messages: enrichedMessages, hasMore };
}

// ============================================
// MARK AS READ
// ============================================

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

// ============================================
// START CONVERSATION
// ============================================

export async function startConversation(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız" };
    }

    const { data: conversationId, error } = await supabase
        .rpc('create_conversation', { other_user_id: otherUserId });

    if (error) {
        console.error("Start conversation error:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/mesajlar');
    return { success: true, conversationId };
}

// ============================================
// DELETE MESSAGE
// ============================================

export async function deleteMessage(messageId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız" };
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

    // Delete related notifications
    await supabase
        .from('notifications')
        .delete()
        .eq('resource_type', 'message')
        .eq('resource_id', messageId.toString());

    // Delete the message
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

// ============================================
// EDIT MESSAGE
// ============================================

export async function editMessage(messageId: number, newContent: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız" };
    }

    if (!newContent.trim()) {
        return { success: false, error: "Mesaj boş olamaz" };
    }

    // Verify ownership
    const { data: message } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('id', messageId)
        .single();

    if (!message || message.sender_id !== user.id) {
        return { success: false, error: "Bu mesajı düzenleme yetkiniz yok" };
    }

    const { error } = await supabase
        .from('messages')
        .update({
            content: newContent.trim(),
            edited_at: new Date().toISOString()
        })
        .eq('id', messageId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

// ============================================
// REACT TO MESSAGE
// ============================================

export async function reactToMessage(messageId: number, reaction: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Giriş yapmalısınız" };
    }

    // Check if already reacted with same emoji
    const { data: existing } = await supabase
        .from('message_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('reaction', reaction)
        .single();

    if (existing) {
        // Remove reaction
        await supabase
            .from('message_reactions')
            .delete()
            .eq('id', existing.id);
        return { success: true, removed: true };
    }

    // Add reaction
    const { error } = await supabase
        .from('message_reactions')
        .insert({
            message_id: messageId,
            user_id: user.id,
            reaction
        });

    if (error) {
        console.error("React error:", error);
        return { success: false, error: error.message };
    }

    return { success: true, removed: false };
}

// ============================================
// GET REACTIONS FOR CONVERSATION
// ============================================

export async function getReactions(conversationId: string): Promise<Record<number, { reaction: string; count: number; myReaction: boolean }[]>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return {};

    const { data: messages } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId);

    if (!messages || messages.length === 0) return {};

    const messageIds = messages.map(m => m.id);

    const { data: reactions } = await supabase
        .from('message_reactions')
        .select('message_id, user_id, reaction')
        .in('message_id', messageIds);

    if (!reactions) return {};

    const result: Record<number, { reaction: string; count: number; myReaction: boolean }[]> = {};

    for (const r of reactions) {
        if (!result[r.message_id]) {
            result[r.message_id] = [];
        }

        const existing = result[r.message_id].find(x => x.reaction === r.reaction);
        if (existing) {
            existing.count++;
            if (r.user_id === user.id) existing.myReaction = true;
        } else {
            result[r.message_id].push({
                reaction: r.reaction,
                count: 1,
                myReaction: r.user_id === user.id
            });
        }
    }

    return result;
}

// ============================================
// SEARCH MESSAGES IN CONVERSATION
// ============================================

export async function searchMessages(conversationId: string, query: string): Promise<Message[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !query.trim()) return [];

    // Verify participation
    const { data: participation } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

    if (!participation) return [];

    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .ilike('content', `%${query.trim()}%`)
        .order('created_at', { ascending: false })
        .limit(20);

    return (messages || []).map(m => ({
        ...m,
        message_type: (m.message_type || 'text') as 'text' | 'image' | 'system',
        reply_to: null,
        sender: null,
    }));
}

// ============================================
// LEGACY COMPATIBILITY: likeMessage → reactToMessage
// ============================================

export async function likeMessage(messageId: number) {
    return reactToMessage(messageId, '❤️');
}

export async function getMessageLikes(conversationId: string): Promise<{ [messageId: number]: { count: number; likedByMe: boolean } }> {
    const reactions = await getReactions(conversationId);
    const result: { [messageId: number]: { count: number; likedByMe: boolean } } = {};

    for (const [msgId, reacts] of Object.entries(reactions)) {
        const heartReact = reacts.find(r => r.reaction === '❤️');
        if (heartReact) {
            result[Number(msgId)] = {
                count: heartReact.count,
                likedByMe: heartReact.myReaction
            };
        }
    }

    return result;
}

// ============================================
// GET TOTAL UNREAD COUNT
// ============================================

export async function getTotalUnreadCount(): Promise<number> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (!participations || participations.length === 0) return 0;

    const conversationIds = participations.map(p => p.conversation_id);

    try {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .in('conversation_id', conversationIds)
            .neq('sender_id', user.id)
            .eq('is_read', false);

        if (error) return 0;
        return count || 0;
    } catch {
        return 0;
    }
}
