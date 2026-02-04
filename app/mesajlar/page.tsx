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
    // Optimize user check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await getConversations();

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#FACC15] selection:text-black">
            {/* BACKGROUND GRAIN */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

            <div className="container mx-auto max-w-2xl px-4 py-8 relative z-10">

                {/* HEADER */}
                <div className="flex flex-col gap-1 mb-8 pt-4">
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase transform -skew-x-2">
                        Gelen Kutusu
                    </h1>
                    <div className="h-1 w-20 bg-[#FACC15] mb-2"></div>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        /// Secure Connection Established
                    </p>
                </div>

                <div className="space-y-4">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-[3px] border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                            <div className="w-20 h-20 bg-[#FACC15] rounded-full flex items-center justify-center mb-6 shadow-[0px_0px_30px_rgba(250,204,21,0.2)]">
                                <MessageSquare className="h-10 w-10 text-black stroke-[2.5px]" />
                            </div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tight">Sessizlik...</h3>
                            <p className="text-zinc-500 font-mono text-sm mt-2 text-center max-w-xs">
                                Henüz kimseyle frekans yakalamadın. <br /> Bir yazarın profiline git ve sinyal gönder.
                            </p>
                        </div>
                    ) : (
                        conversations.map((conv, index) => (
                            <Link
                                key={conv.id}
                                href={`/mesajlar/${conv.id}`}
                                className="block"
                            >
                                <div
                                    className="group relative flex items-center gap-5 p-5 rounded-none bg-[#0a0a0a] border border-zinc-800 hover:border-[#FACC15] transition-all duration-300 hover:translate-x-2 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#18181b] overflow-hidden"
                                >
                                    {/* HOVER GLOW BAR */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FACC15] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                                    {/* AVATAR */}
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 border-[3px] border-zinc-800 group-hover:border-[#FACC15] transition-colors rounded-none transform rotate-3 group-hover:rotate-0 duration-300">
                                            <AvatarImage src={conv.otherUser?.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="bg-zinc-900 text-zinc-500 font-black text-xl rounded-none">
                                                {conv.otherUser?.username?.substring(0, 2).toUpperCase() || "??"}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* ONLINE STATUS DOT (MOCK) */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500/0 border-2 border-transparent group-hover:bg-green-500 group-hover:border-black transition-all"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h3 className="font-black text-white text-lg tracking-tight group-hover:text-[#FACC15] transition-colors truncate uppercase">
                                                {conv.otherUser?.full_name || conv.otherUser?.username || "Ajan"}
                                            </h3>
                                            {conv.lastMessage && (
                                                <span className="font-mono text-[10px] font-bold text-zinc-600 bg-zinc-900/80 px-2 py-1 border border-zinc-800 rounded-sm">
                                                    {formatDistanceToNow(new Date(conv.lastMessage.created_at), {
                                                        addSuffix: false,
                                                        locale: tr
                                                    })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-zinc-400 font-medium truncate pr-4 opacity-60 group-hover:opacity-100 group-hover:text-white transition-all font-mono">
                                                {conv.lastMessage ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-[#FACC15]">{">"}</span> {conv.lastMessage.content}
                                                    </span>
                                                ) : "Veri yok..."}
                                            </p>

                                            {conv.unreadCount > 0 && (
                                                <span className="bg-[#FACC15] text-black text-xs font-black min-w-[24px] h-6 flex items-center justify-center shadow-[0px_0px_10px_rgba(250,204,21,0.5)] transform rotate-12">
                                                    {conv.unreadCount}
                                                </span>
                                            )}

                                            {conv.unreadCount === 0 && (
                                                <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                    <ChevronRight className="w-5 h-5 text-[#FACC15]" />
                                                </div>
                                            )}
                                        </div>
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
