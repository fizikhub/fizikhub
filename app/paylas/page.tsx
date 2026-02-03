"use client";

import Link from "next/link";
import {
    BookOpen,
    MessageCircle,
    FlaskConical,
    Library,
    FileText,
    Sparkles,
    ArrowRight,
    PenTool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Animation Variants
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

interface BentoCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    colorClass: string; // e.g., "bg-pink-500"
    className?: string; // For grid span
    delay?: number;
}

function BentoCard({ title, description, href, icon: Icon, colorClass, className }: BentoCardProps) {
    return (
        <motion.div variants={item} className={cn("relative group h-full", className)}>
            <Link href={href} className="block h-full">
                <div className={cn(
                    "relative h-full overflow-hidden rounded-3xl border-2 border-black bg-[#111]",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-2 hover:translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]", // Hard white shadow pop
                    "shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]" // Subtle default shadow
                )}>
                    {/* Background Gradient/Noise */}
                    <div className={cn(
                        "absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-opacity duration-500 group-hover:opacity-40",
                        colorClass
                    )} />

                    <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                        {/* Icon Box */}
                        <div className={cn(
                            "w-14 h-14 mb-6 flex items-center justify-center rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                            colorClass,
                            "group-hover:scale-110 transition-transform duration-300"
                        )}>
                            <Icon className="w-7 h-7 text-black stroke-[2.5px]" />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight tracking-tight">
                                {title}
                            </h3>
                            <p className="text-neutral-400 font-medium leading-relaxed group-hover:text-white transition-colors">
                                {description}
                            </p>
                        </div>

                        {/* CTA Arrow */}
                        <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all group-hover:gap-4">
                            <span className={cn("text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50", colorClass.replace('bg-', 'text-'))}>
                                Oluştur
                            </span>
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function ContentHubPage() {
    return (
        <div className="min-h-screen bg-[#050505] pb-32 pt-28 px-4 md:px-8 relative overflow-hidden font-sans selection:bg-yellow-400 selection:text-black">
            {/* Background Noise & Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="max-w-[1200px] mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Yaratıcılık Merkezi</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
                        BİR ŞEYLER <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">PAYLAŞALIM.</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                        Fizikhub topluluğuna katkıda bulunmak için sihirli bir kategori seç. Bilgi paylaştıkça çoğalır.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
                >
                    {/* 1. Large Feature Card: Article */}
                    <BentoCard
                        title="MAKALE YAZ"
                        description="Derinlemesine bilimsel içerikler üret. Teoremler, keşifler veya analizler."
                        href="/makale/yeni"
                        icon={FileText}
                        colorClass="bg-pink-500"
                        className="md:col-span-2"
                    />

                    {/* 2. Secondary: Forum */}
                    <BentoCard
                        title="SORU SOR"
                        description="Aklına takılan o karmaşık soruyu topluluğa sor."
                        href="/forum"
                        icon={MessageCircle}
                        colorClass="bg-yellow-400"
                    />

                    {/* 3. Experiments */}
                    <BentoCard
                        title="DENEYİ PAYLAŞ"
                        description="Evdeki laboratuvarından sonuçlar."
                        href="/deney/yeni"
                        icon={FlaskConical}
                        colorClass="bg-green-500"
                    />

                    {/* 4. Book Reviews */}
                    <BentoCard
                        title="KİTAP İNCELE"
                        description="Bilim kütüphanene yeni bir not düş."
                        href="/kitap-inceleme/yeni"
                        icon={Library}
                        colorClass="bg-blue-500"
                    />

                    {/* 5. Dictionary (Tall/Special?) -> Standard for grid balance */}
                    <BentoCard
                        title="TERİM EKLE"
                        description="Sözlüğe yeni bir kavram kazandır."
                        href="/sozluk"
                        icon={BookOpen}
                        colorClass="bg-orange-500"
                    />
                </motion.div>

                {/* Footer Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-16 text-center"
                >
                    <p className="text-neutral-600 text-sm font-mono">
                        "Hayal gücü bilgiden daha önemlidir." - A. Einstein
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
