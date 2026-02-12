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
    Plus,
    Activity,
    Compass,
    Divide
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import HyperText from "@/components/magicui/hyper-text";
import { createClient } from "@/lib/supabase-client";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const item: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    show: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

interface BentoCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    className?: string;
    delay?: number;
    size?: "large" | "medium" | "small";
}

function BentoCard({ title, description, href, icon: Icon, color, className, size = "medium" }: BentoCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn(
                "relative group overflow-hidden rounded-2xl border border-white/10 flex flex-col transition-all duration-500",
                "bg-[#0a0a0a]/40 backdrop-blur-md",
                "hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
                className
            )}
        >
            <Link href={href} className="flex flex-col h-full p-5 sm:p-7 relative z-10">
                {/* Accent Glow */}
                <div className={cn(
                    "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-25 transition-opacity duration-700",
                    color
                )} />

                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-xl border border-white/20 shadow-lg relative overflow-hidden",
                        "bg-white/5 group-hover:bg-white/10 transition-colors"
                    )}>
                        <Icon className="w-6 h-6 text-white stroke-[2px]" />
                        <div className={cn("absolute inset-0 opacity-20", color)} />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                        <ArrowRight className="w-4 h-4 translate-x-[1px]" />
                    </div>
                </div>

                <div className="mt-auto">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:tracking-normal transition-all duration-500">
                        {title}
                    </h3>
                    <p className="text-zinc-400 font-medium text-xs sm:text-sm leading-relaxed max-w-[90%]">
                        {description}
                    </p>
                </div>

                <BorderBeam
                    size={200}
                    duration={8}
                    className="opacity-0 group-hover:opacity-100"
                />
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
                    setUserName(profile.full_name || profile.username || "Kaşif");
                }
            }
            setLoaded(true);
        };
        fetchUser();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-[#050505] pb-32 pt-16 md:pt-24 px-4 font-sans relative overflow-hidden selection:bg-yellow-400/30">

            {/* SCIENTIFIC HUD OVERLAY */}
            <div className="absolute inset-0 pointer-events-none opacity-20 pointer-events-none z-0">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                {/* Coordinates & Formulas */}
                <div className="absolute top-20 right-10 flex flex-col items-end gap-1 font-mono text-[8px] text-white/40 uppercase tracking-widest leading-none">
                    <span>COORD_SYS: CAR_3D</span>
                    <span>LAT: 41.0082° N</span>
                    <span>LON: 28.9784° E</span>
                    <span className="mt-4 text-[10px] text-blue-400/30">E = mc²</span>
                    <span className="text-yellow-400/20">F = G(m₁m₂/r²)</span>
                    <span className="text-pink-400/20">∇ × E = -∂B/∂t</span>
                </div>

                <div className="absolute bottom-40 left-10 opacity-20 hidden md:block">
                    <div className="flex flex-col gap-4">
                        <div className="w-1 h-20 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                        <div className="w-20 h-1 bg-gradient-to-r from-white/50 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-12 md:mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-[0.3em]">Merkez Operasyon Aktif</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-4">
                                Paylaşım<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white">Merkezi</span>
                            </h1>
                            <div className="h-1 w-24 bg-yellow-400 rounded-full" />
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={loaded ? "loaded" : "loading"}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl max-w-xs"
                                >
                                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1.5 opacity-60 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                        Sistem Karşılama:
                                    </p>
                                    <p className="text-white text-base font-black leading-tight">
                                        {loaded ? (
                                            <>Merhaba <span className="text-yellow-400">{userName || "Kaşif"}</span>, bugün evrene ne katmak istersin?</>
                                        ) : (
                                            "Veriler senkronize ediliyor..."
                                        )}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Grid - Bento Layout */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-[auto] gap-4"
                >
                    {/* 1. Article - BIG HERO (2x2) */}
                    <BentoCard
                        title="MAKALE"
                        description="Kapsamlı bilimsel yazılar ve derinlemesine incelemeler kaleme al."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-yellow-500"
                        className="sm:col-span-2 sm:row-span-2 min-h-[300px]"
                    />

                    {/* 2. Question - Medium */}
                    <BentoCard
                        title="SORU"
                        description="Zihnine takılanları topluluğa sor, cevapları keşfet."
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-pink-500"
                        className="sm:col-span-2 lg:col-span-1"
                    />

                    {/* 3. Experiment - Medium */}
                    <BentoCard
                        title="DENEY"
                        description="Laboratuvardan notlar ve metodolojik sonuçlar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-emerald-500"
                        className="sm:col-span-2 lg:col-span-1"
                    />

                    {/* 4. Book - Wide Bottom Section */}
                    <BentoCard
                        title="KİTAP"
                        description="Bilimsel literatür ve kütüphane analizlerini paylaş."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-blue-500"
                        className="sm:col-span-2 lg:col-span-2"
                    />

                    {/* 5. Term - Small */}
                    <BentoCard
                        title="TERİM"
                        description="Sözlüğe teknik tanımlar ve açıklamalar ekle."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-purple-500"
                        className="sm:col-span-1"
                    />

                    {/* 6. Blog - Small */}
                    <BentoCard
                        title="BLOG"
                        description="Kısa notlar ve kişisel bilimsel yolculuğun."
                        href="/blog"
                        icon={Activity}
                        color="bg-orange-500"
                        className="sm:col-span-1"
                    />
                </motion.div>

                {/* CMD PROMPT STYLE SEARCH/CTA */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-12"
                >
                    <Link href="/ara" className="group">
                        <div className="relative h-20 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all flex items-center justify-between px-8 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="hidden sm:flex items-center gap-2 text-zinc-500 font-mono text-sm uppercase">
                                    <span className="text-white/30">system@fizikhub</span>
                                    <span>:</span>
                                    <span className="text-blue-400">~/search</span>
                                    <span className="text-white/30">$</span>
                                </div>
                                <span className="text-white text-lg font-black tracking-tight group-hover:translate-x-1 transition-transform">
                                    Daha fazlasını keşfetmek için tara...
                                </span>
                            </div>

                            <div className="bg-white/10 group-hover:bg-white text-white group-hover:text-black h-10 px-6 rounded-xl border border-white/20 flex items-center gap-2 transition-all font-black text-xs uppercase tracking-widest shadow-xl">
                                Keşfe Çık
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
