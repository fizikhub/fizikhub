import { Metadata } from "next";
import { SpaceBomberGame } from "@/components/nevbara/space-bomber-game";

export const metadata: Metadata = {
    title: "Gravity Warrior | Fizikhub",
    description: "Fizik tabanlı uzay savaş simülasyonu. Yerçekimine karşı savaş, düşmanları yok et.",
};

export default function NevbaraPage() {
    return (
        <main className="min-h-screen py-8 px-4 bg-background">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2 glitch-effect">
                        NEVBARA: GRAVITY WARRIOR
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Uyarı: Bu simülasyon gerçek fizik motoru kullanır. İtki (Thrust) ve Momentum (Eylemsizlik) kurallarına dikkat etmelisin. Sadece en iyi pilotlar hayatta kalabilir.
                    </p>
                </div>

                <SpaceBomberGame />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
                    <div className="p-4 border rounded bg-card/50">
                        <strong className="block text-foreground mb-1">Fizik Motoru</strong>
                        Yerçekimi, sürtünme ve itki vektörleri tamamen simüle edilmiştir.
                    </div>
                    <div className="p-4 border rounded bg-card/50">
                        <strong className="block text-foreground mb-1">Yakıt Yönetimi</strong>
                        Sınırlı yakıtını idareli kullan. Gereksiz manevralardan kaçın.
                    </div>
                    <div className="p-4 border rounded bg-card/50">
                        <strong className="block text-foreground mb-1">Çarpışma Riski</strong>
                        Yere çok hızlı çarparsan gemin parçalanır. Yumuşak iniş yapmayı öğren.
                    </div>
                </div>
            </div>
        </main>
    );
}
