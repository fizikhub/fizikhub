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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import HyperText from "@/components/magicui/hyper-text";
import { GlitchText } from "@/components/magicui/glitch-text";
import { createClient } from "@/lib/supabase-client";
import { TiltCard } from "@/components/magicui/tilt-card";
import { Meteors } from "@/components/magicui/meteors";

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
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15
        }
    }
};

interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    accentColor: string;
    colSpan?: string;
    showBorderBeam?: boolean;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, colSpan = "col-span-1", showBorderBeam }: FreshCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("relative group h-full perspective-1000", colSpan)}
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href} className="block h-full">
                <TiltCard className="h-full" rotationFactor={12}>
                    <div className="
                        relative h-full 
                        bg-white 
                        border-[3px] border-black 
                        rounded-xl 
                        shadow-[3px_3px_0px_0px_#000] 
                        group-hover:shadow-[6px_6px_0px_0px_#000] 
                        group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                        transition-all duration-200 ease-out
                        flex flex-col
                        overflow-hidden
                    ">
                        {showBorderBeam && (
                            <BorderBeam
                                size={300}
                                duration={8}
                                delay={0}
                                borderWidth={3}
                                colorFrom="#FACC15"
                                colorTo="#FB7185"
                            />
                        )}

                        {/* Decorative top bar */}
                        <div className={cn("h-4 w-full border-b-[3px] border-black", color)}></div>

                        <div className="px-5 py-5 flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                    "w-12 h-12 flex items-center justify-center rounded-lg border-[3px] border-black shadow-[2px_2px_0px_0px_#000]",
                                    color
                                )}>
                                    <Icon className="w-6 h-6 text-black stroke-[2.5px]" />
                                </div>
                                <div className="
                                    w-7 h-7 rounded-full border-[2px] border-black flex items-center justify-center
                                    bg-transparent group-hover:bg-black transition-colors duration-200
                                ">
                                    <ArrowRight className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-1 leading-none tracking-tight">
                                    <GlitchText text={title} className="block" />
                                </h3>
                                <p className="text-zinc-600 font-bold text-xs md:text-sm leading-snug">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </Link>
        </motion.div>
    );
}

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
        <div className="min-h-screen bg-background pb-32 pt-2 md:pt-20 px-4 font-sans relative overflow-hidden">

            {/* TEXTURED PAPER BACKGROUND */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            ></div>

            <div className="max-w-[900px] mx-auto relative z-10">

                {/* VISUAL HEADER WITH ENERGY BEAM */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative rounded-2xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0px_0px_#000] bg-black h-[250px] md:h-[300px]"
                >
                    <Meteors number={30} />

                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/20 pointer-events-none" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-lg">
                                Paylaşım
                            </h1>
                            <div className="flex items-center">
                                <HyperText
                                    text="MERKEZİ"
                                    className="text-4xl md:text-5xl font-black text-[#FACC15] leading-[0.9] tracking-tighter uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                    duration={1200}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* USER GREETING */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 flex justify-end"
                >
                    <p className="text-foreground font-bold text-sm md:text-base max-w-xs text-right leading-tight bg-white p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                        {loaded ? (
                            userName ?
                                `Bugün ne paylaşmak istersin, ${userName}?` :
                                "Bugün ne paylaşmak istersin?"
                        ) : (
                            "Yükleniyor..."
                        )}
                    </p>
                </motion.div>

                {/* Grid - Compact Mobile */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
                >
                    {/* 1. Article - Yellow (Full Width Mobile) */}
                    <FreshCard
                        title="MAKALE"
                        description="Derinlemesine içerik üret."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        colSpan="col-span-2 lg:col-span-2"
                        showBorderBeam={true}
                    />

                    {/* 2. Question - Pink */}
                    <FreshCard
                        title="SORU"
                        description="Topluluğa danış."
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-[#FB7185]"
                        accentColor="#FB7185"
                    />

                    {/* 3. Experiment - Green */}
                    <FreshCard
                        title="DENEY"
                        description="Sonuçları aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                        accentColor="#4ADE80"
                    />

                    {/* 4. Book - Blue */}
                    <FreshCard
                        title="KİTAP"
                        description="Kütüphane notları."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]"
                        accentColor="#60A5FA"
                    />

                    {/* 5. Term - Purple */}
                    <FreshCard
                        title="TERİM"
                        description="Sözlüğe katkı sağla."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                        accentColor="#C084FC"
                    />

                    {/* 6. Blog (New? since user asked for standard cards) - Orange */}
                    <FreshCard
                        title="BLOG"
                        description="Serbest yazı."
                        href="/blog"
                        icon={FileText}
                        color="bg-orange-400"
                        accentColor="#fb923c"
                    />

                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-6 md:mt-8 pb-8"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black text-white h-14 md:h-16 rounded-xl flex items-center justify-between px-5 md:px-6 border-[3px] border-black hover:bg-[#1a1a1a] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                            <span className="font-bold text-sm md:text-lg flex items-center gap-3">
                                <div className="animate-pulse bg-green-500 w-2 h-2 rounded-full"></div>
                                <span className="font-mono text-gray-300">_komut_satiri:</span>
                                <span className="text-white">Daha fazlasını ara...</span>
                            </span>
                            <div className="bg-[#FACC15] text-black px-3 py-1 rounded-md font-black text-xs md:text-sm border-2 border-black shadow-[2px_2px_0px_0px_#fff]">
                                ENTER
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 1.5px black;
                }
                @media (min-width: 768px) {
                    .text-stroke-black {
                        -webkit-text-stroke: 2px black;
                    }
                }
            `}</style>
        </div>
    );
}
