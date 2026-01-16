"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, User } from "lucide-react";
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

                // Auto hide after 8 seconds
                const hideTimer = setTimeout(() => setIsVisible(false), 9000);

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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4"
                >
                    <div className="relative bg-[#09090b] text-white border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl ring-1 ring-white/5 flex items-start gap-4">

                        {/* Icon/Avatar Placeholder */}
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-base font-bold text-white tracking-tight">
                                    {greeting}, <span className="text-indigo-400">{userName}</span>
                                </h4>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
