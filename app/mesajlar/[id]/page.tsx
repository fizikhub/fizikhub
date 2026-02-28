import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getMessages, getReactions, markAsRead, Message } from "../actions";
import { ChatWindow } from "@/components/messaging/chat-window";
import { ChatHeader } from "@/components/messaging/chat-header";

export default async function ConversationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { id: conversationId } = await params;

    let messages: Message[] = [];
    let initialReactions: Record<number, { reaction: string; count: number; myReaction: boolean }[]> = {};
    let otherUser: any = null;

    try {
        // Fetch everything in parallel
        const [messagesResult, reactionsResult, _] = await Promise.all([
            getMessages(conversationId),
            getReactions(conversationId),
            markAsRead(conversationId),
        ]);

        messages = messagesResult.messages;
        initialReactions = reactionsResult;

        // Fetch other participant info
        const { data: otherParticipant } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", conversationId)
            .neq("user_id", user.id)
            .single();

        if (otherParticipant) {
            const { data } = await supabase
                .from("profiles")
                .select("id, username, full_name, avatar_url")
                .eq("id", otherParticipant.user_id)
                .single();
            otherUser = data;
        }
    } catch (e) {
        console.error("Conversation Page: Error fetching data", e);
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-[#050505]">
            {/* Header */}
            <ChatHeader otherUser={otherUser} />

            {/* Chat */}
            <ChatWindow
                key={conversationId}
                conversationId={conversationId}
                initialMessages={messages}
                currentUserId={user.id}
                initialReactions={initialReactions}
                otherUserAvatar={otherUser?.avatar_url}
            />
        </div>
    );
}
