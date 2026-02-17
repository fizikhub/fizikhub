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
    Search,
    Atom,
    Rocket,
    Globe,
    PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { createClient } from "@/lib/supabase-client";
import { RealisticStars } from "@/components/share/realistic-stars";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const item: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15
        }
    }
};

interface NeoShareCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    colSpan?: string;
    badge?: string;
}

function NeoShareCard({ title, description, href, icon: Icon, color, colSpan = "col-span-1", badge }: NeoShareCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("relative group h-full", colSpan)}
            whileHover={{ y: -4 }}
        >
            <Link href={href} className="block h-full">
                <div className={cn(
                    "relative h-full overflow-hidden rounded-2xl border-[3px] border-black bg-[#202023] transition-all duration-300",
                    "shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[8px_8px_0px_0px_#000]",
                    "group-hover:bg-[#27272a]"
                )}>
                    {/* Top Color Bar */}
                    <div className={cn("h-3 w-full border-b-[3px] border-black", color)} />

                    <div className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">

                        <div className="flex items-start justify-between mb-6">
                            {/* Icon Box */}
                            <div className={cn(
                                "w-14 h-14 rounded-xl border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:scale-110 transition-transform duration-300",
                                color
                            )}>
                                <Icon className="w-7 h-7 text-black stroke-[2.5px]" />
                            </div>

                            {/* Optional Badge */}
                            {badge && (
                                <span className={cn(
                                    "px-3 py-1 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-wide bg-white text-black shadow-[2px_2px_0px_0px_#000]"
                                )}>
                                    {badge}
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="text-3xl font-black text-white uppercase mb-2 tracking-tight group-hover:text-amber-400 transition-colors">
                                {title}
                            </h3>
                            <p className="text-zinc-400 font-bold text-sm leading-relaxed max-w-[90%] group-hover:text-zinc-300 transition-colors">
                                {description}
                            </p>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                            <ArrowRight className={cn("w-6 h-6", color.replace('bg-', 'text-'))} />
                        </div>
                    </div>
                </div>
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
        <div className="min-h-screen bg-[#27272a] pb-24 pt-4 md:pt-20 px-4 font-sans relative overflow-hidden selection:bg-yellow-500/30">

            {/* REALISTIC STARS */}
            <RealisticStars />

            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-[1000px] mx-auto relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16 pt-4 text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 text-white font-black uppercase tracking-widest text-xs mb-6">
                        <Rocket className="w-3.5 h-3.5 text-yellow-400" />
                        Üretim Üssü
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-[4px_4px_0px_#000]">
                        PAYLAŞIM<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-amber-500 text-stroke-white">MERKEZİ</span>
                    </h1>

                    <p className="text-zinc-400 font-bold text-lg md:text-xl max-w-2xl leading-relaxed mx-auto md:mx-0">
                        {loaded ? (
                            userName ?
                                `Hoş geldin, ${userName}. Bugün bilim dünyasına ne katmak istersin?` :
                                "Burası senin laboratuvarın. Özgürce üret, paylaş ve keşfet."
                        ) : (
                            "Yükleniyor..."
                        )}
                    </p>
                </motion.div>

                {/* Grid Layout */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                >
                    {/* 1. Article - Yellow (Featured) */}
                    <NeoShareCard
                        title="MAKALE"
                        description="Derinlemesine bilimsel içerikler ve analizler üret."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        colSpan="md:col-span-2 lg:col-span-2"
                        badge="Popüler"
                    />

                    {/* 2. Question - Pink */}
                    <NeoShareCard
                        title="SORU"
                        description="Merak ettiklerini topluluğa danış."
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-[#FF0080]"
                    />

                    {/* 3. Experiment - Green */}
                    <NeoShareCard
                        title="DENEY"
                        description="Laboratuvar sonuçlarını ve gözlemlerini aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]"
                    />

                    {/* 4. Book - Blue */}
                    <NeoShareCard
                        title="KİTAP"
                        description="Okuduğun bilimsel kitapları incele."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#23A9FA]"
                    />

                    {/* 5. Term - Purple */}
                    <NeoShareCard
                        title="TERİM"
                        description="Bilimsel sözlüğe yeni kavramlar ekle."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]"
                    />

                    {/* 6. Blog - Orange */}
                    <NeoShareCard
                        title="BLOG"
                        description="Daha serbest, kişisel yazılar."
                        href="/blog/yeni"
                        icon={PenTool}
                        color="bg-[#FB923C]"
                    />

                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 md:mt-16 pb-12"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black relative overflow-hidden h-20 rounded-2xl flex items-center justify-between px-8 border-[3px] border-zinc-800 hover:border-white transition-colors shadow-[4px_4px_0px_0px_#000]">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />

                            <span className="font-bold text-lg md:text-xl flex items-center gap-4 relative z-10">
                                <Search className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                                <span className="text-zinc-500 font-mono group-hover:text-white transition-colors">Daha fazlasını ara...</span>
                            </span>

                            <div className="hidden md:flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 rounded-lg font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_#fff] relative z-10 group-hover:translate-x-1 transition-transform">
                                ENTER
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-white {
                    -webkit-text-stroke: 1px transparent;
                }
            `}</style>
        </div>
    );
}
