"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimationShowcase() {
    const [isLiked, setIsLiked] = useState(false);
    const [clicks, setClicks] = useState(0);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setClicks(c => c + 1);
    };

    return (
        <div className="container py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold animate-fade-in">
                    🎨 Mikro-Animasyon Vitrini
                </h1>
                <p className="text-muted-foreground animate-slide-up">
                    Premium hisset, her tıklama önemlidir
                </p>
            </div>

            {/* Like Button with Heart Animation */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">❤️ Beğeni Butonu</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "p-4 rounded-full transition-all duration-300",
                            isLiked
                                ? "bg-red-100 dark:bg-red-900/20 text-red-600 animate-heart-beat"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        )}
                    >
                        <Heart
                            className={cn(
                                "h-8 w-8 transition-transform duration-200",
                                isLiked && "fill-current scale-110"
                            )}
                        />
                    </button>
                    <div className="text-sm text-muted-foreground">
                        {isLiked ? "Beğendin! ❤️" : "Beğenmek için tıkla"}
                        <br />
                        <span className="text-xs">Tıklama: {clicks}</span>
                    </div>
                </div>
            </Card>

            {/* Interactive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="interactive-lift p-6 cursor-pointer">
                    <h3 className="font-semibold mb-2">🚀 Lift Effect</h3>
                    <p className="text-sm text-muted-foreground">
                        Fareyi üzerine getir, tıkla
                    </p>
                </Card>

                <Card className="interactive-scale p-6 cursor-pointer">
                    <h3 className="font-semibold mb-2">📏 Scale Effect</h3>
                    <p className="text-sm text-muted-foreground">
                        Hafifçe büyür ve küçülür
                    </p>
                </Card>

                <Card className="interactive-glow p-6 cursor-pointer">
                    <h3 className="font-semibold mb-2">✨ Glow Effect</h3>
                    <p className="text-sm text-muted-foreground">
                        Işıltılı bir aura
                    </p>
                </Card>
            </div>

            {/* Button Variants */}
            <Card className="p-8">
                <h2 className="text-2xl font-semibold mb-6">🎯 Buton Varyantları</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Varsayılan</Button>
                    <Button variant="secondary">İkincil</Button>
                    <Button variant="destructive">Yıkıcı</Button>
                    <Button variant="outline">Kontur</Button>
                    <Button variant="ghost">Hayalet</Button>
                    <Button variant="secondary" className="border-cyan-500 text-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        <Zap className="mr-2 h-4 w-4" />
                        Neon
                    </Button>
                </div>
            </Card >

            {/* Animated List */}
            < Card className="p-8" >
                <h2 className="text-2xl font-semibold mb-6">📋 Animasyonlu Liste</h2>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((item, index) => (
                        <div
                            key={item}
                            className="p-4 bg-muted rounded-lg interactive-scale cursor-pointer"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Star className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Liste Öğesi #{item}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Hover efekti var
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card >
        </div >
    );
}
