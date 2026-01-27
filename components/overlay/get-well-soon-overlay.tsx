"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function GetWellSoonOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cats, setCats] = useState<{ id: number; left: number; duration: number; delay: number; char: string }[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate rain cats
    const catChars = ["🐱", "😸", "😻", "😽", "🐈", "💖"];
    const newCats = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position 0-100%
      duration: 3 + Math.random() * 4, // Random duration 3-7s
      delay: Math.random() * 5, // Random delay
      char: catChars[Math.floor(Math.random() * catChars.length)],
    }));
    setCats(newCats);
  }, []);

  if (!mounted) return null;

  // Use Portal to render outside of the app root to avoid hydration/nesting issues
  return createPortal(
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >

      {/* CSS Styles for Rain */}
      <style jsx global>{`
        @keyframes rain {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .cat-rain {
          position: absolute;
          top: -50px;
          animation-name: rain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Raining Cats Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="cat-rain"
            style={{
              left: `${cat.left}%`,
              animationDuration: `${cat.duration}s`,
              animationDelay: `${cat.delay}s`,
              fontSize: `${Math.random() * 20 + 20}px`,
            }}
          >
            {cat.char}
          </div>
        ))}
      </div>

      {/* Card */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8 border-4 border-pink-200 transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-90'}`}
        style={{
          boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.5)", // Pink glow
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-full transition-colors z-50 focus:outline-none font-bold shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Decor Circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-100 rounded-full translate-x-1/2 translate-y-1/2 opacity-50" />

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <div className="text-8xl filter drop-shadow-lg animate-bounce">
            😿
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-pink-500 tracking-tight font-outfit">
              Geçmiş Olsun!
            </h2>
            <p className="text-pink-400 font-medium text-lg leading-relaxed px-4">
              Baran Bozkurt, umarım en kısa sürede iyileşirsin. Kedicikler sana şifa diliyor!
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setIsVisible(false)}
              className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg shadow-pink-500/30 transition-all font-outfit hover:scale-105 active:scale-95"
            >
              Teşekkürler ❤️
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
