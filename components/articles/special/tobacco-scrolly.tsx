"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Article } from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowDown, Flame, Leaf, Skull, FlaskConical } from "lucide-react";
import { ViewTransitionLink } from "@/components/ui/view-transition-link";

interface TobaccoScrollyProps {
    article: Article;
    readingTime: string;
}

export function TobaccoScrolly({ article, readingTime }: TobaccoScrollyProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Background Color Transition: Jungle Green -> Ash Grey -> Medical Blue -> Black
    const bgColor = useTransform(
        springScroll,
        [0, 0.2, 0.5, 0.8, 1],
        ["#0f2e18", "#2c2c2c", "#1e293b", "#000000", "#000000"]
    );

    // Text Content (Parsed roughly from standard article or hardcoded for the "Experience")
    // In a real scenario, we'd parse article.content, but for a "Bespoke" feel, we structure it manually or map sections.
    // For this demo, I'll structure the visual "Scenes" and overlay the actual article content container.

    return (
        <motion.div
            ref={containerRef}
            style={{ backgroundColor: bgColor }}
            className="min-h-[400vh] relative text-white transition-colors duration-1000"
        >
            {/* PROGRESS BAR */}
            <motion.div
                style={{ scaleX: springScroll }}
                className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 z-[100] origin-left"
            />

            {/* SCENE 1: THE ORIGINS (Sticky Background) */}
            <div className="h-screen sticky top-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
                        scale: useTransform(scrollYProgress, [0, 0.2], [1, 1.2]),
                        y: useTransform(scrollYProgress, [0, 0.2], [0, -100])
                    }}
                    className="absolute inset-0 z-0"
                >
                    {/* Placeholder for Aztec/Jungle Visual */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5d2294c?q=80&w=2948&auto=format&fit=crop')] bg-cover bg-center brightness-[0.3] grayscale-[50%]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f2e18]" />
                </motion.div>

                {/* Hero Title */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
                        y: useTransform(scrollYProgress, [0, 0.15], [0, -50])
                    }}
                    className="relative z-10 text-center px-4 max-w-4xl"
                >
                    <div className="flex justify-center mb-6">
                        <span className="bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase backdrop-blur-md">
                            Özel İnteraktif Makale
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                        TÜTÜN
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                        Aztek tapınaklarından modern dünyanın ciğerlerine uzanan dumanlı bir yolculuk.
                    </p>
                    <div className="mt-12 animate-bounce">
                        <ArrowDown className="mx-auto w-8 h-8 opacity-50" />
                    </div>
                </motion.div>
            </div>

            {/* SCENE 2: THE SPREAD (Smoke & Maps) */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 -mt-[50vh]">
                <section className="mb-96 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-green-400">
                            <Leaf className="w-6 h-6" />
                            Kutsal Dumanın Doğuşu
                        </h2>
                        <div className="prose prose-invert prose-lg">
                            <p>
                                M.Ö. 6000'lere dayanan kalıntılar, tütünün Amerika kıtasındaki yerliler için sadece bir bitki değil,
                                tanrılarla iletişim kurmanın bir aracı olduğunu gösteriyor.
                            </p>
                            <p>
                                Aztekler ve Mayalar için duman, duaları gökyüzüne taşıyan somut bir araçtı. Ancak bu kutsal bitki,
                                Kolomb'un gemileriyle Avrupa'ya ulaştığında, kaderi sonsuza dek değişecekti.
                            </p>
                        </div>
                    </motion.div>
                </section>

                <section className="mb-96 relative">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-amber-500">
                            <Flame className="w-6 h-6" />
                            Avrupa'nın "Her Derde Deva" İlacı
                        </h2>
                        <div className="prose prose-invert prose-lg">
                            <p>
                                16. yüzyılda Avrupa'ya ilk geldiğinde, tütün bir keyif verici değil, bir "mucize ilaç" olarak pazarlandı.
                                Baş ağrısından vebaya, diş ağrısından kansere kadar her şeye iyi geldiği iddia edildi.
                            </p>
                            <p>
                                Jean Nicot (Nikotin'e adını veren kişi), Fransa kraliçesine migren ilacı olarak tütün tozunu (enfiyeyi) tanıttığında,
                                global bir bağımlılığın tohumlarını bilmeden atıyordu.
                            </p>
                        </div>
                    </motion.div>
                </section>
            </div>


            {/* SCENE 3: THE CHEMISTRY (Sticky Nicotine Molecule) */}
            <div className="h-screen sticky top-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0.4, 0.5, 0.7], [0, 1, 0]),
                        scale: 1
                    }}
                    className="absolute inset-0 z-0 flex items-center justify-center"
                >
                    {/* Abstract Molecule Visualization */}
                    <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-20">
                        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
                            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 20" className="text-blue-500" />
                            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400" />
                            <circle cx="100" cy="100" r="20" fill="currentColor" className="text-white" />
                            <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="1" className="text-blue-900/50" />
                            <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" className="text-blue-900/50" />
                        </svg>
                    </div>
                </motion.div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 -mt-[50vh]">
                <section className="mb-96 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 p-8 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-cyan-400">
                            <FlaskConical className="w-6 h-6" />
                            C₁₀H₁₄N₂: Nikotin
                        </h2>
                        <div className="prose prose-invert prose-lg">
                            <p>
                                Doğanın en güçlü nörotoksinlerinden biri. Beyne ulaştığı anda (sadece 7 saniye sürer),
                                dopamin havuzlarını serbest bırakarak sahte bir ödül hissi yaratır.
                            </p>
                            <p>
                                Bitki aslında bunu böceklerden korunmak için bir savunma mekanizması olarak üretir.
                                Biz ise bu zehri keyif için kullanıyoruz.
                            </p>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* SCENE 4: THE PRICE (Dark/Health) */}
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
                <section className="mb-48 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-red-950/30 backdrop-blur-xl border border-red-500/20 p-8 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-red-500">
                            <Skull className="w-6 h-6" />
                            Bedel
                        </h2>
                        <div className="prose prose-invert prose-lg">
                            <p>
                                Tütün dumanında 7000'den fazla kimyasal bulunur. Bunların en az 70'inin kansere neden olduğu kanıtlanmıştır.
                                Katran, karbon monoksit, arsenik, amonyak...
                            </p>
                            <p className="text-xl font-bold text-white mt-4">
                                Her yıl 8 milyondan fazla insan bu "zevk" uğruna hayatını kaybediyor.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* CONCLUSION / READ MORE */}
                <div className="flex flex-col items-center justify-center text-center py-24 gap-8">
                    <h3 className="text-2xl font-bold">Makalenin Tamamını Oku</h3>
                    <p className="text-zinc-400 max-w-lg">
                        Bu interaktif deneyim, makalenin sadece bir özetidir. Detaylı tarihçe ve bilimsel veriler için orijinal metne dönebilirsiniz.
                    </p>
                    <ViewTransitionLink
                        href="/blog"
                        className="bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform"
                    >
                        Blog'a Dön
                    </ViewTransitionLink>
                </div>
            </div>

        </motion.div>
    );
}
