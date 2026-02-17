"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function TrendingMarquee() {
    const news = [
        "FizikHub 2.0 Yayında! 🚀",
        "NASA Mars'ta Antik Göl Yatağı Buldu 🌊",
        "Kuantum Bilgisayarlar için Yeni Soğutma Tekniği ❄️",
        "James Webb Teleskobu Evrenin En Yaşlı Galaksisini Görüntüledi 🔭",
        "Yapay Zeka Artık Fizik Problemlerini Çözebiliyor 🤖",
        "CERN Yeni Bir Parçacık Keşfetti mi? 🤔",
        "SpaceX Starship Dördüncü Uçuşuna Hazırlanıyor 🚀",
    ];

    // Duplicate list for seamless loop
    const duplicatedNews = [...news, ...news];

    return (
        <div className="w-full bg-[#FACC15] border-y-[3px] border-black overflow-hidden relative z-20 py-3">
            <div className="flex select-none">
                <motion.div
                    className="flex flex-nowrap gap-12 items-center whitespace-nowrap"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Adjust speed
                    }}
                >
                    {duplicatedNews.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 text-black font-black uppercase text-sm tracking-wider">
                            <span>{item}</span>
                            <Zap className="w-4 h-4 fill-black text-black" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
