import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "./actions";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Search, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
    const supabase = await createClient();
    // Optimize user check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await getConversations();

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="container mx-auto max-w-3xl px-4 py-8">

                {/* HEADER: Clean & Bold */}
                <div className="mb-10 mt-4 flex items-end justify-between border-b-2 border-zinc-800 pb-4">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white font-[family-name:var(--font-outfit)]">
                            Gelen Kutusu
                        </h1>
                        <p className="text-zinc-400 mt-2 font-medium text-sm sm:text-base">
                            Sohbetlerin ve bağlantıların.
                        </p>
                    </div>
                    {/* Add a subtle 'New Message' button or icon here if needed in future, keeping it clean for now */}
                </div>

                <div className="space-y-3">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
                            <div className="w-16 h-16 bg-[#FACC15] rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_white] transform -rotate-3">
                                <MessageSquare className="h-8 w-8 text-black fill-black/10" />
                            </div>
                            <h3 className="text-white font-bold text-xl">Henüz mesaj yok</h3>
                            <p className="text-zinc-500 mt-2 text-center max-w-xs text-sm">
                                Bilimsel tartışmalar başlatmak için yazarlara ulaşabilirsin.
                            </p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <Link
                                key={conv.id}
                                href={`/mesajlar/${conv.id}`}
                                className="block group"
                            >
                                <div className="relative flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900 hover:border-white/20 transition-all duration-300">

                                    {/* AVATAR: Clean Circle with Indicator */}
                                    <div className="relative shrink-0">
                                        <Avatar className="h-14 w-14 border-2 border-zinc-800 group-hover:border-[#FACC15] transition-colors rounded-full">
                                            <AvatarImage src={conv.otherUser?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-lg">
                                                {conv.otherUser?.username?.substring(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Unread Indicator on Avatar */}
                                        {conv.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FACC15] text-black text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#050505]">
                                                {conv.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-bold text-white text-base sm:text-lg tracking-tight group-hover:text-[#FACC15] transition-colors truncate pr-2 font-[family-name:var(--font-outfit)]">
                                                {conv.otherUser?.full_name || conv.otherUser?.username || "Kullanıcı"}
                                            </h3>
                                            {conv.lastMessage && (
                                                <span className="text-xs font-medium text-zinc-500 shrink-0">
                                                    {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: false, locale: tr })} önce
                                                </span>
                                            )}
                                        </div>

                                        <p className={cn(
                                            "text-sm truncate pr-6 leading-relaxed",
                                            conv.unreadCount > 0 ? "text-white font-medium" : "text-zinc-500 group-hover:text-zinc-400"
                                        )}>
                                            {conv.lastMessage ? (
                                                <span className="flex items-center gap-1.5">
                                                    {conv.lastMessage.sender_id === user.id && (
                                                        <span className="text-zinc-600 text-xs">Sen:</span>
                                                    )}
                                                    {conv.lastMessage.content}
                                                </span>
                                            ) : (
                                                <span className="italic opacity-50">Mesajlaşma başlatıldı</span>
                                            )}
                                        </p>
                                    </div>

                                    {/* ARROW ICON */}
                                    <div className="text-zinc-600 group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
