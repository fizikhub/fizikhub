"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { haptics } from "@/lib/haptics";
import { celebrate } from "@/lib/confetti";
import { LazyImage } from "@/components/ui/lazy-image";

export function UXFeaturesShowcase() {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        // Optimistic UI + Haptic Feedback
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        // Haptic feedback on mobile
        haptics.light();
    };

    const handleFirstAnswer = () => {
        celebrate.firstAnswer();
        haptics.success();
    };

    const handleBadgeUnlock = () => {
        celebrate.badgeUnlock();
        haptics.heavy();
    };

    return (
        <div className="container py-12 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">🎉 Gelişmiş UX Özellikleri</h1>
                <p className="text-muted-foreground">
                    Optimistic UI, Lazy Loading, Konfeti ve Haptic Feedback
                </p>
            </div>

            {/* Optimistic UI + Haptic Demo */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">⚡ Optimistic UI + Haptic</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                        <Heart
                            className={isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                        />
                        <span>{likes}</span>
                    </button>
                    <p className="text-sm text-muted-foreground">
                        Tıkladığında anında UI güncellenir + titreşim hissedersin (mobil)
                    </p>
                </div>
            </Card>

            {/* Confetti Demos */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">🎊 Konfeti Kutlamaları</h2>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={handleFirstAnswer} variant="default">
                        🎉 İlk Cevap
                    </Button>
                    <Button onClick={handleBadgeUnlock} variant="secondary">
                        🏆 Rozet Kazandın
                    </Button>
                    <Button onClick={() => celebrate.levelUp()} variant="outline">
                        ⬆️ Seviye Atladın
                    </Button>
                    <Button onClick={() => celebrate.success()} variant="ghost">
                        ✅ Başarı
                    </Button>
                </div>
            </Card>

            {/* Lazy Loading Demo */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">🖼️ Lazy Loading Görseller</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <LazyImage
                            key={i}
                            src={`https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=entropy`}
                            alt={`Demo image ${i}`}
                            width={400}
                            height={300}
                            className="rounded-lg aspect-video"
                        />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    Görseller sadece ekrana girdiklerinde yüklenir, blur efekti ile
                </p>
            </Card>

            {/* Haptic Tests */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">📳 Haptic Feedback (Mobil)</h2>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={() => haptics.light()}>Hafif</Button>
                    <Button onClick={() => haptics.medium()}>Orta</Button>
                    <Button onClick={() => haptics.heavy()}>Kuvvetli</Button>
                    <Button onClick={() => haptics.success()} variant="default">Başarı</Button>
                    <Button onClick={() => haptics.error()} variant="destructive">Hata</Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    Telefonunuzda titreşim hissedeceksiniz
                </p>
            </Card>
        </div>
    );
}
