import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "./actions";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await getConversations();

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Mesajlar</h1>
                <p className="text-muted-foreground mt-2">Sohbetleriniz</p>
            </div>

            <div className="space-y-3">
                {conversations.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-lg">Henüz mesajınız yok</p>
                        <p className="text-muted-foreground/70 text-sm mt-2">
                            Bir kullanıcının profilinden mesaj başlatabilirsiniz
                        </p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href={`/mesajlar/${conv.id}`}
                            className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent transition-colors"
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={conv.otherUser?.avatar_url || ""} />
                                <AvatarFallback>
                                    {conv.otherUser?.username?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold truncate">
                                        {conv.otherUser?.full_name || conv.otherUser?.username || "Kullanıcı"}
                                    </h3>
                                    {conv.lastMessage && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), {
                                                addSuffix: true,
                                                locale: tr
                                            })}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conv.lastMessage ? conv.lastMessage.content : "Henüz mesaj yok"}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full ml-2">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
