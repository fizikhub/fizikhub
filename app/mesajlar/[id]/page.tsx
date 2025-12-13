import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getMessages, markAsRead, Message } from "../actions";
import { ChatWindow } from "@/components/messaging/chat-window";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    if (process.env.NODE_ENV === 'development') {
        console.log("Conversation Page: Fetching data for conversation", conversationId);
    }

    let messages: Message[] = [];
    try {
        messages = await getMessages(conversationId);
        if (process.env.NODE_ENV === 'development') {
            console.log(`Conversation Page: Fetched ${messages.length} messages`);
        }
    } catch (e) {
        console.error("Conversation Page: Error fetching messages", e);
    }

    // Mark messages as read
    try {
        await markAsRead(conversationId);
    } catch (e) {
        console.error("Conversation Page: Error marking as read", e);
    }

    // Get other participant info
    let otherUser = null;
    try {
        const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversationId)
            .neq('user_id', user.id)
            .single();

        if (otherParticipant) {
            const { data } = await supabase
                .from('profiles')
                .select('id, username, full_name, avatar_url')
                .eq('id', otherParticipant.user_id)
                .single();
            otherUser = data;
        }
    } catch (e) {
        console.error("Conversation Page: Error fetching participants", e);
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="border-b bg-card px-4 py-3 flex items-center gap-3">
                <Link href="/mesajlar">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="font-semibold">
                        {otherUser?.full_name || otherUser?.username || "Bilinmeyen Kullanıcı"}
                    </h2>
                    <p className="text-xs text-muted-foreground">@{otherUser?.username || "user"}</p>
                </div>
            </div>

            {/* Chat Window */}
            <ChatWindow
                conversationId={conversationId}
                initialMessages={messages}
                currentUserId={user.id}
            />
        </div>
    );
}
