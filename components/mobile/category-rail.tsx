"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CategoryRail() {
    const categories = [
        { id: 1, label: "KUANTUM", color: "bg-[#facc15]" }, // Warning Yellow
        { id: 2, label: "KOZMOS", color: "bg-[#8b5cf6]" },  // Quantum Purple
        { id: 3, label: "MEKANİK", color: "bg-white" },
        { id: 4, label: "TARİH", color: "bg-[#facc15]" },
        { id: 5, label: "DENEY", color: "bg-white" },
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-4 pl-4">
            {/* 
         ATOM KURAL 4: ANİMASYON EĞRİLERİ (Spring/Click)
         ATOM KURAL 2: SINIR MATEMATİĞİ (3px Border)
         ATOM KURAL 1: GÖLGE FİZİĞİ (neo-sm for standard items)
      */}
            <div className="flex gap-4 min-w-max">
                {categories.map((cat) => (
                    <motion.button
                        key={cat.id}
                        className={cn(
                            "h-12 px-6 flex items-center justify-center border-[3px] border-black shadow-neo-sm rounded-lg font-black text-sm tracking-wider uppercase text-black",
                            cat.color
                        )}
                        whileTap={{ scale: 0.95, x: 2, y: 2, boxShadow: "0px 0px 0px 0px #000" }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {cat.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
