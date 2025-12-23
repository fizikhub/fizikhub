"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, TrendingDown, TrendingUp, Coins } from "lucide-react";
import { playSlot, getUserBalance } from "@/app/slot/actions";
import confetti from "canvas-confetti";

const SYMBOLS = ["🚀", "⚛️", "🔬", "🧪", "🌟"];
const BET_AMOUNT = 5;

interface SlotResult {
    matchType: string;
    multiplier: number;
    winnings: number;
    netChange: number;
    newBalance: number;
}

export function SlotMachine() {
    const [reels, setReels] = useState<[string, string, string]>(["🚀", "⚛️", "🔬"]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<SlotResult | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        const { balance, error } = await getUserBalance();
        if (error) {
            setError(error);
        } else {
            setBalance(balance);
        }
    };

    const spin = async () => {
        if (isSpinning) return;
        if (balance < BET_AMOUNT) {
            setError(`Yetersiz bakiye! En az ${BET_AMOUNT} hubpuan gerekli.`);
            return;
        }

        setIsSpinning(true);
        setShowResult(false);
        setError(null);

        // Animasyon için rastgele sembolleri göster
        const spinDuration = 2000;
        const intervalTime = 100;
        let elapsed = 0;

        const spinInterval = setInterval(() => {
            setReels([
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            ]);
            elapsed += intervalTime;

            if (elapsed >= spinDuration) {
                clearInterval(spinInterval);
            }
        }, intervalTime);

        // Sunucu tarafında çevir
        const response = await playSlot(BET_AMOUNT);

        // Animasyon bitene kadar bekle
        await new Promise(resolve => setTimeout(resolve, spinDuration - elapsed + 100));
        clearInterval(spinInterval);

        if (!response.success) {
            setError(response.error || "Bir hata oluştu");
            setIsSpinning(false);
            return;
        }

        // Sonucu göster
        setReels(response.reels as [string, string, string]);
        setResult(response.result!);
        setBalance(response.result!.newBalance);
        setIsSpinning(false);
        setShowResult(true);

        // Kazanırsa konfeti
        if (response.result!.matchType === "jackpot") {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });
        } else if (response.result!.matchType === "match2") {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Bakiye */}
            <Card className="p-4 mb-6 border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-primary" />
                        <span className="font-bold">Bakiye</span>
                    </div>
                    <span className="text-2xl font-black text-primary">{balance} HP</span>
                </div>
            </Card>

            {/* Slot Makinesi */}
            <Card className="p-6 border-4 border-black dark:border-white bg-gradient-to-b from-background to-muted">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-black uppercase tracking-wider">Hubpuan Slot</h2>
                    <p className="text-sm text-muted-foreground">1 çevirme = {BET_AMOUNT} HP</p>
                </div>

                {/* Makaralar */}
                <div className="flex justify-center gap-2 mb-6">
                    {reels.map((symbol, index) => (
                        <motion.div
                            key={index}
                            className="w-20 h-24 flex items-center justify-center text-5xl border-4 border-black dark:border-white bg-white dark:bg-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                            animate={isSpinning ? {
                                y: [0, -10, 0],
                                rotateX: [0, 360]
                            } : {}}
                            transition={{
                                duration: 0.2,
                                repeat: isSpinning ? Infinity : 0
                            }}
                        >
                            {symbol}
                        </motion.div>
                    ))}
                </div>

                {/* Sonuç */}
                <AnimatePresence>
                    {showResult && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-center mb-4 p-3 rounded-lg border-2 ${result.matchType === "jackpot"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-700 dark:text-yellow-300"
                                : result.matchType === "match2"
                                    ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300"
                                    : "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {result.matchType === "jackpot" && <Sparkles className="h-5 w-5" />}
                                {result.matchType === "match2" && <TrendingUp className="h-5 w-5" />}
                                {result.matchType === "lose" && <TrendingDown className="h-5 w-5" />}
                                <span className="font-black text-lg">
                                    {result.matchType === "jackpot" && `JACKPOT! +${result.netChange} HP`}
                                    {result.matchType === "match2" && `Kazandın! +${result.netChange} HP`}
                                    {result.matchType === "lose" && `Kazıklandın! ${result.netChange} HP`}
                                </span>
                            </div>
                            {result.multiplier > 0 && (
                                <span className="text-sm opacity-70">({result.multiplier}x çarpan)</span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hata */}
                {error && (
                    <div className="text-center mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Çevir Butonu */}
                <Button
                    onClick={spin}
                    disabled={isSpinning || balance < BET_AMOUNT}
                    className="w-full h-14 text-lg font-black uppercase tracking-wider border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    {isSpinning ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Çevriliyor...
                        </>
                    ) : (
                        <>
                            🎰 ÇEVİR ({BET_AMOUNT} HP)
                        </>
                    )}
                </Button>

                {/* Kurallar */}
                <div className="mt-6 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                    <p className="font-bold mb-1">Kazanç Oranları:</p>
                    <ul className="space-y-0.5">
                        <li>🌟🌟🌟 = 25x</li>
                        <li>3 Aynı = 10x</li>
                        <li>2 Aynı = 2x</li>
                        <li>Eşleşme Yok = Kazıklandın</li>
                    </ul>
                </div>

                {/* Uyarı */}
                <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-[10px] text-yellow-700 dark:text-yellow-400 text-center">
                    ⚠️ Bu tamamen eğlence amaçlıdır ve gerçek para içermez.
                </div>
            </Card>
        </div>
    );
}
