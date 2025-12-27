"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Laugh, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Placeholder memes - primarily text-based or SVG for now since we can't fetch external meme APIs reliable without CORS props
// Ideally this would fetch from a database table 'fun_content'
const MEMES = [
    {
        id: 1,
        title: "Schrödinger'in Kedisi",
        content: "Kutuyu açana kadar hem ölü hem canlıyım. (Spoiler: Açınca ölüyorum)",
        type: "text"
    },
    {
        id: 2,
        title: "Newton vs Einstein",
        content: "Newton: Elma düştü.\nEinstein: Uzay-zaman eğrildi, elma ne yapsın?",
        type: "text"
    },
    {
        id: 3,
        title: "Yazılımcı ve Fizikçi",
        content: "Fizikçi: Evrenin sınırlarını zorluyorum.\nYazılımcı: Div'i ortalayamadım.",
        type: "text"
    }
];

export function MemeCorner() {
    const [meme, setMeme] = useState(MEMES[0]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border-4 border-black dark:border-white bg-yellow-400 p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
        >
            <div className="bg-black dark:bg-white text-yellow-400 dark:text-black py-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Laugh size={20} className="animate-bounce" />
                    <span className="font-black uppercase tracking-widest text-sm">
                        BİLİMİ Tİ'YE ALIYORUZ
                    </span>
                </div>
                <span className="text-[10px] font-mono opacity-80">v1.0.lol</span>
            </div>

            <div className="p-8 flex flex-col items-center text-center">
                <h3 className="text-2xl font-black text-black mb-4 uppercase leading-none transform -rotate-2">
                    {meme.title}
                </h3>

                <div className="bg-white border-2 border-black p-6 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] w-full max-w-md transform rotate-1 transition-transform hover:rotate-0">
                    <p className="text-lg font-bold font-mono text-black whitespace-pre-line">
                        {meme.content}
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => setMeme(MEMES[(meme.id % MEMES.length)])}
                        className="px-6 py-2 bg-black text-white font-bold uppercase text-xs rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        Sonraki Meme →
                    </button>
                    <button className="p-2 border-2 border-black rounded-full hover:bg-black/10 transition-colors text-black">
                        <Share2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
