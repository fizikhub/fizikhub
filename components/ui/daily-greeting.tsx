"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Atom } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Daha doğal, samimi ve "içerden" espriler
// Daha doğal, samimi ve "içerden" espriler
const TIME_BASED_MESSAGES = [
    // Sabah (06:00 - 11:00)
    {
        min: 6, max: 11, messages: [
            "Fotonlar yola çıktı, senin de uyanma vaktin geldi şampiyon.",
            "Sabahın bu saatinde buradaysan, evrenin sırlarını çözmeye kararlısın demektir.",
            "Kahveni kap gel, termodinamik yasalarını alt üst edecek enerjin var bugün.",
            "Güneş nötronlarını saçmaya başladı, biz de bilgi saçalım mı?",
            "Bugün harika bir keşif yapacakmışsın gibi bir his var içimde."
        ]
    },
    // Öğle (11:00 - 15:00)
    {
        min: 11, max: 15, messages: [
            "Zaman göreceli olabilir ama öğle arası kesinlikle şart.",
            "Güneş tepede, gölge boyun en kısa halinde. Bilginin gölgesi ise hiç olmadığı kadar büyük.",
            "Beynindeki sinapslar ateşleniyorken kısa bir mola ver, dopamin depola.",
            "Schrödinger'in kedisi bile kutudan çıktı, sen hala çalışıyor musun? Harikasın.",
            "Evren genişlemeye devam ediyor, senin vizyonun da öyle."
        ]
    },
    // İkindi (15:00 - 19:00)
    {
        min: 15, max: 19, messages: [
            "İkinci kahve zamanı geldiyse, entropiye karşı küçük bir zafer kazanalıım.",
            "Günün son düzlüğü... Işık hızına yaklaşamasan da tempon harika.",
            "Yorgunluk sadece beynindeki bir illüzyon... Şaka şaka, dinlenmeyi unutma.",
            "Bugün uzay-zaman dokusunda güzel bir iz bıraktın bence.",
            "Kaos teorisi bugün sana merhametli davrandı mı?"
        ]
    },
    // Akşam/Gece (19:00 - 23:00)
    {
        min: 19, max: 23, messages: [
            "Güneş nöbeti diğer yıldızlara devretti, sahne senin.",
            "Günün muhasebesini yapma vakti... Bugün ne öğrendin, ne keşfettin?",
            "Karanlık çökünce yıldızlar daha parlak görünür. Senin fikirlerin gibi.",
            "Hala buradaysan, merak duygun yerçekiminden daha güçlü demektir.",
            "Melatonin salgılanmadan önce son bir teoriyi çürütebiliriz bence."
        ]
    },
    // Gece Yarısı (23:00 - 06:00)
    {
        min: 23, max: 6, messages: [
            "Galileo da geceleri gökyüzünü izlerdi, yalnız değilsin.",
            "Evren uyurken sırlar fısıldar... Duyabiliyor musun?",
            "Bu saatte ayaktaysan ya aşıksın ya da fizikçi... Ya da ikisi birden.",
            "Yıldız tozuyuz sonuçta, belki de ait olduğun yer gecedir.",
            "Rüyalar bazen gerçeklikten daha öğreticidir. İyi uykular dahi çocuk."
        ]
    }
];

function getGreetingData(hour: number) {
    if (hour >= 6 && hour < 12) return { greeting: "Günaydın" };
    if (hour >= 12 && hour < 18) return { greeting: "Tünaydın" }; // Adjusted to fit new ranges better
    if (hour >= 18 && hour < 22) return { greeting: "İyi Akşamlar" };
    if (hour >= 22 || hour < 2) return { greeting: "İyi Geceler" };
    return { greeting: "Uyuman Lazım" };
}

