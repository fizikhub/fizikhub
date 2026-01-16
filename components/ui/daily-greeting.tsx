"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Atom, Brain } from "lucide-react";
import { createClient } from "@/lib/supabase";

const FUNNY_FACTS = [
    "Schrödinger'in kedisi seninle gurur duyuyor. Ya da duymuyor. Kutuyu açmadan bilemeyiz.",
    "Bugün entropiyi artırmamaya çalış. Yine de odayı toplasan iyi olur.",
    "Işık hızından hızlı hareket edemezsin ama ödevleri son güne bırakma hızın yarışır.",
    "Yerçekimi sadece bir teori, uçmayı deneme ama.",
    "Bir nötron bara girer, 'Bira ne kadar?' diye sorar. Barmen: 'Sana yük yok kardeşim.'",
    "Senin atomların yıldız tozundan yapıldı. Yani teknik olarak parıldaman lazım.",
    "Newton başına elma düştüğü için yerçekimini buldu. Senin başına ne düşünce ders çalışacaksın?",
    "Termodinamik yasaları: 1. Kazanamazsın. 2. Berabere kalamazsın. 3. Oyundan çıkamazsın.",
    "E=mc² ise, senin enerjin kahveyle doğru orantılıdır.",
    "Evren genişliyor, senin göbek de ona mı uyuyor?",
    "Haftasonu planın ne? Ben karanlık maddeyi aramayı düşünüyorum. Yine bulamayacağım kesin.",
    "Big Bang'den beri kafan bu kadar karışık olmamıştı herhalde.",
    "Bugün elektron gibi ol, hep pozitif... pardon, o protondu. Neyse sen anladın.",
    "Kara delikler bile senin kadar çekici değil. (Şaka şaka, olay ufku falan, dikkat et.)"
];

function getRandomFact() {
    return FUNNY_FACTS[Math.floor(Math.random() * FUNNY_FACTS.length)];
}

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [fact, setFact] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        setMounted(true);
        setFact(getRandomFact());

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsAuthenticated(true);
                // Show greeting after 1.5 second ONLY if logged in
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 1500);

                // Auto hide after 10 seconds
                const hideTimer = setTimeout(() => setIsVisible(false), 11500);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(hideTimer);
                }
            }
        };

        checkAuth();
    }, [supabase]);

    if (!mounted || !isAuthenticated) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 300, opacity: 0, rotate: 5 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    exit={{ x: 300, opacity: 0, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="fixed bottom-20 right-4 sm:right-8 z-[9999] max-w-[320px] w-full"
                >
                    <div className="relative bg-[#FFDD00] dark:bg-[#FF0080] text-black border-4 border-black box-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-4 flex flex-col gap-2 transform transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]">

                        {/* Header Row */}
                        <div className="flex items-center justify-between border-b-4 border-black pb-2 mb-1">
                            <div className="flex items-center gap-2">
                                <div className="bg-black text-white p-1">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <span className="font-black text-lg uppercase tracking-tight">Günün Dozu</span>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="bg-white border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="font-bold text-base leading-snug">
                            {fact}
                        </div>

                        {/* Footer Decoration */}
                        <div className="absolute -top-3 -left-3 animate-bounce">
                            <div className="bg-white border-2 border-black px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                HEY!
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
