"use client";

import { Marquee } from "@/components/magicui/marquee";

export function ShareMarquee() {
    const items = [
        "BİLİM •", "PAYLAŞ •", "KEŞFET •", "TARTIŞ •", "ANALİZ •", "DENEY •",
        "BİLİM •", "PAYLAŞ •", "KEŞFET •", "TARTIŞ •", "ANALİZ •", "DENEY •",
    ];

    return (
        <div className="w-full border-y-[3px] border-black dark:border-white bg-[#FACC15] dark:bg-[#FACC15] overflow-hidden py-2 my-8 shadow-[4px_4px_0px_0px_#000]">
            <Marquee className="[--duration:20s] [--gap:2rem]" pauseOnHover>
                {items.map((item, i) => (
                    <span key={i} className="text-2xl md:text-3xl font-black text-black uppercase mx-4">
                        {item}
                    </span>
                ))}
            </Marquee>
        </div>
    );
}
