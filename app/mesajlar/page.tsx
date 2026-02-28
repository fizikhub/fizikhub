import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { getConversations } from "./actions";
import { ConversationList } from "@/components/messaging/conversation-list";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ChevronRight, Plus, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const conversations = await getConversations();

    return (
        <div className="min-h-[100dvh] bg-[#050505] text-white font-[family-name:var(--font-outfit)]">
            <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">

                {/* Header */}
                <div className="mb-8 mt-2">
                    <div className="flex items-end justify-between mb-1">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Mesajlar
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#FACC15] hover:border-[#FACC15]/30 transition-all cursor-pointer">
                                <Plus className="h-4 w-4 stroke-[2.5px]" />
                            </div>
                        </div>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">
                        Sohbetlerin ve bağlantıların
                    </p>
                    <div className="h-[2px] bg-gradient-to-r from-[#FACC15]/30 via-zinc-800 to-transparent mt-4" />
                </div>

                {conversations.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                        <div className="relative mb-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FACC15]/20 to-[#FACC15]/5 rounded-2xl flex items-center justify-center transform -rotate-3 border border-[#FACC15]/20">
                                <MessageSquare className="h-7 w-7 text-[#FACC15]" />
                            </div>
                            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-zinc-800 rounded-lg flex items-center justify-center rotate-12 border border-white/[0.06]">
                                <Sparkles className="h-3 w-3 text-[#FACC15]/60" />
                            </div>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1.5">Henüz mesaj yok</h3>
                        <p className="text-zinc-500 text-center max-w-[260px] text-sm leading-relaxed">
                            Bilimsel tartışmalar başlatmak için yazarlara ulaşabilirsin.
                        </p>
                    </div>
                ) : (
                    /* Conversation List */
                    <div className="space-y-1.5">
                        {conversations.map((conv, i) => {
                            const hasUnread = conv.unreadCount > 0;
                            const displayName = conv.otherUser?.full_name || conv.otherUser?.username || "Kullanıcı";
                            const initials = displayName.substring(0, 2).toUpperCase();
                            const lastMessageText = conv.last_message_preview || conv.lastMessage?.content;
                            const lastMessageTime = conv.last_message_at || conv.lastMessage?.created_at;
                            const isMyLastMessage = (conv.last_message_sender_id || conv.lastMessage?.sender_id) === user.id;

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/mesajlar/${conv.id}`}
                                    className="block group"
                                >
                                    <div
                                        className={cn(
                                            "relative flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200",
                                            "bg-zinc-900/30 border border-transparent",
                                            "hover:bg-zinc-900/70 hover:border-white/[0.06]",
                                            "active:scale-[0.99]",
                                            hasUnread && "bg-zinc-900/50 border-[#FACC15]/10"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <Avatar className="h-12 w-12 border-2 border-zinc-800 group-hover:border-zinc-700 transition-colors rounded-full">
                                                <AvatarImage src={conv.otherUser?.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-sm">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            {hasUnread && (
                                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FACC15] text-black text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[#050505]">
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3
                                                    className={cn(
                                                        "text-[15px] font-semibold truncate pr-2",
                                                        "group-hover:text-[#FACC15] transition-colors",
                                                        hasUnread ? "text-white font-bold" : "text-zinc-200"
                                                    )}
                                                >
                                                    {displayName}
                                                </h3>
                                                {lastMessageTime && (
                                                    <span className="text-[11px] font-medium text-zinc-500 shrink-0 tabular-nums">
                                                        {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: false, locale: tr })}
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className={cn(
                                                    "text-[13px] truncate leading-relaxed",
                                                    hasUnread ? "text-zinc-200 font-medium" : "text-zinc-500"
                                                )}
                                            >
                                                {lastMessageText ? (
                                                    <>
                                                        {isMyLastMessage && (
                                                            <span className="text-zinc-600 mr-1">Sen:</span>
                                                        )}
                                                        {lastMessageText}
                                                    </>
                                                ) : (
                                                    <span className="italic opacity-50">Mesajlaşma başlatıldı</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-zinc-700 group-hover:text-zinc-400 transition-all transform group-hover:translate-x-0.5 duration-200 shrink-0">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
