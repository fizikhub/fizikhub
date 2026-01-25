"use client";

import { CategoryRail } from "@/components/mobile/category-rail";
import { MobileNavbar } from "@/components/mobile/mobile-navbar";
import { NeoCard } from "@/components/mobile/neo-card";

export default function MobileDemoPage() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white pb-24 font-sans">
            {/* Header / Logo Area */}
            <div className="p-4 pt-12">
                <h1 className="text-3xl font-black uppercase text-white tracking-tighter leading-none border-l-[3px] border-[#facc15] pl-3">
                    Fizik<span className="text-[#facc15]">Hub</span>
                    <br />
                    <span className="text-sm font-bold text-gray-500 tracking-[0.3em]">Mobil Arayüz v8</span>
                </h1>
            </div>

            {/* Category Rail */}
            <div className="mb-6">
                <CategoryRail />
            </div>

            {/* Content Feed */}
            <div className="px-4 space-y-6">
                <NeoCard
                    title="Schrödinger'in Kedisi ve Kuantum Süperpozisyonu"
                    category="Kuantum"
                    readTime="5 dk"
                    color="bg-[#facc15]"
                />
                <NeoCard
                    title="Kara Deliklerin Olay Ufku: Işığın Kaçamadığı Nokta"
                    category="Kozmos"
                    readTime="8 dk"
                    color="bg-[#8b5cf6]"
                />
                <NeoCard
                    title="Newton Mekaniği vs. Görelilik Teorisi"
                    category="Fizik"
                    readTime="12 dk"
                    color="bg-white"
                />
            </div>

            {/* Dock */}
            <MobileNavbar />
        </div>
    );
}
