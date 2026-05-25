"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SimulationLayout } from "./core/simulation-layout";
import { PhysicsSlider } from "./core/ui";

type SimulationMeta = {
    color?: string | null;
    title?: string | null;
};

type CircuitMode = "series" | "parallel";

function formatNumber(value: number, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}

export function OhmCircuitSim({ simData }: { simData?: SimulationMeta }) {
    const accentColor = simData?.color || "#F59E0B";
    const [voltage, setVoltage] = useState(9);
    const [r1, setR1] = useState(12);
    const [r2, setR2] = useState(18);
    const [mode, setMode] = useState<CircuitMode>("series");

    const circuit = useMemo(() => {
        const equivalentResistance = mode === "series"
            ? r1 + r2
            : (r1 * r2) / (r1 + r2);
        const totalCurrent = voltage / equivalentResistance;
        const totalPower = voltage * totalCurrent;
        const branchCurrent1 = mode === "series" ? totalCurrent : voltage / r1;
        const branchCurrent2 = mode === "series" ? totalCurrent : voltage / r2;
        const voltageDrop1 = mode === "series" ? totalCurrent * r1 : voltage;
        const voltageDrop2 = mode === "series" ? totalCurrent * r2 : voltage;

        return {
            equivalentResistance,
            totalCurrent,
            totalPower,
            branchCurrent1,
            branchCurrent2,
            voltageDrop1,
            voltageDrop2,
        };
    }, [mode, r1, r2, voltage]);

    const missionItems = [
        {
            title: "Seri toplamı",
            desc: "Seri devrede eşdeğer direncin R1 + R2 olduğunu doğrula.",
            completed: mode === "series" && Math.abs(circuit.equivalentResistance - (r1 + r2)) < 0.001,
            successText: "Seri devrede akımın yolu tek olduğu için dirençler doğrudan toplanır.",
        },
        {
            title: "Paralel kısayol",
            desc: "Paralel moda geç ve eşdeğer direncin en küçük dirençten bile küçük olduğunu yakala.",
            completed: mode === "parallel" && circuit.equivalentResistance < Math.min(r1, r2),
            successText: "Paralel kollar akıma ek yollar açar; bu yüzden eşdeğer direnç azalır.",
        },
        {
            title: "Güç artışı",
            desc: "Gerilimi artırıp toplam gücün 10 W üstüne çıktığı bir devre kur.",
            completed: circuit.totalPower > 10,
            successText: "Aynı eşdeğer dirençte gerilim artınca akım ve güç birlikte büyür.",
        },
    ];

    const electronDots = Array.from({ length: 8 }, (_, index) => index);
    const currentOpacity = Math.min(1, Math.max(0.25, circuit.totalCurrent / 2.5));

    const Controls = (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-2 rounded-lg border-[2px] border-black bg-zinc-900 p-2 shadow-[2px_2px_0px_0px_#000]">
                {(["series", "parallel"] as CircuitMode[]).map((item) => (
                    <button
                        key={item}
                        type="button"
                        aria-pressed={mode === item}
                        onClick={() => setMode(item)}
                        className={`rounded-md border-[2px] border-black px-3 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                            mode === item
                                ? "text-black shadow-[2px_2px_0px_0px_#000]"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                        style={mode === item ? { backgroundColor: accentColor } : undefined}
                    >
                        {item === "series" ? "Seri" : "Paralel"}
                    </button>
                ))}
            </div>

            <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000]">
                <PhysicsSlider label="Gerilim (V)" value={voltage} min={1} max={24} step={1} unit="V" onChange={setVoltage} color={accentColor} />
            </div>

            <div className="rounded-lg border-[2px] border-black bg-zinc-900 p-3 shadow-[2px_2px_0px_0px_#000] space-y-4">
                <PhysicsSlider label="Direnç R1" value={r1} min={1} max={100} step={1} unit="Ω" onChange={setR1} color="#38BDF8" />
                <PhysicsSlider label="Direnç R2" value={r2} min={1} max={100} step={1} unit="Ω" onChange={setR2} color="#F97316" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Metric label="Eşdeğer R" value={`${formatNumber(circuit.equivalentResistance, 1)} Ω`} />
                <Metric label="Akım" value={`${formatNumber(circuit.totalCurrent, 2)} A`} />
                <Metric label="Güç" value={`${formatNumber(circuit.totalPower, 2)} W`} />
                <Metric label="Mod" value={mode === "series" ? "Seri" : "Paralel"} />
            </div>
        </div>
    );

    const Theory = (
        <div className="space-y-5">
            <h2 className="text-xl font-black uppercase text-foreground">Ohm Yasası ve Devreler</h2>
            <p className="text-sm leading-relaxed text-zinc-400">
                Ohm yasası, gerilim, akım ve direnç arasındaki temel bağıntıyı verir. Gerilim akımı sürer, direnç ise akıma karşı koyar.
            </p>
            <div className="rounded-lg border-[2px] border-black p-4 text-center shadow-[3px_3px_0px_0px_#000]" style={{ backgroundColor: accentColor }}>
                <span className="mb-2 block text-xs font-black uppercase text-black">Temel bağıntı</span>
                <p className="font-mono text-2xl font-black text-black">V = I · R</p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-300">
                <li>• Seri devrede akım her dirençten aynı geçer.</li>
                <li>• Paralel devrede her kol aynı gerilimi paylaşır.</li>
                <li>• Elektriksel güç P = V · I bağıntısıyla hesaplanır.</li>
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
            title={simData?.title || "Ohm Devresi"}
            color={accentColor}
            controlsArea={Controls}
            theoryArea={Theory}
            missionsArea={Missions}
            simId="circuit"
            parameters={{
                voltage,
                r1,
                r2,
                mode,
                equivalentResistance: circuit.equivalentResistance,
                totalCurrent: circuit.totalCurrent,
                totalPower: circuit.totalPower,
            }}
        >
            <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,#262626_0,#111_70%)] p-2">
                <svg width="100%" height="100%" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Seri ve paralel direnç devresi">
                    <defs>
                        <marker id="ohm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#E5E7EB" />
                        </marker>
                    </defs>
                    <rect x="54" y="74" width="692" height="372" rx="18" fill="#18181B" stroke="#000" strokeWidth="5" />
                    <line x1="120" y1="260" x2="680" y2="260" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                    <line x1="120" y1="180" x2="120" y2="340" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                    <line x1="680" y1="180" x2="680" y2="340" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />

                    <g transform="translate(106 216)">
                        <line x1="0" y1="0" x2="0" y2="88" stroke="#E5E7EB" strokeWidth="6" />
                        <line x1="28" y1="20" x2="28" y2="68" stroke="#E5E7EB" strokeWidth="12" />
                        <text x="-42" y="50" fill="#FDE68A" fontSize="18" fontWeight="900">{voltage} V</text>
                    </g>

                    {mode === "series" ? (
                        <>
                            <Resistor x={262} y={260} label="R1" value={`${r1} Ω`} color="#38BDF8" />
                            <Resistor x={482} y={260} label="R2" value={`${r2} Ω`} color="#F97316" />
                            <text x="280" y="330" fill="#A1A1AA" fontSize="17" fontWeight="800">V1 = {formatNumber(circuit.voltageDrop1, 1)} V</text>
                            <text x="500" y="330" fill="#A1A1AA" fontSize="17" fontWeight="800">V2 = {formatNumber(circuit.voltageDrop2, 1)} V</text>
                        </>
                    ) : (
                        <>
                            <line x1="210" y1="180" x2="590" y2="180" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                            <line x1="210" y1="340" x2="590" y2="340" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                            <line x1="210" y1="180" x2="210" y2="340" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                            <line x1="590" y1="180" x2="590" y2="340" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                            <Resistor x={400} y={180} label="R1" value={`${r1} Ω`} color="#38BDF8" />
                            <Resistor x={400} y={340} label="R2" value={`${r2} Ω`} color="#F97316" />
                            <text x="300" y="145" fill="#A1A1AA" fontSize="17" fontWeight="800">I1 = {formatNumber(circuit.branchCurrent1, 2)} A</text>
                            <text x="300" y="384" fill="#A1A1AA" fontSize="17" fontWeight="800">I2 = {formatNumber(circuit.branchCurrent2, 2)} A</text>
                        </>
                    )}

                    <line x1="180" y1="112" x2="630" y2="112" stroke="#E5E7EB" strokeWidth="4" markerEnd="url(#ohm-arrow)" opacity="0.85" />
                    <text x="300" y="92" fill="#FDE68A" fontSize="18" fontWeight="900">I = {formatNumber(circuit.totalCurrent, 2)} A</text>

                    {electronDots.map((dot) => (
                        <circle
                            key={dot}
                            cx={185 + dot * 64}
                            cy={mode === "parallel" && dot % 2 === 0 ? 180 : 260}
                            r={5 + currentOpacity * 4}
                            fill={accentColor}
                            opacity={0.35 + currentOpacity * 0.55}
                        />
                    ))}

                    <g transform="translate(82 420)">
                        <rect width="636" height="54" rx="9" fill="#09090B" stroke="#000" strokeWidth="4" />
                        <text x="22" y="35" fill="#FAFAFA" fontSize="18" fontWeight="900">
                            R eş = {formatNumber(circuit.equivalentResistance, 2)} Ω
                        </text>
                        <text x="244" y="35" fill="#FAFAFA" fontSize="18" fontWeight="900">
                            I toplam = {formatNumber(circuit.totalCurrent, 2)} A
                        </text>
                        <text x="486" y="35" fill="#FAFAFA" fontSize="18" fontWeight="900">
                            P = {formatNumber(circuit.totalPower, 2)} W
                        </text>
                    </g>
                </svg>
            </div>
        </SimulationLayout>
    );
}

function Resistor({ x, y, label, value, color }: { x: number; y: number; label: string; value: string; color: string }) {
    const points = "-78,0 -56,-24 -34,24 -12,-24 10,24 32,-24 54,24 78,0";

    return (
        <g transform={`translate(${x} ${y})`}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
            <rect x="-66" y="-58" width="132" height="34" rx="7" fill="#09090B" stroke="#000" strokeWidth="3" />
            <text x="0" y="-35" fill="#FAFAFA" fontSize="18" fontWeight="900" textAnchor="middle">{label} = {value}</text>
        </g>
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
