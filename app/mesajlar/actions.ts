"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "@/app/notifications/actions";

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Find recipient to check blocks and for notification
    const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId);

    const recipient = participants?.find(p => p.user_id !== user.id);

    if (recipient) {
        // Check for blocks
        const { data: block } = await supabase
            .from('blocked_users')
            .select('id')
            .or(`and(blocker_id.eq.${user.id},blocked_id.eq.${recipient.user_id}),and(blocker_id.eq.${recipient.user_id},blocked_id.eq.${user.id})`)
            .single();

        if (block) {
            return { success: false, error: "Bu kullanıcı ile mesajlaşamazsınız." };
        }
    }

    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content
    });

    if (error) {
        console.error("Send Message Error:", error);
        return { success: false, error: error.message };
    }

    if (recipient) {
        // Get sender's profile for notification content
        const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', user.id)
            .single();

        const senderName = senderProfile?.full_name || senderProfile?.username || 'Bir kullanıcı';
        const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;

        await createNotification({
            recipientId: recipient.user_id,
            actorId: user.id,
            type: 'message',
            resourceId: conversationId,
            resourceType: 'conversation',
            content: `${senderName}: ${messagePreview}`
        });
    }

    revalidatePath(`/mesajlar`);
    return { success: true };
}

export async function startConversation(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    // Use the RPC function we created
    const { data: conversationId, error } = await supabase
        .rpc('create_conversation', { other_user_id: otherUserId });

    if (error) {
        console.error("Start Conversation Error:", error);
        return { success: false, error: error.message };
    }

    redirect(`/mesajlar?c=${conversationId}`);
}

export async function getConversations() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Fetch conversations with participants and last message
    const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
            id,
            updated_at,
            conversation_participants!inner(user_id),
            messages(content, created_at, is_read, sender_id)
        `)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Get Conversations Error:", JSON.stringify(error, null, 2));
        return [];
    }

    // We need to fetch profile details for the *other* participant manually or via join
    // Ideally we'd join profiles in the query above but it's complex with the many-to-many
    // Let's do a second fetch for profiles for simplicity and reliability

    const enhancedConversations = await Promise.all(conversations.map(async (conv) => {
        // Find the other participant ID
        const otherParticipant = conv.conversation_participants.find((p: any) => p.user_id !== user.id);
        const otherUserId = otherParticipant?.user_id;

        let otherUserProfile = null;
        if (otherUserId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, full_name, avatar_url, is_verified, email')
                .eq('id', otherUserId)
                .single();
            otherUserProfile = profile;
        }

        // Get last message (supabase returns array, we want latest)
        const lastMessage = conv.messages && conv.messages.length > 0
            ? conv.messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
            : null;

        return {
            id: conv.id,
            otherUser: otherUserProfile,
            lastMessage
        };
    }));

    return enhancedConversations;
}

export async function getMessages(conversationId: string) {
    const supabase = await createClient();

    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) return [];
    return messages;
}

export async function markAsRead(conversationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Mark messages as read where I am NOT the sender
    await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

    revalidatePath(`/mesajlar`);
}

export async function toggleLike(messageId: number, currentLikeStatus: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false };

    // Toggle the like status
    const { data: message, error } = await supabase
        .from('messages')
        .update({ is_liked: !currentLikeStatus })
        .eq('id', messageId)
        .select('*, conversation_id')
        .single();

    if (error) {
        console.error("Toggle Like Error:", error);
        return { success: false };
    }

    // Send notification if liked (not unliked) and not liking own message
    if (!currentLikeStatus && message.sender_id !== user.id) {
        // Get sender's profile for notification content
        const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', user.id)
            .single();

        const senderName = senderProfile?.full_name || senderProfile?.username || 'Bir kullanıcı';
        const messagePreview = message.content.length > 20 ? message.content.substring(0, 20) + '...' : message.content;

        await createNotification({
            recipientId: message.sender_id,
            actorId: user.id,
            type: 'like', // You might need to handle 'like' type in notifications UI
            resourceId: message.conversation_id,
            resourceType: 'conversation',
            content: `${senderName} mesajını beğendi: "${messagePreview}"`
        });
    }

    revalidatePath(`/mesajlar`);
    return { success: true };
}

export async function blockUser(blockedId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    const { error } = await supabase
        .from('blocked_users')
        .insert({
            blocker_id: user.id,
            blocked_id: blockedId
        });

    if (error) return { success: false, error: error.message };
    revalidatePath('/mesajlar');
    return { success: true };
}

export async function unblockUser(blockedId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', blockedId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/mesajlar');
    return { success: true };
}

export async function checkBlockStatus(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isBlocked: false, isBlocking: false };

    // Check if I blocked them
    const { data: blocking } = await supabase
        .from('blocked_users')
        .select('id')
        .eq('blocker_id', user.id)
        .eq('blocked_id', otherUserId)
        .single();

    // Check if they blocked me
    const { data: blocked } = await supabase
        .from('blocked_users')
        .select('id')
        .eq('blocker_id', otherUserId)
        .eq('blocked_id', user.id)
        .single();

    return {
        isBlocking: !!blocking,
        isBlocked: !!blocked
    };
}
