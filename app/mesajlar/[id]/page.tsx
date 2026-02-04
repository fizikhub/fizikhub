import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getMessages, markAsRead, getMessageLikes, Message } from "../actions";
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

    }

    let messages: Message[] = [];
    let initialLikes: { [messageId: number]: { count: number; likedByMe: boolean } } = {};

    try {
        // Fetch messages and likes in parallel
        const [messagesResult, likesResult] = await Promise.all([
            getMessages(conversationId),
            getMessageLikes(conversationId)
        ]);
        messages = messagesResult;
        initialLikes = likesResult;

        if (process.env.NODE_ENV === 'development') {

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
            {/* Header - Neo Brutalist */}
            <div className="bg-[#09090b] border-b-2 border-zinc-800 px-4 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/mesajlar">
                        <button className="h-10 w-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center hover:bg-[#FACC15] hover:text-black hover:border-black transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none bg-white/5 text-white">
                            <ArrowLeft className="h-5 w-5 stroke-[3px]" />
                        </button>
                    </Link>
                    <div>
                        <h2 className="font-black text-xl text-white uppercase tracking-tight italic">
                            {otherUser?.full_name || otherUser?.username || "GİZLİ KULLANICI"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-mono text-zinc-400">ONLINE /// ENCRYPTED</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <div className="w-10 h-10 border-2 border-zinc-800 rounded-full flex items-center justify-center">
                        <img
                            src={otherUser?.avatar_url || "/default-avatar.png"}
                            className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <ChatWindow
                conversationId={conversationId}
                initialMessages={messages}
                currentUserId={user.id}
                initialLikes={initialLikes}
            />
        </div>
    );
}
