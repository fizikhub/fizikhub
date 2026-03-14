"use client";

import { UserPlus, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/profile/follow-button";

import dynamic from "next/dynamic";
const RapidScienceEditorModal = dynamic(() => import("@/components/science-cards/rapid-science-editor-modal").then(m => m.RapidScienceEditorModal), { ssr: false });
import { useState } from "react";

export function FeedSidebar({ suggestedUsers = [] }: { suggestedUsers?: any[] }) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            {/* Premium Join/Write Box - Neo Brutalist Style */}
            <div className="bg-gradient-to-br from-[#f08a41] to-[#e67a30] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] p-6 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.08)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-[#FFBD2E] p-2 rounded-lg text-black border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                            <Sparkles className="w-5 h-5 fill-current" />
                        </div>
                        <h3 className="font-black text-xl text-black uppercase tracking-tight">Bilime Katkı Sağla</h3>
                    </div>
                    <p className="text-sm text-black/80 font-bold mb-4 leading-relaxed">
                        Kendi makalelerini yaz, sorular sor ve bilim topluluğunun bir parçası ol.
                    </p>
                    <ViewTransitionLink href="/yazar" className="block outline-none">
                        <Button className="w-full bg-white hover:bg-neutral-50 text-black font-black border-[2.5px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg h-11 uppercase text-sm">
                            İçerik Üretmeye Başla
                        </Button>
                    </ViewTransitionLink>

                    {/* Rapid Science Button */}
                    <Button
                        variant="outline"
                        onClick={() => setIsEditorOpen(true)}
                        className="w-full mt-3 bg-black hover:bg-black/90 text-white font-black border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-lg h-11 uppercase text-sm group"
                    >
                        <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Hızlı Bilim Paylaş
                    </Button>
                </div>
            </div>

            <RapidScienceEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />

            {/* Suggested Writers */}
            <div className="bg-white dark:bg-[#1e1e21] border-[2.5px] border-black dark:border-zinc-700 rounded-[10px] p-5 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)]">
                <h3 className="font-black text-base mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <UserPlus className="w-5 h-5 text-[#FFBD2E]" />
                    Takip Önerileri
                </h3>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {suggestedUsers && suggestedUsers.length > 0 ? (
                        suggestedUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center gap-3 justify-between group p-2 -mx-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <Link href={`/kullanici/${user.username}`} className="flex items-center gap-3 overflow-hidden flex-1 relative z-10 outline-none">
                                    <Avatar className="w-10 h-10 shrink-0 border-[2px] border-black dark:border-zinc-600 rounded-full shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.06)]">
                                        <AvatarImage src={user.avatar_url || undefined} alt={user.username || ""} className="object-cover" />
                                        <AvatarFallback className="bg-[#FFBD2E]/20 dark:bg-[#FFBD2E]/10 text-foreground font-black text-sm">
                                            {user.avatar_url ? null : <User className="w-4 h-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm min-w-0 pr-2">
                                        <div className="font-bold truncate group-hover:text-[#FFBD2E] transition-colors text-foreground">{user.full_name || user.username}</div>
                                        <div className="text-neutral-400 dark:text-zinc-500 text-xs truncate font-medium">@{user.username}</div>
                                    </div>
                                </Link>
                                <div className="shrink-0 relative z-20">
                                    <FollowButton targetUserId={user.id} initialIsFollowing={false} variant="outline" className="h-8 rounded-lg text-xs font-bold px-3 border-[2px] border-black dark:border-zinc-600 shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.06)] hover:bg-[#FFBD2E] hover:text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-neutral-400 dark:text-zinc-500 text-center py-4 font-medium">
                            Şu an önerilecek yazar bulunamadı.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-neutral-400 dark:text-zinc-500 px-2">
                <ViewTransitionLink href="/hakkimizda" className="hover:text-foreground transition-colors hover:underline">Hakkımızda</ViewTransitionLink>
                <ViewTransitionLink href="/gizlilik-politikasi" className="hover:text-foreground transition-colors hover:underline">Gizlilik Politikası</ViewTransitionLink>
                <ViewTransitionLink href="/iletisim" className="hover:text-foreground transition-colors hover:underline">İletişim</ViewTransitionLink>
                <span className="opacity-70">© 2025 FizikHub</span>
            </div>
        </div>
    );
}
