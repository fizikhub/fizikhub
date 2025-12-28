import { getLeaderboard } from "./actions";
import { LeaderboardCard } from "@/components/leaderboard/leaderboard-card";
import { createClient } from "@/lib/supabase-server";
import { LeaderboardHeaderIcon } from "@/components/leaderboard/leaderboard-header-icon";

export const metadata = {
    title: "Liderlik Tablosu | Fizikhub",
    description: "Fizikhub topluluğunun en aktif ve başarılı üyeleri.",
};

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Shy User Logic: Move @silginim to the bottom
    const silginimIndex = leaderboard.findIndex(u => u.username === 'silginim');
    if (silginimIndex !== -1) {
        const silginim = leaderboard[silginimIndex];
        leaderboard.splice(silginimIndex, 1);
        leaderboard.push(silginim);
    }

    return (
        <div className="container max-w-5xl py-12 px-4 mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row gap-8 items-end mb-12 border-b-4 border-black dark:border-white pb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <LeaderboardHeaderIcon />
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                            Liderlik Tablosu
                        </h1>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                        Topluluğa katkı sağlayarak puan toplayan en başarılı üyelerimiz.
                        Soru sorarak, cevap vererek ve test çözerek sıralamada yüksel!
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {leaderboard.map((leaderboardUser) => (
                    <LeaderboardCard
                        key={leaderboardUser.id}
                        user={leaderboardUser}
                        currentUserId={user?.id}
                    />
                ))}

                {leaderboard.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Henüz sıralama verisi bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
}
