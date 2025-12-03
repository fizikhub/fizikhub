import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "./actions";
import { ConversationList } from "@/components/messaging/conversation-list";
import { ChatWindow } from "@/components/messaging/chat-window";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
    searchParams: Promise<{ c?: string }>;
}

export default async function MessagesPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await getConversations();
    const params = await searchParams;
    const activeConversationId = params.c;

    let activeConversation = null;
    if (activeConversationId) {
        activeConversation = conversations.find((c: any) => c.id === activeConversationId);
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] max-w-[1600px] mx-auto md:p-4 lg:p-6">
            <div className="flex-1 flex overflow-hidden bg-background md:border md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-border/5">
                {/* Sidebar - Conversation List */}
                <div className={cn(
                    "flex flex-col w-full md:w-[320px] lg:w-[380px] border-r bg-muted/5",
                    activeConversationId ? "hidden md:flex" : "flex"
                )}>
                    <div className="p-4 border-b bg-background/50 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
                        <h1 className="font-bold text-xl flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            Mesajlar
                        </h1>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ConversationList conversations={conversations} />
                    </div>
                </div>

                {/* Main - Chat Window */}
                <div className={cn(
                    "flex flex-col flex-1 bg-background relative min-w-0",
                    !activeConversationId ? "hidden md:flex" : "flex"
                )}>
                    {activeConversationId && activeConversation ? (
                        <ChatWindow
                            conversationId={activeConversationId}
                            currentUser={user}
                            otherUser={activeConversation.otherUser}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
                            <div className="bg-primary/5 p-6 rounded-3xl mb-6 animate-pulse ring-1 ring-primary/10">
                                <MessageSquare className="h-16 w-16 text-primary/40" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-foreground tracking-tight">Hoş Geldin, {user.user_metadata?.full_name?.split(' ')[0] || "Kullanıcı"}! 👋</h2>
                            <p className="max-w-sm text-muted-foreground/80 leading-relaxed">
                                Sol taraftan bir sohbet seçerek mesajlaşmaya başlayabilirsin.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
