"use client";

import { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MICROSTATE_PARTICLE_COUNT = 25;

function createRandomMicrostatePositions() {
  return Array.from({ length: MICROSTATE_PARTICLE_COUNT }).map(() => ({
    x: Math.random() * 200 + 10,
    y: Math.random() * 200 + 10,
  }));
}

function createInitialDiffusionPosition() {
  return {
    x: Math.random() * 45,
    y: Math.random() * 90 + 5,
  };
}

// --- Animasyon 1: Düzen vs Düzensizlik (Microstates) ---
export function EntropyMicrostates() {
  const [isOrdered, setIsOrdered] = useState(true);

  // Grid pozisyonları (Düzenli)
  const getOrderedPos = (i: number) => ({
    x: (i % 5) * 40 + 20,
    y: Math.floor(i / 5) * 40 + 20,
  });

  const [randomPositions] = useState(createRandomMicrostatePositions);

  const getRandomPos = (i: number) => randomPositions[i] || { x: 0, y: 0 };

  return (
    <div className="my-8 rounded-xl border border-blue-500/30 bg-blue-950/20 p-6 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.1)]">
      <h3 className="mb-4 text-xl font-bold text-primary">Entropi ve Olasılık</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Sol taraftaki düzenli yapıyı bozmak kolaydır, ancak rastgele dağılmış bir yapının
        kendiliğinden tekrar düzenli hale gelmesi istatiksel olarak imkansıza yakındır.
      </p>

      <div className="relative mx-auto h-[240px] w-[240px] rounded-lg border border-white/20 bg-black/60 shadow-inner">
        {Array.from({ length: MICROSTATE_PARTICLE_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              initial={getOrderedPos(i)}
              animate={{
                x: isOrdered ? getOrderedPos(i).x : getRandomPos(i).x,
                y: isOrdered ? getOrderedPos(i).y : getRandomPos(i).y,
              }}
              transition={{
                duration: 1.5,
                type: "spring",
                bounce: 0.2,
                delay: isOrdered ? i * 0.01 : (i % 5) * 0.05 // Deterministic delay to avoid hydration mismatch
              }}
              className="absolute h-3 w-3 rounded-full shadow-sm"
              style={{
                backgroundColor: isOrdered ? "#3b82f6" : "#ef4444",
                boxShadow: isOrdered ? "0 0 5px #3b82f6" : "0 0 5px #ef4444"
              }}
            />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => setIsOrdered(false)}
          disabled={!isOrdered}
          className="gap-2 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
        >
          <Play className="h-4 w-4" />
          Entropiyi Artır
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsOrdered(true)}
          disabled={isOrdered}
          className="gap-2 border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-400"
        >
          <RotateCcw className="h-4 w-4" />
          Düzeni Geri Getir
        </Button>
      </div>

      {!isOrdered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-xs text-muted-foreground italic"
        >
          Not: Gerçek evrende &quot;Düzeni Geri Getir&quot; butonu yoktur.
        </motion.p>
      )}
    </div>
  );
}

// --- Animasyon 2: Gaz Yayılımı (Diffusion) ---
export function EntropyDiffusion() {
  const [barrierRemoved, setBarrierRemoved] = useState(false);

  // Parçacıklar
  const particles = Array.from({ length: 40 });

  return (
    <div className="my-8 rounded-xl border border-purple-500/30 bg-purple-950/20 p-6 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]">
      <h3 className="mb-4 text-xl font-bold text-secondary">Gazların Yayılması</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        Engel kalktığında, gaz molekülleri tüm hacme yayılır. Bu süreç geri döndürülemez;
        gaz kendiliğinden tekrar köşeye toplanmaz.
      </p>

      <div className="relative mx-auto h-[200px] w-full max-w-[400px] overflow-hidden rounded-lg border border-white/20 bg-black/60 shadow-inner">
        {/* Engel */}
        <motion.div
          animate={{ height: barrierRemoved ? 0 : "100%" }}
          transition={{ duration: 0.5 }}
          className="absolute left-1/2 top-0 z-10 w-1 -translate-x-1/2 bg-white/50 backdrop-blur-md"
        />

        {/* Parçacıklar */}
        {particles.map((_, i) => (
          <Particle key={i} index={i} barrierRemoved={barrierRemoved} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={() => setBarrierRemoved(!barrierRemoved)}
          variant={barrierRemoved ? "secondary" : "default"}
          className="w-40"
        >
          {barrierRemoved ? "Sistemi Sıfırla" : "Engeli Kaldır"}
        </Button>
      </div>
    </div>
  );
}

function Particle({ index, barrierRemoved }: { index: number; barrierRemoved: boolean }) {
  const [pos, setPos] = useState(createInitialDiffusionPosition);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    if (barrierRemoved) {
      interval = setInterval(() => {
        setPos(prev => ({
          x: Math.max(2, Math.min(98, prev.x + (Math.random() - 0.5) * 10)),
          y: Math.max(5, Math.min(95, prev.y + (Math.random() - 0.5) * 10))
        }));
      }, 100 + (index % 5) * 40);
    } else {
      resetTimer = setTimeout(() => {
        setPos(createInitialDiffusionPosition());
      }, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [barrierRemoved, index]);

  return (
    <motion.div
      animate={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
      transition={{
        duration: barrierRemoved ? 0.5 : 0,
        ease: "linear"
      }}
      className="absolute h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
    />
  );
}
