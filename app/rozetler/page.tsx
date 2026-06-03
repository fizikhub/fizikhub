import { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { Award, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { CustomBadgeIcon } from "@/components/profile/custom-badge-icon";
import { DEFAULT_BADGES, getBadgeCategoryTitle, getBadgeRequirementLabel } from "@/lib/badges";

export const metadata: Metadata = {
    title: "Rozetler",
    description: "FizikHub'daki tüm rozetleri keşfet. Bilim kahramanlarından ilham alan rozetleri nasıl kazanabileceğini öğren.",
    openGraph: {
        title: "Rozetler — FizikHub",
        description: "20 efsanevi rozeti topla, bilim yolculuğunda ilerle.",
        type: "website",
        url: "https://www.fizikhub.com/rozetler",
    },
    alternates: {
        canonical: "https://www.fizikhub.com/rozetler",
        languages: {
            "tr-TR": "https://www.fizikhub.com/rozetler",
            "x-default": "https://www.fizikhub.com/rozetler",
        },
    },
};

type BadgeRow = {
    id: number | string;
    category?: string | null;
    name: string;
    description?: string | null;
    requirement_type?: string | null;
    requirement_value?: number | null;
};

export default async function RozetlerPage() {
    const supabase = await createClient();
    const { data: badges, error } = await supabase
        .from("badges")
        .select("*")
        .order("requirement_value", { ascending: true });
    const hasLiveBadges = !error && Boolean(badges?.length);
    const badgeRows = (hasLiveBadges ? badges : DEFAULT_BADGES) as BadgeRow[];
    const catalogNotice = error
        ? "Canlı rozet kataloğu şu an okunamadı; temel rozet listesi gösteriliyor."
        : !hasLiveBadges
            ? "Rozet kataloğu henüz boş; temel rozet listesi gösteriliyor."
            : null;

    // Rozetleri kategoriye göre grupla
    const grouped: Record<string, BadgeRow[]> = {};
    badgeRows.forEach((b) => {
        const cat = getBadgeCategoryTitle(b.category);
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(b);
    });

    const categoryOrder = Object.keys(grouped);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 md:py-16 px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-10 md:mb-16">
                    <Link
                        href="/profil"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground mb-6 border-2 border-black/20 dark:border-white/20 px-3 py-1.5 rounded-lg hover:border-black dark:hover:border-white transition-all group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Profile Dön
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#23A9FA] text-white border-[3px] border-black rounded-xl shadow-[4px_4px_0px_#000]">
                            <Award className="w-8 h-8 stroke-[2.5px]" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                                Rozetler
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground font-medium mt-1">
                                Toplam <span className="font-black text-foreground">{badgeRows.length}</span> rozet mevcut
                            </p>
                            {catalogNotice && (
                                <p className="mt-2 text-xs font-bold text-muted-foreground">
                                    {catalogNotice}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="h-1 w-full bg-gradient-to-r from-[#23A9FA] via-purple-500 to-[#EAB308] rounded-full" />
                </div>

                {/* Kategori Grupları */}
                <div className="space-y-12">
                    {categoryOrder.map((catLabel) => {
                        const catBadges = grouped[catLabel];
                        if (!catBadges || catBadges.length === 0) return null;

                        return (
                            <section key={catLabel}>
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight inline-block bg-foreground text-background px-4 py-1.5 -rotate-1 shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]">
                                        {catLabel}
                                    </h2>
                                    <div className="h-[3px] flex-1 bg-border" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {catBadges.map((badge) => {
                                        const requirementValue = badge.requirement_value ?? 0;
                                        const requirementLabel = getBadgeRequirementLabel(badge.requirement_type, requirementValue);

                                        return (
                                            <div
                                                key={badge.id}
                                                className="group relative bg-card border-2 border-black dark:border-zinc-700 rounded-xl p-5 flex items-start gap-4 hover:shadow-[6px_6px_0px_#000] dark:hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all overflow-hidden"
                                            >
                                                {/* İkon */}
                                                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <CustomBadgeIcon name={badge.name} />
                                                </div>

                                                {/* Bilgi */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-black text-base md:text-lg uppercase tracking-tight text-foreground mb-1 truncate">
                                                        {badge.name}
                                                    </h3>
                                                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                        {badge.description}
                                                    </p>

                                                    {/* Kazanım Koşulu */}
                                                    {badge.requirement_type !== "manual" && requirementLabel && requirementValue > 0 && (
                                                        <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                                                            <Star className="w-3 h-3" />
                                                            {requirementLabel}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
