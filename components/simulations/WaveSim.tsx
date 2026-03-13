"use client";

import React, { useState, useEffect, useRef } from "react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider, PhysicsToggle } from "./core/ui";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

export function WaveSim({ simData }: { simData: any }) {
    const accentColor = simData?.color || "#16A34A";
    const canvasWidth = 800;
    const canvasHeight = 400;

    const [amplitude1, setAmplitude1] = useState(50);
    const [frequency1, setFrequency1] = useState(2);
    const [amplitude2, setAmplitude2] = useState(50);
    const [frequency2, setFrequency2] = useState(2);
    const [showSuperposition, setShowSuperposition] = useState(true);
    const [showIndividual, setShowIndividual] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);

    const animationRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    const resetSim = () => { setIsPlaying(false); setTime(0); if (animationRef.current) cancelAnimationFrame(animationRef.current); };

    const loop = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;
        if (isPlaying) setTime(t => t + dt);
        animationRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        animationRef.current = requestAnimationFrame(loop);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isPlaying]);

    const generateWavePath = (amp: number, freq: number, yOffset: number) => {
        const points: string[] = [];
        for (let x = 0; x <= canvasWidth; x += 2) {
            const k = (2 * Math.PI * freq) / canvasWidth;
            const omega = 2 * Math.PI * freq;
            const y = yOffset + amp * Math.sin(k * x * 5 - omega * time);
            points.push(`${x},${y}`);
        }
        return points.join(" ");
    };

    const generateSuperpositionPath = () => {
        const points: string[] = [];
        const yOffset = canvasHeight / 2;
        for (let x = 0; x <= canvasWidth; x += 2) {
            const k1 = (2 * Math.PI * frequency1) / canvasWidth;
            const k2 = (2 * Math.PI * frequency2) / canvasWidth;
            const omega1 = 2 * Math.PI * frequency1;
            const omega2 = 2 * Math.PI * frequency2;
            const y1 = amplitude1 * Math.sin(k1 * x * 5 - omega1 * time);
            const y2 = amplitude2 * Math.sin(k2 * x * 5 - omega2 * time);
            points.push(`${x},${yOffset + y1 + y2}`);
        }
        return points.join(" ");
    };

    const [missions, setMissions] = useState([
        { id: 1, title: "Yapıcı Girişim", desc: "İki dalgayi aynı genlik ve frekansa getir. Süperpozisyonu izle!", isCompleted: false,
            condition: () => amplitude1 === amplitude2 && frequency1 === frequency2 && isPlaying,
            successText: "Harika! Aynı fazu dalgalar buluşunca genlikler toplanır (A_toplam = A1 + A2). Bu yapıcı girişimdir!" },
        { id: 2, title: "Yıkıcı Girişim", desc: "Frekansları eşitle, bir dalganın genliğini negatif hale getirmeye çalış (veya eşit ama yarı yarıya genlik).", isCompleted: false,
            condition: () => frequency1 === frequency2 && amplitude1 !== amplitude2 && isPlaying,
            successText: "Mükemmel! Farklı genlikli ama aynı frekanslı dalgalar süperpozisyonda daha karmaşık bir dalga oluşturur." }
    ]);

    useEffect(() => { setMissions(prev => prev.map(m => { if (!m.isCompleted && m.condition()) return { ...m, isCompleted: true }; return m; })); }, [amplitude1, amplitude2, frequency1, frequency2, isPlaying]);

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 flex items-center justify-center gap-2 text-black font-black py-3 rounded-lg border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all uppercase tracking-wider text-sm"
                    style={{ backgroundColor: accentColor }}>
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black" />}
                    {isPlaying ? "DURDUR" : "BAŞLAT"}
                </button>
                <button onClick={resetSim} className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black" style={{ backgroundColor: "#2563EB", color: '#fff' }}>Dalga 1</span>
                <PhysicsSlider label="Genlik (A₁)" value={amplitude1} min={10} max={80} step={5} unit="px" onChange={setAmplitude1} color="#2563EB" />
                <PhysicsSlider label="Frekans (f₁)" value={frequency1} min={0.5} max={5} step={0.5} unit="Hz" onChange={setFrequency1} color="#2563EB" />
            </div>

            <div className="p-3 rounded-lg border-[2px] border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <span className="text-[10px] font-black text-black px-2 uppercase tracking-widest rounded py-0.5 border-[2px] border-black" style={{ backgroundColor: "#DC2626", color: '#fff' }}>Dalga 2</span>
                <PhysicsSlider label="Genlik (A₂)" value={amplitude2} min={10} max={80} step={5} unit="px" onChange={setAmplitude2} color="#DC2626" />
                <PhysicsSlider label="Frekans (f₂)" value={frequency2} min={0.5} max={5} step={0.5} unit="Hz" onChange={setFrequency2} color="#DC2626" />
            </div>

            <PhysicsToggle label="Süperpozisyonu Göster" checked={showSuperposition} onChange={setShowSuperposition} color={accentColor} />
            <PhysicsToggle label="Bireysel Dalgaları Göster" checked={showIndividual} onChange={setShowIndividual} color="#D97706" />
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black text-foreground uppercase">Dalga Girişimi</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
                Fizikteki <strong>Süperpozisyon İlkesi</strong>, kelimenin tam anlamıyla &ldquo;üst üste koyma&rdquo; demektir. İki veya daha fazla dalga aynı ortamdan geçtiğinde, herhangi bir noktadaki toplam yer değiştirme, o noktadaki bireysel yer değiştirmelerin <strong>cebirsel toplamına eşittir</strong>.
            </p>
            <div className="p-4 rounded-lg border-[2px] border-black shadow-[3px_3px_0px_0px_#000] text-center" style={{ backgroundColor: accentColor }}>
                <span className="text-xs text-black uppercase font-black block mb-2">Dalga Denklemi</span>
                <p className="text-xl font-mono text-black font-bold">y = A · sin(kx - ωt)</p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
                <li>• <strong>Yapıcı Girişim:</strong> Aynı faz — genlikler toplanır, dalga büyür.</li>
                <li>• <strong>Yıkıcı Girişim:</strong> Ters faz — genlikler birbirini götürür, dalga küçülür/sıfırlanır.</li>
                <li>• <strong>Vurma (Beat):</strong> Birbirine çok yakın frekanstaki dalgalar karıştığında oluşan genlik modülasyonu.</li>
            </ul>
        </div>
    );

    const Missions = (
        <div className="space-y-4">
            {missions.map((m) => (
                <div key={m.id} className={`relative p-4 rounded-lg border-[2px] transition-all duration-500 overflow-hidden ${m.isCompleted ? "border-green-700 bg-green-900/20" : "border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000]"}`}>
                    {m.isCompleted && <div className="absolute top-4 right-4 text-green-600"><CheckCircle2 className="w-5 h-5" /></div>}
                    <h3 className={`font-black uppercase tracking-tight mb-2 ${m.isCompleted ? 'text-green-500' : 'text-foreground'}`}>{m.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4">{m.desc}</p>
                    <AnimatePresence>{m.isCompleted && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-3 mt-3 border-t border-green-800 text-xs text-green-500 font-medium leading-relaxed">{m.successText}</motion.div>
                    )}</AnimatePresence>
                </div>
            ))}
        </div>
    );

    return (
        <SimulationLayout title={simData?.title || "Dalga Girişimi"} color={accentColor} controlsArea={Controls} theoryArea={Theory} missionsArea={Missions}>
            <div className="w-full h-full p-0 relative flex items-center justify-center">
                <svg width="100%" height="100%" viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} preserveAspectRatio="xMidYMid meet" className="origin-center">
                    <line x1="0" y1={canvasHeight/2} x2={canvasWidth} y2={canvasHeight/2} stroke="#555" strokeWidth="1" strokeDasharray="5 5" />
                    {showIndividual && (<><polyline points={generateWavePath(amplitude1, frequency1, canvasHeight / 2)} fill="none" stroke="#2563EB" strokeWidth="3" opacity="0.6" /><polyline points={generateWavePath(amplitude2, frequency2, canvasHeight / 2)} fill="none" stroke="#DC2626" strokeWidth="3" opacity="0.6" /></>)}
                    {showSuperposition && (<polyline points={generateSuperpositionPath()} fill="none" stroke={accentColor} strokeWidth="4" />)}
                </svg>
            </div>
        </SimulationLayout>
    );
}
