"use client";

import { TrendingUp, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { RapidScienceEditorModal } from "@/components/science-cards/rapid-science-editor-modal";
import { useState } from "react";

export function FeedSidebar() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            {/* Premium Join/Write Box */}
            <div className="bg-yellow-400 border-2 border-black rounded-xl p-6 shadow-neo relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="w-24 h-24 text-black rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-black text-yellow-400 p-2 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-xl text-black uppercase tracking-tight">Bilime Katkı Yap</h3>
                    </div>
                    <p className="text-sm text-black font-bold mb-5 leading-relaxed max-w-[90%]">
                        Makale yaz, soru sor, tartışmalara katıl. Burası senin laboratuvarın.
                    </p>
                    <ViewTransitionLink href="/yazar">
                        <Button className="w-full bg-black text-white hover:bg-neutral-800 font-bold border-2 border-transparent hover:border-white/20 h-10 shadow-none">
                            İçerik Üretmeye Başla
                        </Button>
                    </ViewTransitionLink>

                    {/* Rapid Science Button */}
                    <Button
                        variant="ghost"
                        onClick={() => setIsEditorOpen(true)}
                        className="w-full mt-3 border-2 border-black bg-white text-black hover:bg-neutral-100 font-bold shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
                    >
                        Hızlı Paylaşım Yap
                    </Button>
                </div>
            </div>

            <RapidScienceEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />

            {/* Trending Topics */}
            <div className="bg-background border-2 border-foreground rounded-xl p-6 shadow-neo">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-tight border-b-2 border-foreground/10 pb-4">
                    <TrendingUp className="w-5 h-5" />
                    Gündem
                </h3>
                <div className="space-y-4">
                    {['Kuantum Fiziği', 'James Webb', 'Yapay Zeka', 'Kara Delikler'].map((topic, i) => (
                        <div key={topic} className="group cursor-pointer flex justify-between items-center hover:bg-foreground/5 p-2 -mx-2 rounded-lg transition-colors">
                            <div>
                                <div className="font-bold group-hover:translate-x-1 transition-transform">#{topic.replace(/\s+/g, '')}</div>
                                <div className="text-xs text-muted-foreground font-mono">{1000 + i * 500} posts</div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Writers */}
            <div className="bg-background border-2 border-foreground rounded-xl p-6 shadow-neo">
                <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-tight border-b-2 border-foreground/10 pb-4">
                    <UserPlus className="w-5 h-5" />
                    Takip Et
                </h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 justify-between group">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border-2 border-foreground rounded-md shadow-[2px_2px_0_0_currentColor]">
                                    <AvatarFallback className="font-bold bg-purple-500 text-white">U{i}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <div className="font-bold hover:underline cursor-pointer">BilimSever{i}</div>
                                    <div className="text-muted-foreground text-xs font-mono">@bilim{i}</div>
                                </div>
                            </div>
                            <Button size="sm" className="h-8 rounded-md border-2 border-foreground font-bold shadow-[2px_2px_0_0_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_currentColor] transition-all bg-background text-foreground hover:bg-foreground hover:text-background">
                                +
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground px-2">
                <ViewTransitionLink href="/hakkimizda" className="hover:underline">Hakkımızda</ViewTransitionLink>
                <ViewTransitionLink href="/gizlilik-politikasi" className="hover:underline">Gizlilik</ViewTransitionLink>
                <ViewTransitionLink href="/iletisim" className="hover:underline">İletişim</ViewTransitionLink>
                <span>© 2024 FizikHub</span>
            </div>
        </div>
    );
}
