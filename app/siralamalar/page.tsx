import { getLeaderboard } from "./actions";
import { LeaderboardCard } from "@/components/leaderboard/leaderboard-card";
import { createClient } from "@/lib/supabase-server";
import { Trophy } from "lucide-react";

export const metadata = {
    title: "Liderlik Tablosu | Fizikhub",
    description: "Fizikhub topluluğunun en aktif ve başarılı üyeleri.",
};

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="container max-w-4xl py-10 px-4 mx-auto">
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 rounded-full mb-4 ring-1 ring-yellow-500/20">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Liderlik Tablosu
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Topluluğa katkı sağlayarak puan toplayan en başarılı üyelerimiz.
                    Soru sorarak, cevap vererek ve test çözerek sıralamada yüksel!
                </p>
            </div>

            <div className="space-y-3">
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
