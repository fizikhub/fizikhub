import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    MessageSquare,
    CheckCircle2,
    ThumbsUp,
    Crown,
    Sparkles,
    Zap,
    Target,
    ArrowLeft,
    BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";

export default function PointsInfoPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-8">
                <Link href="/profil">
                    <Button variant="ghost" className="gap-2 pl-0 hover:pl-0 hover:bg-transparent">
                        <ArrowLeft className="h-4 w-4" />
                        Profile Dön
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mt-4 flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    Hub Puan Sistemi
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    FizikHub topluluğuna katkıda bulunarak puan kazanın ve rütbenizi yükseltin.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Nasıl Puan Kazanılır? */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Nasıl Puan Kazanılır?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Cevap Kabul Edilmesi</h3>
                                <p className="text-sm text-muted-foreground">Verdiğiniz cevap soruyu soran kişi tarafından kabul edilirse.</p>
                                <Badge variant="secondary" className="mt-2 text-green-600 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                    +15 Puan
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <ThumbsUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Cevap Beğenilmesi</h3>
                                <p className="text-sm text-muted-foreground">Verdiğiniz cevap başka bir kullanıcı tarafından beğenilirse.</p>
                                <Badge variant="secondary" className="mt-2 text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                    +5 Puan
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Cevap Yazmak</h3>
                                <p className="text-sm text-muted-foreground">Bir soruya cevap verdiğinizde.</p>
                                <Badge variant="secondary" className="mt-2 text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                    +10 Puan
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Soru Sormak</h3>
                                <p className="text-sm text-muted-foreground">Topluluğa yeni bir soru sorduğunuzda.</p>
                                <Badge variant="secondary" className="mt-2 text-purple-600 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                                    +2 Puan
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rütbeler */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-yellow-500" />
                            Rütbeler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50">
                            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                                <Crown className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-amber-700 dark:text-amber-400">Efsane</h3>
                                    <span className="text-xs font-mono bg-amber-100 dark:bg-amber-900/50 px-2 py-1 rounded text-amber-700 dark:text-amber-400">1000+ Puan</span>
                                </div>
                                <p className="text-sm text-amber-600/80 dark:text-amber-500/80 mt-1">Topluluğun en değerli üyeleri.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900/50">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-purple-700 dark:text-purple-400">Uzman</h3>
                                    <span className="text-xs font-mono bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded text-purple-700 dark:text-purple-400">500+ Puan</span>
                                </div>
                                <p className="text-sm text-purple-600/80 dark:text-purple-500/80 mt-1">Konusuna hakim, güvenilir üyeler.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-blue-700 dark:text-blue-400">Aktif</h3>
                                    <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-700 dark:text-blue-400">100+ Puan</span>
                                </div>
                                <p className="text-sm text-blue-600/80 dark:text-blue-500/80 mt-1">Düzenli katkı sağlayan üyeler.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800">
                            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                <Target className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-700 dark:text-gray-400">Yeni</h3>
                                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-400">0+ Puan</span>
                                </div>
                                <p className="text-sm text-gray-600/80 dark:text-gray-500/80 mt-1">Yolculuğun başlangıcı.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Özel Rozetler Section */}
            <div className="mt-8" id="rozetler">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                            Özel Rozetler
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Kaşif Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="kaşif" />
                                </div>
                                <h3 className="font-bold mb-1">Kaşif</h3>
                                <p className="text-xs text-muted-foreground">İlk sorusunu soran meraklı zihinlere verilir.</p>
                            </div>

                            {/* Yardımsever Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="yardımsever" />
                                </div>
                                <h3 className="font-bold mb-1">Yardımsever</h3>
                                <p className="text-xs text-muted-foreground">İlk cevabını veren yardımsever üyelere verilir.</p>
                            </div>

                            {/* Einstein Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="einstein" />
                                </div>
                                <h3 className="font-bold mb-1">Einstein</h3>
                                <p className="text-xs text-muted-foreground">50 soru ile bilim merakını yayanlara verilir.</p>
                            </div>

                            {/* Newton Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="newton" />
                                </div>
                                <h3 className="font-bold mb-1">Newton</h3>
                                <p className="text-xs text-muted-foreground">10 soru sorarak topluluğu canlandıranlara verilir.</p>
                            </div>

                            {/* Tesla Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="tesla" />
                                </div>
                                <h3 className="font-bold mb-1">Tesla</h3>
                                <p className="text-xs text-muted-foreground">50 cevap ile bilgiyi yaymaya adananlara verilir.</p>
                            </div>

                            {/* Writer Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="yazar" />
                                </div>
                                <h3 className="font-bold mb-1">Yazar</h3>
                                <p className="text-xs text-muted-foreground">Blog yazılarıyla katkı sağlayanlara verilir.</p>
                            </div>

                            {/* Curie Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="curie" />
                                </div>
                                <h3 className="font-bold mb-1">Curie</h3>
                                <p className="text-xs text-muted-foreground">10 cevap vererek bilgiyi paylaşanlara verilir.</p>
                            </div>

                            {/* Galileo Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="galileo" />
                                </div>
                                <h3 className="font-bold mb-1">Galileo</h3>
                                <p className="text-xs text-muted-foreground">Cevaplarıyla 20+ beğeni kazanan gözlemcilere verilir.</p>
                            </div>

                            {/* Hawking Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="hawking" />
                                </div>
                                <h3 className="font-bold mb-1">Hawking</h3>
                                <p className="text-xs text-muted-foreground">100+ beğeniyle evrenin sırlarını açanlara verilir.</p>
                            </div>

                            {/* Da Vinci Badge */}
                            <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 mb-3">
                                    <CustomBadgeIcon name="vinci" />
                                </div>
                                <h3 className="font-bold mb-1">Da Vinci</h3>
                                <p className="text-xs text-muted-foreground">30+ beğeniyle yaratıcı sorular soranlara verilir.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}
