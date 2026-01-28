```
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface GetWellSoonOverlayProps {
  user?: User | null;
}

export function GetWellSoonOverlay({ user }: GetWellSoonOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cats, setCats] = useState<{ id: number; left: number; duration: number; delay: number; img: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    // User uploaded images
    const catImages = [
      "/cats/cat1.png",
      "/cats/cat2.png",
      "/cats/cat3.png",
      "/cats/cat4.png",
      "/cats/cat5.png"
    ];

    // Generate rain cats
    const newCats = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position 0-100%
      duration: 3 + Math.random() * 4, // Random duration 3-7s
      delay: Math.random() * 5, // Random delay
      img: catImages[i % catImages.length], // Cycle through images
    }));
    setCats(newCats);
  }, []);

  if (!mounted) return null;
  // if (!isVisible) return null;

  // Ideally check for username here if profile data was passed, 
  // but for now we show it based on the requirement to ensure they see it.
  
  return createPortal(
    <div 
      className={`fixed inset - 0 z - [99999] flex items - center justify - center bg - black / 80 backdrop - blur - sm p - 4 transition - opacity duration - 500 ${ isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none' } `}
    >
      
      {/* CSS Styles for Rain */}
      <style jsx global>{`
@keyframes rain {
  0 % { transform: translateY(-100px) rotate(0deg); opacity: 0; }
  10 % { opacity: 1; }
  90 % { opacity: 1; }
  100 % { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}
        .cat - rain {
  position: absolute;
  top: -100px;
  animation - name: rain;
  animation - timing - function: linear;
  animation - iteration - count: infinite;
}
`}</style>

      {/* Raining Cats Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="cat-rain"
            style={{
              left: `${ cat.left }% `,
              animationDuration: `${ cat.duration } s`,
              animationDelay: `${ cat.delay } s`,
              width: '80px', 
              height: 'auto'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={cat.img} 
              alt="raining cat" 
              className="w-full h-auto object-cover rounded-full drop-shadow-2xl border-2 border-white/20"
            />
          </div>
        ))}
      </div>

      {/* Card */}
      <div 
        className={`relative w - full max - w - md bg - zinc - 900 / 90 border border - zinc - 800 rounded - 3xl shadow - 2xl overflow - hidden flex flex - col items - center justify - center text - center p - 8 transition - transform duration - 500 ${ isVisible ? 'scale-100' : 'scale-90' } `}
        style={{
          boxShadow: "0 0 50px -12px rgba(236, 72, 153, 0.3)", // Subtle pink glow
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full transition-colors z-50 focus:outline-none"
        >
          <X size={20} />
        </button>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          {/* Center Image - Nanao/Banana Cat */}
          <div className="w-48 h-48 mx-auto relative group">
             <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/cats/banana_cat.png"
              alt="Banana Cat"
              className="w-full h-full object-cover rounded-full border-4 border-zinc-800 shadow-2xl relative z-10"
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight font-outfit">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Geçmiş Olsun
              </span>
            </h2>
            <p className="text-zinc-300 font-medium text-lg leading-relaxed px-2">
              Silginim hanım, umarım en kısa sürede iyileşirsin ve dünyayı yok edersin!
            </p>
          </div>

          <div className="pt-2">
             <button
              onClick={() => setIsVisible(false)}
              className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-full font-bold shadow-lg transition-all font-outfit hover:scale-105 active:scale-95 uppercase tracking-wide text-sm"
             >
               Teşekkürler
             </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
