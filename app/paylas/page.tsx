"use client";

import Link from "next/link";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    ArrowRight,
    Atom,
    Plus,
    Zap,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
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
            stiffness: 100,
            damping: 15
        }
    }
};

interface FreshCardProps {
    title: string;
    description: string;
    href: string;
    icon: any;
    color: string; // Tailwind bg class for the ICON container
    accentColor: string; // Hex for hover shadow
    pattern?: string;
    colSpan?: string;
}

function FreshCard({ title, description, href, icon: Icon, color, accentColor, colSpan = "col-span-1" }: FreshCardProps) {
    return (
        <motion.div
            variants={item}
            className={cn("relative group h-full", colSpan)}
        >
            <Link href={href} className="block h-full">
                <div className="
                    relative h-full 
                    bg-white 
                    border-[3px] border-black 
                    rounded-xl 
                    shadow-[4px_4px_0px_0px_#000] 
                    group-hover:-translate-y-1 group-hover:translate-x-1 
                    group-hover:shadow-[8px_8px_0px_0px_#000] 
                    transition-all duration-200 ease-out
                    flex flex-col
                    overflow-hidden
                ">
                    {/* Decorative top bar */}
                    <div className={cn("h-3 w-full border-b-[3px] border-black", color)}></div>

                    <div className="p-6 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "w-14 h-14 flex items-center justify-center rounded-lg border-[3px] border-black shadow-[2px_2px_0px_0px_#000]",
                                color
                            )}>
                                <Icon className="w-7 h-7 text-black stroke-[2.5px]" />
                            </div>
                            <div className="
                                w-8 h-8 rounded-full border-[2px] border-black flex items-center justify-center
                                bg-transparent group-hover:bg-black transition-colors duration-200
                            ">
                                <ArrowRight className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-black uppercase mb-2 leading-tight">
                                {title}
                            </h3>
                            <p className="text-zinc-600 font-bold text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function PaylasPage() {
    return (
        <div className="min-h-screen bg-[#E0E7FF] pb-32 pt-20 px-4 font-sans relative overflow-hidden">
            {/* Background Pattern - Dot Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-[1000px] mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="inline-block bg-black text-white px-4 py-1 font-black text-xs uppercase tracking-widest mb-3 transform -rotate-2">
                        Topluluk Merkezi
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <h1 className="text-5xl md:text-7xl font-black text-black leading-[0.9] tracking-tighter">
                            PAYLAŞIM<br />
                            <span className="text-[#FACC15] text-stroke-black drop-shadow-[4px_4px_0px_#000]">MERKEZİ</span>
                        </h1>
                        <p className="text-black font-bold max-w-sm md:text-right">
                            Bilim dünyasına katkı sağlamak için ne üretmek istersin?
                        </p>
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {/* 1. Article - Yellow */}
                    <FreshCard
                        title="MAKALE YAZ"
                        description="Derinlemesine bilimsel içerik üret."
                        href="/makale/yeni"
                        icon={FileText}
                        color="bg-[#FACC15]"
                        accentColor="#FACC15"
                        colSpan="lg:col-span-2"
                    />

                    {/* 2. Question - Pink */}
                    <FreshCard
                        title="SORU SOR"
                        description="Takıldığın yeri sor."
                        href="/forum"
                        icon={MessageCircle}
                        color="bg-[#FB7185]" // Rose-400
                        accentColor="#FB7185"
                    />

                    {/* 3. Experiment - Green */}
                    <FreshCard
                        title="DENEYİ PAYLAŞ"
                        description="Laboratuvar sonuçlarını aktar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        color="bg-[#4ADE80]" // Green-400
                        accentColor="#4ADE80"
                    />

                    {/* 4. Book - Blue */}
                    <FreshCard
                        title="KİTAP İNCELE"
                        description="Kütüphane notları."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        color="bg-[#60A5FA]" // Blue-400
                        accentColor="#60A5FA"
                    />

                    {/* 5. Term - Purple */}
                    <FreshCard
                        title="TERİM EKLE"
                        description="Sözlüğe katkı sağla."
                        href="/sozluk"
                        icon={BookOpen}
                        color="bg-[#C084FC]" // Purple-400
                        accentColor="#C084FC"
                        colSpan="md:col-span-2 lg:col-span-1"
                    />
                </motion.div>

                {/* Footer / Search Link */}
                <motion.div
                    variants={item}
                    initial="hidden"
                    animate="show"
                    className="mt-8"
                >
                    <Link href="/ara" className="block group">
                        <div className="bg-black text-white h-16 rounded-xl flex items-center justify-between px-6 border-[3px] border-black hover:bg-[#1a1a1a] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                            <span className="font-bold text-lg flex items-center gap-3">
                                <Search className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-400">Daha fazlasını mı arıyorsun?</span>
                            </span>
                            <div className="bg-white text-black px-4 py-1 rounded font-bold text-sm">
                                Arama Yap
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>

            <style jsx global>{`
                .text-stroke-black {
                    -webkit-text-stroke: 2px black;
                }
            `}</style>
        </div>
    );
}
