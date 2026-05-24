"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Konami Code ve Easter Egg kelimeleri
const EASTER_EGGS = {
  GRAVITY: "gravity",
  QUANTUM: "quantum",
  LIGHTSPEED: "lightspeed"
};

export function EasterEggs() {
  const [keys, setKeys] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Sadece harfleri ve sayıları kaydet
      if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
        setKeys((prev) => {
          const newKeys = (prev + e.key.toLowerCase()).slice(-20); // Son 20 tuşu tut
          checkEasterEggs(newKeys);
          return newKeys;
        });
      }
    };

    const checkEasterEggs = (currentKeys: string) => {
      if (currentKeys.endsWith(EASTER_EGGS.GRAVITY)) {
        triggerGravity();
        setKeys(""); // Sıfırla
      } else if (currentKeys.endsWith(EASTER_EGGS.QUANTUM)) {
        triggerQuantum();
        setKeys("");
      } else if (currentKeys.endsWith(EASTER_EGGS.LIGHTSPEED)) {
        triggerLightspeed();
        setKeys("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerGravity = () => {
    toast.success("🍎 Newton'un elması düştü! (Yerçekimi aktif)");
    
    // Güvenli olması için CSS'i style tag'i ile enjekte ediyoruz
    const style = document.createElement('style');
    style.id = "easter-egg-gravity";
    style.innerHTML = `
      body, main, article, img, h1, h2, h3, p, a, button, div.flex {
        transition: transform 3s cubic-bezier(0.55, 0.085, 0.68, 0.53) !important;
        transform: translateY(150vh) rotate(calc(-45deg + 90deg * var(--random, 0.5))) !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    // Rastgele dönüş açısı için DOM üzerinde --random değişkeni ayarla
    document.querySelectorAll('*').forEach((el) => {
        (el as HTMLElement).style.setProperty('--random', Math.random().toString());
    });

    setTimeout(() => {
      document.getElementById("easter-egg-gravity")?.remove();
      toast.info("Yerçekimi normale döndü. (Şimdilik)");
    }, 5000);
  };

  const triggerQuantum = () => {
    toast.success("🌌 Heisenberg haklıydı! (Kuantum dalgalanması başladı)");
    
    const style = document.createElement('style');
    style.id = "easter-egg-quantum";
    style.innerHTML = `
      @keyframes quantum-jitter {
        0% { transform: translate(0, 0) scale(1) blur(0px); opacity: 1; }
        25% { transform: translate(calc(-10px * var(--r1)), calc(10px * var(--r2))) scale(1.05) blur(2px); opacity: 0.8; }
        50% { transform: translate(calc(15px * var(--r2)), calc(-5px * var(--r1))) scale(0.95) blur(0px); opacity: 0.5; }
        75% { transform: translate(calc(-5px * var(--r1)), calc(-15px * var(--r2))) scale(1.1) blur(4px); opacity: 0.9; }
        100% { transform: translate(0, 0) scale(1) blur(0px); opacity: 1; }
      }
      body * {
        animation: quantum-jitter 0.2s infinite alternate !important;
        mix-blend-mode: exclusion !important;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('*').forEach((el) => {
        (el as HTMLElement).style.setProperty('--r1', Math.random().toString());
        (el as HTMLElement).style.setProperty('--r2', Math.random().toString());
    });

    setTimeout(() => {
      document.getElementById("easter-egg-quantum")?.remove();
      toast.info("Dalga fonksiyonu çöktü. Gözlemci etkisi.");
    }, 4000);
  };

  const triggerLightspeed = () => {
    toast.success("🚀 Işık hızına çıkıyoruz. Tutunun!");
    
    const style = document.createElement('style');
    style.id = "easter-egg-lightspeed";
    style.innerHTML = `
      @keyframes warp-speed {
        0% { transform: scale(1) translateZ(0); filter: blur(0); }
        50% { transform: scale(3) translateZ(500px); filter: blur(10px) brightness(2); }
        100% { transform: scale(0.1) translateZ(-1000px); filter: blur(20px) brightness(3); opacity: 0; }
      }
      body {
        animation: warp-speed 3s ease-in forwards !important;
        overflow: hidden !important;
        background: black !important;
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.getElementById("easter-egg-lightspeed")?.remove();
      toast.info("Gideceğimiz yerde yollara ihtiyacımız yok.");
    }, 3500);
  };

  return null; // Arayüzü yok, sadece arka planda pusuda bekleyen bir hayalet!
}
