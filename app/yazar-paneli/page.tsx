import { getPendingArticles } from "./actions";
import { AuthorPanelClient } from "./client-page";
import Link from "next/link";
import { BookOpen, PenSquare, FileText, Bot, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function YazarPaneliPage() {
    const { articles, error } = await getPendingArticles();

    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-black mb-4">Erişim Reddedildi</h1>
                <p className="text-zinc-400">{error}</p>
            </div>
        );
    }

    const totalCount = articles?.length || 0;
    const aiReviewedCount = articles?.filter((a: any) => a.aiScore != null).length || 0;
    const highScoreCount = articles?.filter((a: any) => a.aiScore != null && a.aiScore >= 80).length || 0;
    const almostReadyCount = articles?.filter((a: any) => a.approvalCount >= 3).length || 0;

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Yazar Ekibi Paneli</h1>
                        <p className="text-zinc-400">
                            İncelenmeyi bekleyen makaleleri onaylayın. 4 yazar onayı alan makaleler otomatik olarak yayınlanır.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 flex-shrink-0">
                        <Link href="/yazar/yeni">
                            <Button className="font-black border-2 border-black dark:border-zinc-800 bg-[#FFBD2E] text-black hover:bg-[#FFD268] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-11 px-5">
                                <PenSquare className="w-4 h-4 mr-2" />
                                Yazı Yaz
                            </Button>
                        </Link>
                        
                        <Link href="/yazar-paneli/manifesto">
                            <Button variant="outline" className="font-bold border-2 border-black dark:border-zinc-800 h-11 px-5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Yazar Rehberi
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{totalCount}</div>
                                <div className="text-[11px] text-muted-foreground font-medium">Bekleyen Makale</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-violet-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{aiReviewedCount}</div>
                                <div className="text-[11px] text-muted-foreground font-medium">AI İncelendi</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{highScoreCount}</div>
                                <div className="text-[11px] text-muted-foreground font-medium">Yüksek Puan (80+)</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-background border-2 border-black dark:border-zinc-800 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-black">{almostReadyCount}</div>
                                <div className="text-[11px] text-muted-foreground font-medium">Yayına Yakın (3+ onay)</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <AuthorPanelClient initialArticles={articles || []} />
            </div>
        </main>
    );
}
