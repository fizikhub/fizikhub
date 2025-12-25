
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
    BadgeCheck,
    BookOpen,
    Atom
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";

export default function PointsInfoPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            {/* Header */}
            <div className="mb-12 border-b-4 border-black dark:border-white pb-8">
                <Link href="/profil">
                    <Button variant="outline" className="mb-6 border-2 border-black dark:border-white rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase font-bold tracking-wider">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Profile Dön
                    </Button>
                </Link>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 flex items-center gap-4">
                    <Trophy className="h-12 w-12 md:h-16 md:w-16" strokeWidth={2} />
                    Hub Puan Sistemi
                </h1>
                <p className="text-xl font-mono text-muted-foreground max-w-2xl bg-muted/20 p-4 border-l-4 border-primary">
                    Bilim topluluğuna katkıda bulun, rütbeni yükselt ve evrenin sırlarını çözen seçkin üyeler arasına katıl.
                </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
                {/* Nasıl Puan Kazanılır? */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-none">
                            <Target className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Nasıl Puan Kazanılır?</h2>
                    </div>

                    <div className="grid gap-4">
                        {/* Article */}
                        <div className="group border-2 border-black dark:border-white p-4 hover:-translate-y-1 transition-transform bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-black text-white dark:bg-white dark:text-black font-black font-mono text-xl">
                                +20
                            </div>
                            <div className="flex items-start gap-4">
                                <BookOpen className="h-8 w-8 mt-1" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-lg uppercase mb-1">Makale Yazmak</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Blogda onaylanan her bilimsel makalen için.</p>
                                </div>
                            </div>
                        </div>

                        {/* Accepted Answer */}
                        <div className="group border-2 border-black dark:border-white p-4 hover:-translate-y-1 transition-transform bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-black text-white dark:bg-white dark:text-black font-black font-mono text-xl">
                                +15
                            </div>
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-8 w-8 mt-1 text-green-600 dark:text-green-400" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-lg uppercase mb-1">Cevap Onayı</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Verdiğin cevap soruyu soran kişi tarafından "Çözüm" olarak işaretlenirse.</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer */}
                        <div className="group border-2 border-black dark:border-white p-4 hover:-translate-y-1 transition-transform bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-black text-white dark:bg-white dark:text-black font-black font-mono text-xl">
                                +10
                            </div>
                            <div className="flex items-start gap-4">
                                <MessageSquare className="h-8 w-8 mt-1" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-lg uppercase mb-1">Cevap Yazmak</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Bir soruya bilimsel ve açıklayıcı bir cevap verdiğinde.</p>
                                </div>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="group border-2 border-black dark:border-white p-4 hover:-translate-y-1 transition-transform bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-black text-white dark:bg-white dark:text-black font-black font-mono text-xl">
                                +5
                            </div>
                            <div className="flex items-start gap-4">
                                <Target className="h-8 w-8 mt-1" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-lg uppercase mb-1">Soru Sormak</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Topluluğa yeni ve özgün bir fizik sorusu sorduğunda.</p>
                                </div>
                            </div>
                        </div>

                        {/* Like */}
                        <div className="group border-2 border-black dark:border-white p-4 hover:-translate-y-1 transition-transform bg-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-black text-white dark:bg-white dark:text-black font-black font-mono text-xl">
                                +5
                            </div>
                            <div className="flex items-start gap-4">
                                <ThumbsUp className="h-8 w-8 mt-1" strokeWidth={1.5} />
                                <div>
                                    <h3 className="font-bold text-lg uppercase mb-1">Beğeni Almak</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Cevabın veya sorun başka bir üye tarafından beğenilirse.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rütbeler */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-none">
                            <Crown className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Rütbe Sistemi</h2>
                    </div>

                    <div className="relative border-l-4 border-dashed border-muted ml-4 space-y-8 py-2">
                        {/* Evrensel Zeka */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[1.35rem] top-0 bg-background border-4 border-black dark:border-white p-1 rounded-full">
                                <div className="w-6 h-6"><CustomBadgeIcon name="evrensel" /></div>
                            </div>
                            <div className="border border-black dark:border-white p-4 bg-muted/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase text-sky-600 dark:text-sky-400">Evrensel Zeka</h3>
                                    <span className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 px-2 py-1 font-mono text-xs font-bold uppercase">5000+ Puan</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    FizikHub'ın zirvesi. Topluluğun en bilge ve saygıdeğer üyesi.
                                </p>
                            </div>
                        </div>

                        {/* Teorisyen */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[1.35rem] top-0 bg-background border-4 border-black dark:border-white p-1 rounded-full">
                                <div className="w-6 h-6"><CustomBadgeIcon name="teorisyen" /></div>
                            </div>
                            <div className="border border-black dark:border-white p-4 bg-muted/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase text-amber-600 dark:text-amber-400">Teorisyen</h3>
                                    <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 font-mono text-xs font-bold uppercase">1000+ Puan</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    Karmaşık konuları basitleştiren, derin öngörülere sahip üye.
                                </p>
                            </div>
                        </div>

                        {/* Araştırmacı */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[1.35rem] top-0 bg-background border-4 border-black dark:border-white p-1 rounded-full">
                                <div className="w-6 h-6"><CustomBadgeIcon name="araştırmacı" /></div>
                            </div>
                            <div className="border border-black dark:border-white p-4 bg-muted/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase text-purple-600 dark:text-purple-400">Araştırmacı</h3>
                                    <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 font-mono text-xs font-bold uppercase">500+ Puan</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    Bilgiye aç, sürekli sorgulayan ve katkı sağlayan üye.
                                </p>
                            </div>
                        </div>

                        {/* Gözlemci */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[1.35rem] top-0 bg-background border-4 border-black dark:border-white p-1 rounded-full">
                                <div className="w-6 h-6"><CustomBadgeIcon name="gözlemci" /></div>
                            </div>
                            <div className="border border-black dark:border-white p-4 bg-muted/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase text-blue-600 dark:text-blue-400">Gözlemci</h3>
                                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 font-mono text-xs font-bold uppercase">100+ Puan</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    Topluluğu izleyen, öğrenen ve ilk adımlarını atan üye.
                                </p>
                            </div>
                        </div>

                        {/* Çaylak */}
                        <div className="relative pl-8">
                            <div className="absolute -left-[1.35rem] top-0 bg-background border-4 border-black dark:border-white p-1 rounded-full">
                                <div className="w-6 h-6"><CustomBadgeIcon name="çaylak" /></div>
                            </div>
                            <div className="border border-black dark:border-white p-4 bg-muted/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase text-green-600 dark:text-green-400">Çaylak</h3>
                                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 font-mono text-xs font-bold uppercase">0+ Puan</span>
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    Yolculuğun başlangıcı. Meraklı bir zihin.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Özel Rozetler */}
            <div className="mt-16" id="rozetler">
                <div className="flex items-center gap-3 mb-8 border-b-4 border-black dark:border-white pb-4">
                    <div className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-none">
                        <BadgeCheck className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Efsanevi Rozetler</h2>
                </div>

                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* Badge Helper Component */}
                    {[
                        { name: "Kaşif", icon: "kaşif", desc: "İlk sorusunu soran meraklı zihin." },
                        { name: "Yardımsever", icon: "yardımsever", desc: "İlk cevabını veren yardımsever üye." },
                        { name: "Einstein", icon: "einstein", desc: "50 soru ile bilim merakını yayan deha." },
                        { name: "Newton", icon: "newton", desc: "10 soru ile yerçekimine meydan okuyan." },
                        { name: "Tesla", icon: "tesla", desc: "50 cevap ile elektriği havada hissettiren." },
                        { name: "Curie", icon: "curie", desc: "10 cevap ile radyoaktif bilgi yayan." },
                        { name: "Hawking", icon: "hawking", desc: "100+ beğeni ile kara deliklerin efendisi." },
                        { name: "Galileo", icon: "galileo", desc: "20+ beğeni ile yıldızları keşfeden." },
                        { name: "Da Vinci", icon: "vinci", desc: "30+ beğeni ile bilimi sanata dönüştüren." },
                        { name: "Yazar", icon: "yazar", desc: "Kelimeleriyle bilime yön veren blog yazarı." },
                    ].map((badge) => (
                        <div key={badge.name} className="group relative bg-card border-2 border-dashed border-black dark:border-white/50 p-6 flex flex-col items-center text-center hover:border-solid hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                            <div className="w-20 h-20 mb-4 transition-transform group-hover:scale-110 duration-300 drop-shadow-lg">
                                <CustomBadgeIcon name={badge.icon} />
                            </div>
                            <h3 className="font-black text-lg uppercase mb-2">{badge.name}</h3>
                            <p className="text-xs font-mono text-muted-foreground">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
