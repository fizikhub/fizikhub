import { getLeaderboard } from "./actions";
import { LeaderboardCard } from "@/components/leaderboard/leaderboard-card";
import { createClient } from "@/lib/supabase-server";
import { LeaderboardHeaderIcon } from "@/components/leaderboard/leaderboard-header-icon";
import { BreadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BackgroundWrapper } from "@/components/home/background-wrapper";

export const metadata = {
    title: "Liderlik Tablosu | Fizikhub",
    description: "Fizikhub topluluğunun en aktif ve başarılı üyeleri. Soru sorarak, cevap vererek ve test çözerek sıralamada yüksel!",
    openGraph: {
        title: "Liderlik Tablosu — Fizikhub",
        description: "Topluluğun en aktif ve başarılı üyeleri. Sıralamada yerinizi alın!",
        type: "website",
        url: "https://fizikhub.com/siralamalar",
    },
    twitter: {
        card: "summary",
        title: "Liderlik Tablosu — Fizikhub",
        description: "Topluluğun en aktif ve başarılı üyeleri.",
    },
    alternates: { canonical: "https://fizikhub.com/siralamalar" },
};

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Shy User Logic: Move @silginim to the bottom
    const silginimIndex = leaderboard.findIndex(u => u.username === 'silginim');
    let silginimUser = null;
    if (silginimIndex !== -1) {
        silginimUser = leaderboard[silginimIndex];
        leaderboard.splice(silginimIndex, 1);
        leaderboard.push(silginimUser);
    }

    return (
        <main className="min-h-screen bg-background relative selection:bg-yellow-500/30">
            <BackgroundWrapper />
            <BreadcrumbJsonLd items={[{ name: 'Sıralamalar', href: '/siralamalar' }]} />

            <div className="container max-w-5xl py-8 md:py-12 px-4 mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end mb-12">
                    <LeaderboardHeaderIcon silginimUser={silginimUser} />
                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-black dark:text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] dark:drop-shadow-none">
                            Liderlik Tablosu
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-bold max-w-2xl border-l-4 border-[#FACC15] pl-3 py-1">
                            Topluluğun yıldızları. Soru sor, cevapla, üret ve yüksel!
                        </p>
                    </div>
                </div>

                {/* Leaderboard Grid */}
                <div className="flex flex-col gap-4 pb-20">
                    {leaderboard.map((leaderboardUser) => (
                        <LeaderboardCard
                            key={leaderboardUser.id}
                            user={leaderboardUser}
                            currentUserId={user?.id}
                        />
                    ))}

                    {leaderboard.length === 0 && (
                        <div className="text-center py-20 bg-[#27272a] rounded-xl border-[3px] border-dashed border-zinc-700">
                            <p className="text-zinc-400 font-bold">Henüz sıralama verisi bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
