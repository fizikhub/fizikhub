"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    ArrowRight,
    Atom,
    Rocket,
    Globe,
    PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Meteors } from "@/components/magicui/meteors";
import HyperText from "@/components/magicui/hyper-text";
import { createClient } from "@/lib/supabase-client";
import { NeoShareCard } from "@/components/share/neo-share-card";
import { ShareMarquee } from "@/components/share/share-marquee";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15
        }
    }
};

export default function PaylasPage() {
    const [userName, setUserName] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserName(profile.full_name || profile.username || "Bilim İnsanı");
                } else {
                    setUserName("Bilim İnsanı");
                }
            }
            setLoaded(true);
        };
        fetchUser();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#050505] pb-32 pt-16 md:pt-20 px-4 font-sans relative overflow-hidden">

            {/* TEXTURED PAPER BACKGROUND */}
            <div className="absolute inset-0 opacity-40 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screens"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            ></div>

            {/* METEORS - Subtle Background Motion */}
            <Meteors number={20} />

            <div className="max-w-[1000px] mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 md:mb-16 pt-8 relative"
                >
                    <div className="flex flex-col items-start gap-4 relatie z-10">
                        <div className="inline-block px-4 py-1.5 rounded-full border-2 border-black dark:border-white bg-[#FACC15] text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-2">
                            FizikHub v2.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-[0.9] tracking-tighter uppercase drop-shadow-xl">
                            İçerik<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FB7185] drop-shadow-none">
                                Oluşturma
                            </span>
                        </h1>
                        <div className="h-2 w-32 bg-black dark:bg-white mt-2 mb-6"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                            <HyperText
                                text="MERKEZİ"
                                className="text-4xl md:text-6xl font-black text-black dark:text-white leading-[0.9] tracking-tighter uppercase text-stroke-2"
                                duration={1000}
                            />

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-right"
                            >
                                <p className="text-black dark:text-white font-bold text-lg md:text-xl leading-tight bg-white/50 dark:bg-black/50 backdrop-blur-md p-4 rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] inline-block">
                                    {loaded ? (
                                        userName ?
                                            `Hoş geldin, ${userName}.` :
                                            "Hoş geldin, Bilim İnsanı."
                                    ) : (
                                        "Yükleniyor..."
                                    )}
                                    <span className="block text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-1">
                                        Bugün bilime ne katacaksın?
                                    </span>
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Marquee Separator */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <ShareMarquee />
                </motion.div>


                {/* Bento Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12"
                >
                    {/* 1. Article - Featured (Large) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 h-[280px] md:h-[320px]">
                        <NeoShareCard
                            title="MAKALE YAZ"
                            description="Bilimsel birikimini derinlemesine aktar. Markdown destekli editör ile profesyonel içerikler üret."
                            href="/makale/yeni"
                            icon={FileText}
                            color="bg-[#FACC15]"
                            accentColor="#FACC15"
                            actionText="BAŞLA"
                            showBorderBeam={true}
                            className="h-full"
                        />
                    </div>

                    {/* 2. Question - Tall */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-1 h-[280px] md:h-[320px]">
                        <NeoShareCard
                            title="SORU SOR"
                            description="Aklına takılanları topluluğa danış."
                            href="/forum"
                            icon={MessageCircle}
                            color="bg-[#FB7185]"
                            accentColor="#FB7185"
                            actionText="SOR"
                            delay={0.1}
                            className="h-full"
                        />
                    </div>

                    {/* 3. Blog - Standard */}
                    <div className="col-span-1 h-[240px]">
                        <NeoShareCard
                            title="BLOG"
                            description="Daha özgür, kişisel yazılar."
                            href="/blog"
                            icon={PenTool}
                            color="bg-orange-400"
                            accentColor="#fb923c"
                            actionText="YAZ"
                            delay={0.2}
                            className="h-full"
                        />
                    </div>

                    {/* 4. Experiment - Standard */}
                    <div className="col-span-1 h-[240px]">
                        <NeoShareCard
                            title="DENEY"
                            description="Gözlemlerini ve sonuçlarını paylaş."
                            href="/deney/yeni"
                            icon={FlaskConical}
                            color="bg-[#4ADE80]"
                            accentColor="#4ADE80"
                            actionText="PAYLAŞ"
                            delay={0.3}
                            className="h-full"
                        />
                    </div>

                    {/* 5. Book - Standard */}
                    <div className="col-span-1 h-[240px]">
                        <NeoShareCard
                            title="KİTAP"
                            description="Okuduklarını analiz et."
                            href="/kitap-inceleme/yeni"
                            icon={Library}
                            color="bg-[#60A5FA]"
                            accentColor="#60A5FA"
                            actionText="İNCELE"
                            delay={0.4}
                            className="h-full"
                        />
                    </div>

                    {/* 6. Term - Dictionary (Wide on mobile, standard on desktop) */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 h-[200px]">
                        <NeoShareCard
                            title="SÖZLÜK KATKISI"
                            description="Bilimsel terimleri tanımla ve FizikHub sözlüğünü genişlet."
                            href="/sozluk"
                            icon={BookOpen}
                            color="bg-[#C084FC]"
                            accentColor="#C084FC"
                            actionText="TANIMLA"
                            delay={0.5}
                            className="h-full"
                        />
                    </div>

                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-16 pb-12"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black dark:bg-white text-white dark:text-black h-20 rounded-2xl flex items-center justify-between px-6 md:px-10 border-[4px] border-black dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                            <span className="font-bold text-lg md:text-2xl flex items-center gap-4">
                                <div className="animate-pulse bg-[#4ADE80] w-3 h-3 md:w-4 md:h-4 rounded-full shadow-[0_0_10px_#4ADE80]"></div>
                                <span className="font-mono text-zinc-400 dark:text-zinc-600">_komut_satiri:</span>
                                <span className="text-white dark:text-black">Daha fazlasını ara...</span>
                            </span>
                            <div className="bg-[#FACC15] text-black px-4 py-2 rounded-lg font-black text-sm md:text-base border-2 border-black shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000]">
                                ENTER ⏎
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-2 {
                    -webkit-text-stroke: 2px black;
                }
                @media (min-width: 768px) {
                    .text-stroke-2 {
                        -webkit-text-stroke: 3px black;
                    }
                }
                @media (prefers-color-scheme: dark) {
                     .text-stroke-2 {
                        -webkit-text-stroke: 2px white;
                    } 
                }
            `}</style>
        </div>
    );
}
