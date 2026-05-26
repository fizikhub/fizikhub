"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";

type SimulationMeta = {
    color?: string | null;
    title?: string | null;
};

function formatNumber(value: number, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}

function photonColor(wavelength: number) {
    if (wavelength < 380) return "#A78BFA";
    if (wavelength < 460) return "#60A5FA";
    if (wavelength < 540) return "#22C55E";
    if (wavelength < 610) return "#EAB308";
    if (wavelength < 700) return "#F97316";
    return "#EF4444";
}

export function PhotoelectricSim({ simData }: { simData?: SimulationMeta }) {
    const accentColor = simData?.color || "#8B5CF6";
    const [wavelength, setWavelength] = useState(420);
    const [intensity, setIntensity] = useState(55);
    const [workFunction, setWorkFunction] = useState(2.3);

    const photo = useMemo(() => {
        const photonEnergy = 1240 / wavelength;
        const maxKineticEnergy = Math.max(0, photonEnergy - workFunction);
        const thresholdWavelength = 1240 / workFunction;
        const electronRate = maxKineticEnergy > 0 ? intensity : 0;
        const stoppingPotential = maxKineticEnergy;

        return {
            photonEnergy,
            maxKineticEnergy,
            thresholdWavelength,
            electronRate,
            stoppingPotential,
            emission: maxKineticEnergy > 0,
        };
    }, [intensity, wavelength, workFunction]);

    const beamColor = photonColor(wavelength);
    const photonCount = Math.max(3, Math.round(intensity / 12));
    const electronCount = photo.emission ? Math.max(2, Math.round(intensity / 15)) : 0;
    const missionItems = [
        {
            title: "Eşik dalga boyu",
            desc: "Dalga boyunu eşik değerinin altına çek ve elektron kopmasını başlat.",
            completed: photo.emission && wavelength < photo.thresholdWavelength,
            successText: "Foton enerjisi iş fonksiyonunu aştığında metalden elektron kopabilir.",
        },
        {
            title: "Şiddet deneyi",
            desc: "Elektron çıkarken ışık şiddetini artır; elektron sayısının arttığını, enerji sınırının aynı kaldığını izle.",
            completed: photo.emission && intensity >= 75,
            successText: "Şiddet daha çok foton demektir; tek elektronun maksimum enerjisini frekans belirler.",
        },
        {
            title: "Durdurma potansiyeli",
            desc: "Kmax değerini 1 eV üstüne çıkar ve durdurma potansiyelini yorumla.",
            completed: photo.stoppingPotential > 1,
            successText: "Elektronları durdurmak için gereken potansiyel fark, maksimum kinetik enerjiyle aynı sayısal değeri taşır.",
        },
    ];

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000]">
                <PhysicsSlider label="Dalga boyu" value={wavelength} min={200} max={800} step={10} unit="nm" onChange={setWavelength} color={beamColor} />
            </div>
            <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000]">
                <PhysicsSlider label="Işık şiddeti" value={intensity} min={10} max={100} step={5} unit="%" onChange={setIntensity} color="#EAB308" />
            </div>
            <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000]">
                <PhysicsSlider label="İş fonksiyonu" value={workFunction} min={1.8} max={5.2} step={0.1} unit="eV" onChange={setWorkFunction} color={accentColor} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Metric label="Foton enerjisi" value={`${formatNumber(photo.photonEnergy, 2)} eV`} />
                <Metric label="Kmax" value={`${formatNumber(photo.maxKineticEnergy, 2)} eV`} />
                <Metric label="Eşik λ" value={`${formatNumber(photo.thresholdWavelength, 0)} nm`} />
                <Metric label="Elektron akışı" value={`${formatNumber(photo.electronRate, 0)}%`} />
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black uppercase text-foreground">Fotoelektrik Olay</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
                Metal yüzeye gelen foton, enerjisi yeterliyse elektronu koparır. Işığın şiddeti elektron sayısını, frekansı ise maksimum kinetik enerjiyi belirler.
            </p>
            <div className="rounded-lg border-[2px] border-black p-4 text-center shadow-[3px_3px_0px_0px_#000]" style={{ backgroundColor: accentColor }}>
                <span className="mb-2 block text-xs font-black uppercase text-black">Einstein bağıntısı</span>
                <p className="font-mono text-2xl font-black text-black">Kmax = hf - φ</p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Eşik frekansın altında elektron kopmaz.</li>
                <li>• Dalga boyu küçüldükçe foton enerjisi artar.</li>
                <li>• Durdurma potansiyeli maksimum kinetik enerjiyi ölçer.</li>
            </ul>
        </div>
    );

    const Missions = (
        <div className="space-y-4">
            {missionItems.map((mission) => (
                <div
                    key={mission.title}
                    className={`relative overflow-hidden rounded-lg border-[2px] p-4 transition-all ${
                        mission.completed ? "border-green-700 bg-green-900/20" : "border-black bg-zinc-900 shadow-[2px_2px_0px_0px_#000]"
                    }`}
                >
                    {mission.completed && <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-green-500" />}
                    <h3 className={`mb-2 font-black uppercase tracking-tight ${mission.completed ? "text-green-500" : "text-foreground"}`}>{mission.title}</h3>
                    <p className="mb-3 text-sm text-zinc-400">{mission.desc}</p>
                    {mission.completed && <p className="border-t border-green-800 pt-3 text-xs font-semibold leading-relaxed text-green-500">{mission.successText}</p>}
                </div>
            ))}
        </div>
    );

    return (
        <SimulationLayout
            title={simData?.title || "Fotoelektrik Olay"}
            color={accentColor}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
            simId="photoelectric"
            parameters={{
                wavelength,
                intensity,
                workFunction,
                photonEnergy: photo.photonEnergy,
                maxKineticEnergy: photo.maxKineticEnergy,
                thresholdWavelength: photo.thresholdWavelength,
                stoppingPotential: photo.stoppingPotential,
                emission: photo.emission,
            }}
        >
            <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_35%,#312E81_0,#111827_42%,#09090B_78%)] p-2">
                <svg width="100%" height="100%" viewBox="0 0 820 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Fotoelektrik olay metal yüzey simülasyonu">
                    <defs>
                        <linearGradient id="beam-gradient" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor={beamColor} stopOpacity="0.05" />
                            <stop offset="100%" stopColor={beamColor} stopOpacity="0.72" />
                        </linearGradient>
                        <marker id="photo-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#E5E7EB" />
                        </marker>
                    </defs>

                    <rect x="54" y="72" width="712" height="382" rx="20" fill="#111827" stroke="#000" strokeWidth="5" />
                    <rect x="520" y="138" width="70" height="250" rx="16" fill="#D4D4D8" stroke="#000" strokeWidth="5" />
                    <rect x="532" y="152" width="46" height="222" rx="12" fill="#71717A" opacity="0.55" />
                    <text x="512" y="420" fill="#E5E7EB" fontSize="17" fontWeight="900">Metal yüzey φ = {formatNumber(workFunction, 1)} eV</text>

                    <polygon points="90,148 520,214 520,306 90,372" fill="url(#beam-gradient)" />
                    {Array.from({ length: photonCount }, (_, index) => {
                        const y = 166 + (index % 6) * 38;
                        const x1 = 104 + Math.floor(index / 6) * 28;
                        return (
                            <g key={`photon-${index}`} opacity="0.92">
                                <line x1={x1} y1={y} x2="500" y2={230 + (index % 5) * 18} stroke={beamColor} strokeWidth="4" markerEnd="url(#photo-arrow)" />
                                <circle cx={x1 + 20} cy={y - 8} r="7" fill={beamColor} stroke="#000" strokeWidth="2" />
                            </g>
                        );
                    })}

                    {photo.emission ? (
                        Array.from({ length: electronCount }, (_, index) => {
                            const startY = 170 + index * 28;
                            const endX = 666 + index * 8;
                            const endY = 138 + (index % 5) * 58;
                            return (
                                <g key={`electron-${index}`}>
                                    <line x1="590" y1={startY} x2={endX} y2={endY} stroke="#67E8F9" strokeWidth="3" markerEnd="url(#photo-arrow)" opacity="0.86" />
                                    <circle cx={endX} cy={endY} r="10" fill="#67E8F9" stroke="#000" strokeWidth="3" />
                                    <text x={endX} y={endY + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="#000">e</text>
                                </g>
                            );
                        })
                    ) : (
                        <g>
                            <circle cx="662" cy="260" r="44" fill="#18181B" stroke="#3F3F46" strokeWidth="4" />
                            <text x="662" y="254" textAnchor="middle" fill="#A1A1AA" fontSize="14" fontWeight="900">Elektron</text>
                            <text x="662" y="276" textAnchor="middle" fill="#A1A1AA" fontSize="14" fontWeight="900">kopmaz</text>
                        </g>
                    )}

                    <g transform="translate(92 404)">
                        <rect width="624" height="58" rx="10" fill="#09090B" stroke="#000" strokeWidth="4" />
                        <text x="22" y="36" fill="#FAFAFA" fontSize="17" fontWeight="900">E = {formatNumber(photo.photonEnergy, 2)} eV</text>
                        <text x="212" y="36" fill="#FAFAFA" fontSize="17" fontWeight="900">Kmax = {formatNumber(photo.maxKineticEnergy, 2)} eV</text>
                        <text x="432" y="36" fill="#FAFAFA" fontSize="17" fontWeight="900">Vdur = {formatNumber(photo.stoppingPotential, 2)} V</text>
                    </g>

                    <line x1="110" y1="112" x2="342" y2="112" stroke={beamColor} strokeWidth="8" strokeLinecap="round" />
                    <line x1="110" y1="112" x2={110 + Math.min(232, wavelength / 3)} y2="112" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                    <text x="110" y="96" fill="#E5E7EB" fontSize="16" fontWeight="900">λ = {wavelength} nm</text>
                    <text x="420" y="112" fill={photo.emission ? "#86EFAC" : "#FCA5A5"} fontSize="20" fontWeight="900">
                        {photo.emission ? "Eşik aşıldı" : "Eşik altında"}
                    </text>
                </svg>
            </div>
        </SimulationLayout>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
            <p className="mt-1 break-words font-mono text-lg font-black text-white">{value}</p>
        </div>
    );
}
