"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Atom } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Daha doğal, samimi ve "içerden" espriler
const TIME_BASED_MESSAGES = {
    morning: [ // 06:00 - 12:00
        "Kahve henüz kan dolaşımına karışmadıysa ani hareketlerden kaçın.",
        "Güneş doğdu, fotosentez yapamıyoruz ama kahve var, o da olur.",
        "Uyanmak zor, yatak yerçekimiyle işbirliği yapıyor sanki.",
        "Sabahın köründe burada ne işin var? Azim mi, uykusuzluk mu?",
        "Bugün atomu parçalamayacaksan bile en azından yatağını topla."
    ],
    day: [ // 12:00 - 20:00
        "Evren o kadar büyük ki, senin dertler yanında kuantum altı parçacık kalır.",
        "Odaklanman lazım ama o telefonun çekim gücü kara delikten hallice, biliyorum.",
        "Mola verip boşluğa bakmak da çalışmaya dahil mi? Bence dahil.",
        "Beynin nöron ateşlemesi yavaşladıysa bir çikolata ateşle.",
        "Bugün dünyayı kurtarmasan da olur, kendini kurtar yeter."
    ],
    evening: [ // 20:00 - 24:00
        "Günün yorgunluğunu atmak için buradasın, hoş geldin.",
        "Dışarısı karanlık, içerisi aydınlık... yani umarım ekran parlaklığın kısıktır.",
        "Yıldızlar çıktı, senin çalışma masası hala dağınık mı?",
        "Bu saatte ders çalışıyorsan, ya çok zekisin ya da işi son güne bıraktın.",
        "Karanlık madde kadar gizemli takılma, gel iki çift laf edelim (şaka şaka)."
    ],
    night: [ // 00:00 - 02:00
        "Bu saatte ayaktaysan ya çok büyük bir keşif peşindesin ya da yarın sınav var.",
        "Baykuşlar ve fizikçiler için mesai saati başladı.",
        "Uyku, zayıflar içindir... dermişim, git yat aslında.",
        "Gece sessizliği, tam odaklanmalık... ya da dizi izlemelik.",
        "Beynin şu an alfa dalgası yayıyor olması lazımdı ama buradasın."
    ],
    late: [ // 02:00 - 06:00
        "Ciddi soruyorum, vampir misin? Yat uyu artık.",
        "Beynin şuan %1 kapasiteyle çalışıyor, zorlama bence.",
        "Bu saatte burada kimse yok, bi sen bi ben. Git uyu hadi.",
        "Rüyanda fizik çözmek istemiyorsan yatağa gitme vakti.",
        "Gözlerin kapanıyor... yerçekimine direnme, yastığa teslim ol."
    ]
};

function getGreetingData(hour: number) {
    if (hour >= 6 && hour < 12) return { greeting: "Günaydın", time: 'morning' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 12 && hour < 20) return { greeting: "İyi Günler", time: 'day' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 20 && hour < 24) return { greeting: "İyi Akşamlar", time: 'evening' as keyof typeof TIME_BASED_MESSAGES };
    if (hour >= 0 && hour < 2) return { greeting: "İyi Geceler", time: 'night' as keyof typeof TIME_BASED_MESSAGES };
    return { greeting: "Uyuman Lazım", time: 'late' as keyof typeof TIME_BASED_MESSAGES };
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
        const { greeting: greetingText, time } = getGreetingData(hour);
        setGreeting(greetingText);

        // Pick random message for that time
        const msgs = TIME_BASED_MESSAGES[time];
        setMessage(msgs[Math.floor(Math.random() * msgs.length)]);

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
                    <div className="relative group/card cursor-default">
                        {/* Background Shadow Layer (Static) */}
                        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white rounded-xl border-2 border-zinc-900" />

                        {/* Main Content Layer */}
                        <div className="relative bg-zinc-950 text-zinc-50 border-2 border-white rounded-xl p-0 overflow-hidden transition-transform duration-200 group-hover/card:-translate-y-1 group-hover/card:-translate-x-1">

                            {/* Realistic Space Background */}
                            <div className="absolute inset-0 bg-black">
                                {/* Small Stars */}
                                <div className="absolute h-[1px] w-[1px] bg-white rounded-full top-4 left-10 shadow-[0_0_2px_#fff]" />
                                <div className="absolute h-[2px] w-[2px] bg-white rounded-full top-12 right-20 shadow-[0_0_3px_#fff] animate-pulse" />
                                <div className="absolute h-[1px] w-[1px] bg-white rounded-full bottom-8 left-1/4 shadow-[0_0_1px_#fff]" />
                                <div className="absolute h-[1.5px] w-[1.5px] bg-white rounded-full bottom-1/3 right-8 shadow-[0_0_2px_#fff] opacity-70" />
                                <div className="absolute h-[1px] w-[1px] bg-white rounded-full top-1/2 left-1/2 shadow-[0_0_2px_#fff] opacity-50" />
                                <div className="absolute h-[2px] w-[2px] bg-blue-100 rounded-full top-6 right-6 shadow-[0_0_4px_#bfdbfe] animate-pulse" />

                                {/* CSS Dot Pattern for Depth */}
                                <div className="absolute inset-0 opacity-30"
                                    style={{ backgroundImage: 'radial-gradient(1px 1px at center, white, transparent)', backgroundSize: '40px 40px' }}>
                                </div>

                                {/* Shooting Star Animation */}
                                <motion.div
                                    className="absolute top-0 right-0 h-[2px] w-[50px] bg-gradient-to-r from-transparent to-white opacity-0"
                                    animate={{
                                        x: [-50, -300],
                                        y: [0, 300],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 5,
                                        ease: "easeInOut"
                                    }}
                                    style={{ rotate: '45deg' }}
                                />

                                <motion.div
                                    className="absolute top-1/3 right-[-50px] h-[1px] w-[30px] bg-gradient-to-r from-transparent to-blue-200 opacity-0"
                                    animate={{
                                        x: [-20, -200],
                                        y: [0, 150],
                                        opacity: [0, 0.8, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        delay: 1,
                                        ease: "easeInOut"
                                    }}
                                    style={{ rotate: '30deg' }}
                                />
                            </div>

                            {/* Close Button - Floated */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:bg-white hover:text-black rounded-md transition-colors z-20"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Body */}
                            <div className="p-4 pt-5 flex gap-3 relative z-10 items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="w-10 h-10 bg-zinc-900/80 backdrop-blur-sm text-white rounded-lg border border-white/30 flex items-center justify-center shadow-lg group-hover/card:border-white transition-colors">
                                        <Atom className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 pr-4">
                                    <h4 className="text-base font-black tracking-tight leading-4 text-white drop-shadow-md">
                                        {greeting}, <br />
                                        <span className="text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-sm font-extrabold">{userName}</span>.
                                    </h4>
                                    <p className="text-xs font-medium text-zinc-300 leading-snug mt-1.5 drop-shadow-md">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar Animation */}
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
