"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { physicsTimelineData } from "@/lib/physics-history-data";

export function PhysicsTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-12 md:py-24 px-4 md:px-8">
      {/* Başlık Alanı (Neo-brutalist) */}
      <div className="mb-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 inline-block bg-neo-yellow px-6 py-3 border-4 border-black shadow-neo"
        >
          Fizik Tarihi
        </motion.h1>
        <br />
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-bold bg-white border-3 border-black shadow-neo-sm px-6 py-3 inline-block"
        >
          Antik Yunan'dan Kuantum'a Zaman Yolculuğu
        </motion.p>
      </div>

      {/* Merkez Çizgi (Desktop) / Sol Çizgi (Mobil) */}
      <div className="absolute left-8 md:left-1/2 top-48 bottom-0 w-1.5 md:w-2 bg-black transform md:-translate-x-1/2 z-0"></div>

      <div className="relative z-10 flex flex-col gap-16 md:gap-32">
        {physicsTimelineData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
              className={`flex flex-col md:flex-row items-center w-full ${isEven ? "md:justify-start" : "md:justify-end"} relative`}
            >
              {/* Zaman Çizelgesi Noktası (Dot) */}
              <div className="absolute left-0 md:left-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-black bg-white transform -translate-x-[14px] md:-translate-x-1/2 flex items-center justify-center shadow-neo-sm z-20">
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${item.colorClass}`}></div>
              </div>

              {/* İçerik Kartı */}
              <div className={`w-full pl-16 md:pl-0 md:w-[45%] ${isEven ? "md:pr-16" : "md:pl-16"}`}>
                <div className="p-6 md:p-8 border-4 border-black bg-white shadow-neo hover:shadow-neo-xl hover:-translate-y-2 transition-all duration-300 relative group">
                  
                  {/* Dönem Rozeti */}
                  <div className={`absolute -top-5 right-4 md:-right-6 border-3 border-black px-4 py-1.5 text-sm md:text-base font-black uppercase shadow-neo-sm ${item.colorClass}`}>
                    {item.era}
                  </div>

                  <div className="text-5xl font-black mb-2 opacity-10 group-hover:opacity-100 transition-opacity absolute top-4 right-6 pointer-events-none text-black">
                    {item.year}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight pr-12">
                    {item.title}
                  </h3>
                  
                  <div className="text-lg font-bold text-gray-800 mb-5 inline-block border-b-4 border-black pb-1">
                    {item.scientist}
                  </div>
                  
                  <p className="text-base md:text-lg font-medium leading-relaxed text-gray-900">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
