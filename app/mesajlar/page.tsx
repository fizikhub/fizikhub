import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "./actions";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Search, ChevronRight } from "lucide-react";
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
        <div className="container mx-auto max-w-2xl px-4 py-8 min-h-screen">

            {/* V36 MESSAGE LIST HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">GELEN KUTUSU</h1>
                    <p className="text-zinc-500 font-mono text-xs">Sohbetlerin ve bağlantıların.</p>
                </div>
                {/* Search Visual */}
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                    <Search className="w-5 h-5" />
                </div>
            </div>

            <div className="space-y-3">
                {conversations.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 backdrop-blur">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-zinc-700" />
                        <h3 className="text-white font-bold text-lg">Burası Çok Sessiz</h3>
                        <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
                            Henüz kimseyle konuşmadın. Bir yazarın profiline gidip "Mesaj Gönder"e basarak başlayabilirsin.
                        </p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href={`/mesajlar/${conv.id}`}
                            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-[#09090b] border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all active:scale-[0.99]"
                        >
                            <Avatar className="h-14 w-14 border-2 border-transparent group-hover:border-[#FFC800] transition-colors">
                                <AvatarImage src={conv.otherUser?.avatar_url || ""} />
                                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                    {conv.otherUser?.username?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-white text-base group-hover:text-[#FFC800] transition-colors truncate">
                                        {conv.otherUser?.full_name || conv.otherUser?.username || "Kullanıcı"}
                                    </h3>
                                    {conv.lastMessage && (
                                        <span className="text-[10px] uppercase font-bold text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">
                                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), {
                                                addSuffix: false,
                                                locale: tr
                                            })} önce
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-zinc-400 truncate pr-4 font-medium leading-relaxed opacity-70 group-hover:opacity-100">
                                        {conv.lastMessage ? conv.lastMessage.content : "Henüz mesaj yok"}
                                    </p>

                                    {conv.unreadCount > 0 ? (
                                        <span className="bg-[#FFC800] text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0px_0px_10px_#FFC800]">
                                            {conv.unreadCount}
                                        </span>
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:translate-x-1 transition-transform" />
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
