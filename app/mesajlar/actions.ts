"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Giriş yapmalısınız." };

    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content
    });

    if (error) {
        console.error("Send Message Error:", error);
        return { success: false, error: error.message };
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
    const { error } = await supabase
        .from('messages')
        .update({ is_liked: !currentLikeStatus })
        .eq('id', messageId);

    if (error) {
        console.error("Toggle Like Error:", error);
        return { success: false };
    }

    revalidatePath(`/mesajlar`);
    return { success: true };
}
