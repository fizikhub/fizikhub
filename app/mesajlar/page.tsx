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
        <div className="container py-4 md:py-6 px-0 md:px-6 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] h-full md:border md:rounded-2xl md:overflow-hidden md:bg-card md:shadow-xl transition-all">
                {/* Sidebar - Conversation List */}
                <div className={cn(
                    "flex flex-col bg-background md:bg-muted/10 md:border-r h-full",
                    activeConversationId ? "hidden md:flex" : "flex"
                )}>
                    <div className="p-4 border-b flex items-center justify-between bg-card/50 backdrop-blur-sm">
                        <h1 className="font-bold text-2xl flex items-center gap-2 text-primary">
                            <MessageSquare className="h-6 w-6" /> Mesajlar
                        </h1>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ConversationList conversations={conversations} />
                    </div>
                </div>

                {/* Main - Chat Window */}
                <div className={cn(
                    "flex flex-col bg-background h-full relative",
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
                            <div className="bg-primary/5 p-8 rounded-full mb-6 animate-pulse">
                                <MessageSquare className="h-20 w-20 text-primary/20" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-foreground">Hoş Geldin, {user.user_metadata?.full_name?.split(' ')[0] || "Kullanıcı"}! 👋</h2>
                            <p className="max-w-md text-muted-foreground">
                                Sol taraftan bir sohbet seçerek mesajlaşmaya başlayabilirsin. Yeni bir sohbet başlatmak için kullanıcı profillerini ziyaret et.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
