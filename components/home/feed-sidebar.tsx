"use client";

import { TrendingUp, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { RapidScienceEditorModal } from "@/components/science-cards/rapid-science-editor-modal";
import { useState } from "react";

export function FeedSidebar() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            {/* Premium Join/Write Box */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-500 p-2 rounded-lg text-black">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Bilime Katkı Sağla</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Kendi makalelerini yaz, sorular sor ve bilim topluluğunun bir parçası ol.
                </p>
                <Link href="/yazar">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold border-0 shadow-lg shadow-amber-900/20">
                        İçerik Üretmeye Başla
                    </Button>
                </Link>

                {/* Rapid Science Button - For Writers */}
                <Button
                    variant="outline"
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full mt-3 border-amber-500/20 hover:bg-amber-500/10 text-amber-500 font-semibold"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Hızlı Bilim Paylaş
                </Button>
            </div>

            <RapidScienceEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />

            {/* Trending Topics (Simulation) */}
            <div className="bg-card/50 backdrop-blur-xl border border-foreground/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Gündemdekiler
                </h3>
                <div className="space-y-4">
                    {['Kuantum Fiziği', 'James Webb', 'Yapay Zeka', 'Kara Delikler'].map((topic, i) => (
                        <div key={topic} className="group cursor-pointer">
                            <div className="text-xs text-muted-foreground mb-0.5">Bilim · Gündem</div>
                            <div className="font-bold group-hover:text-emerald-500 transition-colors">#{topic.replace(/\s+/g, '')}</div>
                            <div className="text-xs text-muted-foreground">{1000 + i * 500} gönderi</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggested Writers (Simulation) */}
            <div className="bg-card/50 backdrop-blur-xl border border-foreground/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                    Takip Önerileri
                </h3>
                <div className="space-y-4">
                    {/* Placeholder users */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 border border-foreground/10">
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                                <div className="text-sm">
                                    <div className="font-bold hover:underline cursor-pointer">BilimSever{i}</div>
                                    <div className="text-muted-foreground text-xs">@bilim{i}</div>
                                </div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 rounded-full">Takip Et</Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground px-2">
                <Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link>
                <Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik</Link>
                <Link href="/iletisim" className="hover:underline">İletişim</Link>
                <span>© 2024 FizikHub</span>
            </div>
        </div>
    );
}
