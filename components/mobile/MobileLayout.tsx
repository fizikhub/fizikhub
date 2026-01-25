"use client";

import React, { useState } from 'react';
import { 
  Atom, 
  Orbit, 
  Cpu, 
  Flame, 
  Lightbulb, 
  Home, 
  Book, 
  PenTool as Pen, 
  MessageSquare as Message, 
  User,
  Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";

// --- GÖREV 1: KATEGORİ KAYDIRICISI ---
const categories = [
  { id: 'kuantum', name: 'Kuantum', icon: Atom },
  { id: 'astrofizik', name: 'Astrofizik', icon: Orbit },
  { id: 'teknoloji', name: 'Teknoloji', icon: Cpu },
  { id: 'termidodinamik', name: 'Termodinamik', icon: Flame },
  { id: 'optik', name: 'Optik', icon: Lightbulb },
  { id: 'mekanik', name: 'Mekanik', icon: Zap },
];

const CategorySlider = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-full py-6">
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex-shrink-0 w-28 h-28 flex flex-col items-center justify-center gap-3",
              "bg-[#1f2937] border-2 border-white rounded-none transition-all duration-75",
              "shadow-[4px_4px_0px_0px_#facc15]",
              "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
              activeCategory === cat.id && "translate-x-[2px] translate-y-[2px] shadow-none border-[#facc15]"
            )}
          >
            <cat.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- GÖREV 2: MOBİL NAVBAR ---
const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'lessons', icon: Book, label: 'Dersler' },
  { id: 'blog', icon: Pen, label: 'Test/Blog' },
  { id: 'community', icon: Message, label: 'Topluluk' },
  { id: 'profile', icon: User, label: 'Profil' },
];

const BottomNavbar = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[#facc15] border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000000] h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-none transition-none duration-0",
                isActive ? "bg-black" : "bg-transparent"
              )}
            >
              <item.icon 
                className={cn(
                  "w-6 h-6",
                  isActive ? "text-[#facc15]" : "text-black"
                )} 
                strokeWidth={2.5}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// --- MAIN LAYOUT ---
export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-['Space_Grotesk'] selection:bg-[#8b5cf6] selection:text-white">
      {/* Header Placeholder */}
      <header className="p-6 pt-12">
        <h1 className="text-4xl font-['Archivo_Black'] uppercase tracking-tighter leading-none">
          Fizik<span className="text-[#facc15]">Hub</span>
        </h1>
        <p className="text-[#8b5cf6] font-black mt-2 text-sm tracking-widest uppercase">
          Karanlık Fizik Keşfi
        </p>
      </header>

      {/* Category Slider Section */}
      <section className="mt-4">
        <div className="px-6 mb-2">
          <h2 className="text-lg font-black uppercase tracking-tight inline-block bg-white text-black px-2 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#8b5cf6]">
            Kategoriler
          </h2>
        </div>
        <CategorySlider />
      </section>

      {/* Content Placeholder */}
      <main className="px-6 mt-8 space-y-6 pb-32">
        <div className="bg-[#1f2937] border-3 border-black p-6 shadow-[8px_8px_0px_0px_#8b5cf6] relative overflow-hidden group">
          <div className="absolute top-0 right-0 bg-[#facc15] text-black px-3 py-1 font-black text-xs border-l-3 border-b-3 border-black uppercase">
            Öne Çıkan
          </div>
          <h3 className="text-2xl font-['Archivo_Black'] uppercase mb-3 leading-tight leading-none">
            Kuantum Dolanıklığı ve Gerçeklik
          </h3>
          <p className="text-sm text-gray-400 mb-4 font-medium leading-relaxed">
            Einstein'ın "uzaktan ürkütücü etkileşim" dediği bu fenomen, günümüz teknolojisinde nasıl bir devrim yaratıyor?
          </p>
          <button className="bg-white text-black border-2 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            Hemen Oku
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1f2937] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#facc15] flex flex-col items-center text-center">
            <Zap className="text-[#facc15] mb-2" />
            <div className="text-xs font-black uppercase">Yeni Testler</div>
          </div>
          <div className="bg-[#1f2937] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#8b5cf6] flex flex-col items-center text-center">
            <Message className="text-[#8b5cf6] mb-2" />
            <div className="text-xs font-black uppercase">Soru Sor</div>
          </div>
        </div>
      </main>

      {/* Bottom Floating Nav */}
      <BottomNavbar />

      {/* Styles for fonts and scrollbar-hide */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