export function DailyGreeting() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [message, setMessage] = useState("");
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();
        const { greeting: greetingText } = getGreetingData(hour);
        setGreeting(greetingText);

        // Pick random message for that time based on the new structure
        const timeSlot = TIME_BASED_MESSAGES.find(slot => {
            if (slot.min <= slot.max) {
                return hour >= slot.min && hour < slot.max;
            } else { // Handles overnight slots like 23:00 - 06:00
                return hour >= slot.min || hour < slot.max;
            }
        });

        if (timeSlot) {
            const msgs = timeSlot.messages;
            setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
        } else {
            setMessage("Evrenin derinliklerinden bir mesaj: Merhaba!"); // Fallback message
        }


        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Get profile name
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', session.user.id)
                    .single();

                const nameToUse = profile?.full_name?.split(' ')[0] || profile?.username || "Kaşif";
                setUserName(nameToUse);

                // Show greeting after 1 second ONLY if logged in
                const timer = setTimeout(() => {
                    setIsVisible(true);
                }, 1000);

                // Auto hide after 15 seconds
                const hideTimer = setTimeout(() => setIsVisible(false), 16000);

                return () => {
                    clearTimeout(timer);
                    clearTimeout(hideTimer);
                }
            }
        };

        checkAuth();
    }, [supabase]);

    if (!mounted || !userName) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 150, opacity: 0, rotate: 6 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 150, opacity: 0, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[340px] px-4"
                >
                    {/* Main Card - Monochrome Brutalist */}
                    <div className="relative group/card cursor-default transform transition-transform hover:scale-105 duration-300">
                        {/* Background Shadow Layer (Static) */}
                        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-white rounded-xl border-2 border-zinc-900" />

                        {/* Main Content Layer */}
                        <div className="relative bg-zinc-950 text-zinc-50 border-2 border-white rounded-xl p-0 overflow-hidden shadow-2xl">

                            {/* Realistic Star Field - Generated with CSS Radial Gradients for performance and look */}
                            <div className="absolute inset-0 bg-[#020205]">
                                {/* Static Stars Layer 1 (Small) */}
                                <div className="absolute inset-0 opacity-70"
                                    style={{
                                        backgroundImage: `
                                            radial-gradient(1px 1px at 10px 10px, white, transparent),
                                            radial-gradient(1px 1px at 50px 80px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 120px 40px, white, transparent),
                                            radial-gradient(1px 1px at 200px 150px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 280px 90px, white, transparent),
                                            radial-gradient(1px 1px at 310px 220px, white, transparent),
                                            radial-gradient(1px 1px at 80px 180px, white, transparent),
                                            radial-gradient(1.5px 1.5px at 150px 240px, white, transparent)
                                        `,
                                        backgroundSize: '350px 350px'
                                    }}
                                />
                                {/* Static Stars Layer 2 (Tiny, offsets) */}
                                <div className="absolute inset-0 opacity-40"
                                    style={{
                                        backgroundImage: `
                                            radial-gradient(1px 1px at 30px 50px, white, transparent),
                                            radial-gradient(1px 1px at 150px 20px, white, transparent),
                                            radial-gradient(1px 1px at 250px 280px, white, transparent),
                                            radial-gradient(1px 1px at 50px 250px, white, transparent)
                                        `,
                                        backgroundSize: '200px 200px'
                                    }}
                                />

                                {/* Twinkling Star */}
                                <motion.div
                                    className="absolute top-10 right-10 w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_2px_rgba(255,255,255,0.4)]"
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.div
                                    className="absolute bottom-12 left-8 w-0.5 h-0.5 bg-blue-200 rounded-full shadow-[0_0_3px_1px_rgba(191,219,254,0.4)]"
                                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                />
                            </div>

                            {/* Close Button - Floated */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-2 right-2 p-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-all z-20"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Body */}
                            <div className="p-4 pt-5 flex gap-3 relative z-10 items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-lg border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover/card:border-white/50 transition-all">
                                        <Atom className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 pr-4">
                                    <h4 className="text-base font-black tracking-tight leading-4 text-white drop-shadow-lg">
                                        {greeting}, <br />
                                        <span className="text-lg bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-extrabold bg-[length:200%_auto] animate-gradient">
                                            {userName}
                                        </span>.
                                    </h4>
                                    <p className="text-xs font-medium text-blue-100/70 leading-snug mt-1.5 drop-shadow-md shadow-black">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar Animation */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
