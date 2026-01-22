"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const stories = [
    {
        id: 1,
        title: "Işık Hızı Aşılamaz Mı?",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop",
        summary: "Einstein'ın izafiyet teorisine göre kütlesi olan hiçbir cisim ışık hızına ulaşamaz. Peki ya takyonlar?",
        color: "from-blue-600 to-purple-600"
    },
    {
        id: 2,
        title: "Schrödinger'in Kedisi",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop",
        summary: "Bir kedi hem ölü hem canlı olabilir mi? Kuantum süperpozisyonu dünyamızı nasıl değiştiriyor?",
        color: "from-amber-600 to-red-600"
    },
    {
        id: 3,
        title: "Karanlık Madde Nedir?",
        image: "https://images.unsplash.com/photo-1419242902251-862e0032624b?q=80&w=600&auto=format&fit=crop",
        summary: "Evrenin %85'ini oluşturan ama göremediğimiz gizemli madde. Sadece kütleçekimiyle etkileşime giriyor.",
        color: "from-emerald-600 to-cyan-600"
    },
    {
        id: 4,
        title: "Fermi Paradoksu",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
        summary: "Herkes nerede? Evren bu kadar büyükse neden hala başka bir yaşam formuyla karşılaşmadık?",
        color: "from-pink-600 to-rose-600"
    },
    {
        id: 5,
        title: "Zaman Genişlemesi",
        image: "https://images.unsplash.com/photo-1501139083538-0139583c61ee?q=80&w=600&auto=format&fit=crop",
        summary: "Hızlı giden biri için zaman daha yavaş akar. Interstellar filmindeki gibi, 1 saat 7 yıl sürebilir.",
        color: "from-indigo-600 to-blue-600"
    }
];

export function ScienceStories() {
    return (
        <section className="py-8 border-y border-white/5 bg-black/20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        Hızlı Bilim
                    </h2>
                    <span className="text-xs text-white/40 uppercase tracking-widest">Snack Content</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory pt-2 custom-scrollbar">
                    {stories.map((story) => (
                        <FeatureCard key={story.id} story={story} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ story }: { story: any }) {
    return (
        <motion.div
            className="snap-start shrink-0 w-[280px] h-[400px] relative rounded-3xl overflow-hidden group cursor-pointer"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
        >
            <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-b ${story.color} opacity-40 mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

            <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-white" />
            </div>

            <div className="absolute bottom-0 left-0 p-6">
                <div className={`w-8 h-1 mb-4 rounded-full bg-gradient-to-r ${story.color}`} />
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{story.title}</h3>
                <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                    {story.summary}
                </p>
            </div>
        </motion.div>
    );
}
