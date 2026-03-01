"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface CustomBadgeIconProps {
    name: string;
    className?: string;
}

// Ortak Neo-Brutalist Yuvarlak Rozet Tabanı
const NeoSticker = ({ color, rotate = 0, children }: { color: string, rotate?: number, children: React.ReactNode }) => {
    return (
        <div
            className="w-full h-full rounded-full border-[3px] border-black flex items-center justify-center shadow-inner relative overflow-hidden"
            style={{ backgroundColor: color, transform: `rotate(${rotate}deg)` }}
        >
            <div className="absolute inset-0 border-[3px] border-white/20 rounded-full pointer-events-none z-0" />
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[15%] rounded-full bg-white/30 -rotate-12 pointer-events-none z-10 blur-[1px]"></div>

            <div className="w-full h-full relative z-20 flex items-center justify-center">
                {/* SVG bileşenleri genelde 0 0 100 100 viewBox ile 100% genişlikte render edilecek */}
                {children}
            </div>

            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black/20 rounded-full blur-md z-0 pointer-events-none"></div>
        </div>
    );
};

export function CustomBadgeIcon({ name }: CustomBadgeIconProps) {
    if (!name) return <NeoSticker color="#71717a"><Shield className="text-white w-1/2 h-1/2" /></NeoSticker>;

    // Güvenli büyük/küçük harf kontrolü
    const normalName = name.toLocaleLowerCase('tr-TR');

    // 1. Ay'a İlk Adım (Moon Landing)
    if (normalName.includes("ay'a ilk adım") || normalName.includes("aya ilk")) {
        return (
            <NeoSticker color="#1e293b" rotate={-5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Arka plan yıldızlar */}
                    <motion.circle cx="20" cy="20" r="1.5" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="80" cy="30" r="2" fill="#fff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="70" cy="70" r="1" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />

                    {/* Uzaktaki Dünya */}
                    <circle cx="85" cy="15" r="8" fill="#3b82f6" stroke="#000" strokeWidth="2" />
                    <path d="M80 12 Q85 10 88 15 Q82 17 80 12" fill="#22c55e" />

                    {/* Ay Yüzeyi Eğrisi */}
                    <path d="M0 80 Q50 60 100 80 L100 100 L0 100 Z" fill="#94a3b8" stroke="#000" strokeWidth="3" />

                    {/* Astronot Botu İzi */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        {/* Ayakkabı tabanı ana hat */}
                        <path d="M35 85 C30 85 25 75 25 50 C25 25 35 15 50 15 C65 15 75 25 75 50 C75 75 70 85 65 85 Z" fill="#475569" stroke="#000" strokeWidth="4" />
                        {/* Taban çizgileri (Treads) */}
                        <path d="M30 30 L70 30 M28 45 L72 45 M28 60 L72 60 M35 75 L65 75" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 2. Galileo'nun Teleskobu
    if (normalName.includes("galileo") || normalName.includes("teleskob")) {
        return (
            <NeoSticker color="#0ea5e9" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: 0.5, originY: 0.5 }}>
                        {/* Teleskop ayağı */}
                        <path d="M48 60 L30 95 M52 60 L70 95 M50 60 L50 95" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />
                        {/* Gövde */}
                        <path d="M20 70 L80 30" stroke="#b45309" strokeWidth="16" strokeLinecap="round" />
                        <path d="M20 70 L80 30" stroke="#fcd34d" strokeWidth="10" strokeLinecap="round" />
                        {/* Mercekler */}
                        <circle cx="80" cy="30" r="10" fill="#38bdf8" stroke="#000" strokeWidth="4" />
                        <path d="M78 28 L82 32" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                        <rect x="15" y="65" width="10" height="20" fill="#000" transform="rotate(-33 20 70)" rx="2" />
                    </motion.g>
                    {/* Yıldız Işıltısı */}
                    <motion.path
                        d="M75 10 L80 15 L85 10 L80 5 Z" fill="#fff" stroke="#000" strokeWidth="1"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                    />
                </svg>
            </NeoSticker>
        );
    }

    // 3. Newton'un Elması
    if (normalName.includes("newton")) {
        return (
            <NeoSticker color="#10b981" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Ağaç dalı */}
                    <path d="M-10 20 Q30 5 80 15" fill="none" stroke="#451a03" strokeWidth="8" strokeLinecap="round" />
                    <path d="M30 15 Q40 30 50 15" fill="#22c55e" stroke="#000" strokeWidth="3" />
                    <path d="M60 15 Q70 30 80 10" fill="#15803d" stroke="#000" strokeWidth="3" />

                    {/* Düşen Elma */}
                    <motion.g
                        animate={{ y: [0, 50, 30, 50, 45, 50] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeOut" }}
                    >
                        {/* Elma Gövdesi */}
                        <path d="M50 35 C20 35 25 70 50 70 C75 70 80 35 50 35 Z" fill="#ef4444" stroke="#000" strokeWidth="4" />
                        {/* Elma Sapı */}
                        <path d="M50 35 Q55 25 60 25" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        {/* Küçük yaprak */}
                        <path d="M50 35 Q40 30 45 25 Q55 25 50 35" fill="#22c55e" stroke="#000" strokeWidth="2" />
                        {/* Parlama efeği */}
                        <path d="M40 45 Q35 55 42 60" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
                    </motion.g>
                    {/* Yer çizgisi */}
                    <line x1="20" y1="88" x2="80" y2="88" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" />
                </svg>
            </NeoSticker>
        );
    }

    // 4. Einstein'ın Zihni
    if (normalName.includes("einstein")) {
        return (
            <NeoSticker color="#f59e0b" rotate={5}>
                <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] overflow-visible">
                    {/* Einstein Saçları ve Yüz Silüeti (Basitleştirilmiş) */}
                    <g stroke="#000" strokeWidth="4" strokeLinejoin="round" fill="#fff">
                        {/* Saçlar */}
                        <path d="M20 50 Q10 30 30 20 Q25 5 45 15 Q50 0 60 15 Q75 5 75 25 Q95 30 80 50 Q90 65 75 70 Q60 85 50 85 Q40 85 25 70 Q10 65 20 50 Z" />
                        {/* Gözlük */}
                        <circle cx="35" cy="45" r="8" fill="none" />
                        <circle cx="65" cy="45" r="8" fill="none" />
                        <line x1="43" y1="45" x2="57" y2="45" />
                        {/* Bıyık */}
                        <path d="M40 60 Q50 55 60 60 Q55 70 45 70 Q40 65 40 60 Z" fill="#d4d4d8" />
                    </g>
                    {/* Zihinden Çıkan Neon Formül */}
                    <motion.g
                        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <text x="50" y="25" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#ef4444" textAnchor="middle" stroke="#000" strokeWidth="1">
                            E=mc²
                        </text>
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 5. Hawking'in Evreni
    if (normalName.includes("hawking")) {
        return (
            <NeoSticker color="#6366f1" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] overflow-visible">
                    {/* Kara Delik (Event Horizon & Accretion Disk) */}
                    <motion.g animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: 0.5, originY: 0.5 }}>
                        {/* Dış Hale */}
                        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#c7d2fe" strokeWidth="2" strokeDasharray="5 5" transform="rotate(20 50 50)" />
                        <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="#818cf8" strokeWidth="4" transform="rotate(-20 50 50)" />
                    </motion.g>
                    <circle cx="50" cy="50" r="18" fill="#000" stroke="#a5b4fc" strokeWidth="3" />

                    {/* Tekerlekli Sandalye Sembolü (Minimal) */}
                    <g transform="translate(60, 60) scale(0.6)">
                        <circle cx="25" cy="25" r="10" fill="none" stroke="#fff" strokeWidth="5" />
                        <path d="M25 25 L40 5 L20 5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="40" cy="5" r="4" fill="#fff" />
                    </g>

                    {/* Hawking Işıması */}
                    <motion.circle cx="32" cy="32" r="2" fill="#fff" animate={{ y: [-5, -15], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle cx="68" cy="68" r="2" fill="#fff" animate={{ y: [5, 15], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }} />
                </svg>
            </NeoSticker>
        );
    }

    // 6. Da Vinci'nin Vitruvius'u
    if (normalName.includes("vinci") || normalName.includes("vitruvius")) {
        return (
            <NeoSticker color="#fde047" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Eskiz arka plan şekilleri */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#a16207" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="15" y="15" width="70" height="70" fill="none" stroke="#a16207" strokeWidth="2" />

                    {/* Adamın gövdesi */}
                    <g stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {/* Kafa */}
                        <circle cx="50" cy="25" r="7" fill="#fff" />
                        {/* Gövde */}
                        <line x1="50" y1="32" x2="50" y2="60" />
                        {/* Bacaklar Sabit */}
                        <line x1="50" y1="60" x2="40" y2="85" />
                        <line x1="50" y1="60" x2="60" y2="85" />

                        {/* Kollar - Animasyonlu Hareket */}
                        <motion.g animate={{ rotateZ: [-15, 15, -15] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "35px" }}>
                            <line x1="20" y1="45" x2="80" y2="45" />
                        </motion.g>
                        <motion.g animate={{ rotateZ: [15, -15, 15] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "35px" }}>
                            <line x1="25" y1="35" x2="75" y2="35" />
                        </motion.g>
                    </g>
                </svg>
            </NeoSticker>
        );
    }

    // 7. Mona Lisa'nın Gülümsemesi
    if (normalName.includes("mona") || normalName.includes("lisa")) {
        return (
            <NeoSticker color="#d946ef" rotate={-3}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Çerçeve */}
                    <rect x="10" y="5" width="80" height="90" fill="#facc15" stroke="#000" strokeWidth="6" rx="4" />
                    <rect x="20" y="15" width="60" height="70" fill="#4ade80" stroke="#000" strokeWidth="4" />

                    {/* Portre Hatları */}
                    <path d="M40 85 L35 65 C35 50 40 40 50 40 C60 40 65 50 65 65 L60 85 Z" fill="#fcd34d" stroke="#000" strokeWidth="3" />
                    {/* Saçlar */}
                    <path d="M50 25 C30 25 30 50 25 70 L35 70 C35 50 40 35 50 35 C60 35 65 50 65 70 L75 70 C70 50 70 25 50 25 Z" fill="#000" />
                    {/* Yüz Hatları - Animasyonlu Gözler */}
                    <path d="M42 50 Q45 48 48 50" fill="none" stroke="#000" strokeWidth="2" />
                    <path d="M52 50 Q55 48 58 50" fill="none" stroke="#000" strokeWidth="2" />

                    <motion.circle cx="45" cy="52" r="1.5" fill="#000" animate={{ x: [-1, 1, -1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="55" cy="52" r="1.5" fill="#000" animate={{ x: [-1, 1, -1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

                    {/* O İkonik Gülümseme */}
                    <path d="M45 62 Q50 65 55 62" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="44" cy="61" r="1" fill="#000" />
                    <circle cx="56" cy="61" r="1" fill="#000" />
                </svg>
            </NeoSticker>
        );
    }

    // 8. Kopernik Devrimi
    if (normalName.includes("kopernik") || normalName.includes("devrim")) {
        return (
            <NeoSticker color="#f97316" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] overflow-visible">
                    {/* Ortada Güneş */}
                    <motion.circle cx="50" cy="50" r="12" fill="#fbbf24" stroke="#000" strokeWidth="3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />

                    {/* Yörüngeler ve Gezegenler */}
                    <g fill="none" stroke="#000" strokeWidth="2" strokeDasharray="4 4" opacity="0.6">
                        <circle cx="50" cy="50" r="25" />
                        <circle cx="50" cy="50" r="40" />
                    </g>

                    {/* Dünya ve Ay */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }}>
                        <g transform="translate(0, -25)">
                            <circle cx="50" cy="50" r="6" fill="#3b82f6" stroke="#000" strokeWidth="2" />
                            {/* Dünya'nın uydusu Ay */}
                            <motion.circle cx="50" cy="35" r="2" fill="#e2e8f0" stroke="#000" strokeWidth="1" animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }} />
                        </g>
                    </motion.g>

                    {/* Dış yörünge - Mars */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }}>
                        <circle cx="50" cy="10" r="4" fill="#ef4444" stroke="#000" strokeWidth="2" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 9. Leibniz'in Dehası (Kalkülüs/İntegral)
    if (normalName.includes("leibniz")) {
        return (
            <NeoSticker color="#84cc16" rotate={-5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Arka plan denklemler */}
                    <text x="10" y="30" fontSize="10" opacity="0.5" fontFamily="monospace">dy/dx</text>
                    <text x="70" y="80" fontSize="10" opacity="0.5" fontFamily="monospace">lim(x→0)</text>
                    <text x="80" y="40" fontSize="12" opacity="0.5" fontFamily="monospace">Σ</text>

                    {/* Dev İntegral İşareti */}
                    <motion.path
                        d="M60 15 Q75 15 70 30 Q60 50 50 50 Q40 50 30 70 Q25 85 40 85"
                        fill="none" stroke="#000" strokeWidth="10" strokeLinecap="round"
                        animate={{ strokeWidth: [10, 12, 10], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* İç Beyaz Dolgu Parıltısı */}
                    <path d="M60 15 Q75 15 70 30 Q60 50 50 50 Q40 50 30 70 Q25 85 40 85" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />

                    <text x="65" y="45" fontSize="14" fontWeight="bold" fill="#000">f(x)</text>
                    <text x="75" y="55" fontSize="12" fontWeight="bold" fill="#000">dx</text>
                </svg>
            </NeoSticker>
        );
    }

    // 10. Tesla'nın Bobini
    if (normalName.includes("tesla") || normalName.includes("kıvılcım") || normalName.includes("bobin")) {
        return (
            <NeoSticker color="#a855f7" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Bobin Kulesi */}
                    <path d="M35 90 L65 90 L60 40 L40 40 Z" fill="#64748b" stroke="#000" strokeWidth="4" />
                    <line x1="40" y1="50" x2="60" y2="50" stroke="#000" strokeWidth="4" />
                    <line x1="38" y1="65" x2="62" y2="65" stroke="#000" strokeWidth="4" />
                    <line x1="36" y1="80" x2="64" y2="80" stroke="#000" strokeWidth="4" />

                    {/* Tepe Küresi */}
                    <circle cx="50" cy="30" r="15" fill="#cbd5e1" stroke="#000" strokeWidth="4" />
                    <circle cx="45" cy="25" r="4" fill="#fff" />

                    {/* Şimşekler (Framer Motion ile yanıp sönen şimşek) */}
                    <motion.g animate={{ opacity: [0, 1, 0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                        {/* Sol şimşek */}
                        <path d="M35 30 L10 10 L25 10 L5 0" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Sağ şimşek */}
                        <path d="M65 30 L90 40 L75 50 L95 60" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Üst şimşek */}
                        <path d="M50 15 L45 0 L55 -5 L50 -15" fill="none" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 11. Marie Curie (Radyoaktivite)
    if (normalName.includes("curie") || normalName.includes("radyoaktivite")) {
        return (
            <NeoSticker color="#064e3b" rotate={5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Tüp Arkasındaki Parlama */}
                    <motion.circle cx="50" cy="65" r="25" fill="#4ade80" opacity="0.3" animate={{ r: [20, 30, 20], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />

                    {/* Erlenmayer Tüpü */}
                    <path d="M40 20 H60 V40 L80 80 H20 L40 40 Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />

                    {/* İçindeki Sıvı (Radyum) */}
                    <path d="M25 70 L75 70 L80 80 H20 Z" fill="#22c55e" stroke="#000" strokeWidth="3" />
                    <path d="M30 60 L70 60 L75 70 H25 Z" fill="#4ade80" stroke="#000" strokeWidth="3" />

                    {/* Yükselen Kabarcıklar */}
                    <motion.circle cx="45" cy="75" r="3" fill="#ecfccb" animate={{ y: [-10, -40], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="55" cy="72" r="2" fill="#ecfccb" animate={{ y: [-5, -35], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="50" cy="68" r="4" fill="#ecfccb" animate={{ y: [0, -45], opacity: [1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} />

                    {/* Radyasyon Sembolü (Ufak detay) */}
                    <circle cx="50" cy="65" r="5" fill="#064e3b" stroke="#000" strokeWidth="2" />
                </svg>
            </NeoSticker>
        );
    }

    // 12. Schrödinger'in Kedisi
    if (normalName.includes("schrödinger") || normalName.includes("kedi")) {
        return (
            <NeoSticker color="#fca5a5" rotate={-2}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Kutu */}
                    <path d="M20 50 L50 35 L80 50 L80 80 L50 95 L20 80 Z" fill="#d97706" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M20 50 L50 65 L80 50" fill="none" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M50 65 L50 95" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />

                    {/* Açılan Kapak */}
                    <motion.g animate={{ rotateZ: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "35px" }}>
                        <path d="M50 35 L20 20 L50 5 L80 20 Z" fill="#f59e0b" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    </motion.g>

                    {/* Kedinin Gözleri Karanlıkta Yanıp Söner */}
                    <motion.g animate={{ opacity: [0, 1, 0, 1, 0, 0] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }}>
                        {/* Sol Göz */}
                        <path d="M40 55 Q45 52 50 55" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="45" cy="57" r="1.5" fill="#000" />
                        {/* Sağ Göz */}
                        <path d="M60 55 Q65 52 70 55" fill="none" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="65" cy="57" r="1.5" fill="#000" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 13. Bohr Atomu
    if (normalName.includes("bohr") || normalName.includes("atom")) {
        return (
            <NeoSticker color="#3b82f6" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Çekirdek */}
                    <circle cx="50" cy="50" r="10" fill="#ef4444" stroke="#000" strokeWidth="3" />
                    <circle cx="47" cy="47" r="3" fill="#fca5a5" />

                    {/* Yörüngeler - CSS keyframes style motion */}
                    <g fill="none" stroke="#fff" strokeWidth="3" opacity="0.8">
                        {/* 1. Yörünge */}
                        <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(0 50 50)" />
                        <motion.circle cx="15" cy="50" r="4" fill="#fef08a" stroke="#000" strokeWidth="2" animate={{ rotate: 360, originX: 35, originY: 0 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
                        {/* 2. Yörünge */}
                        <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(60 50 50)" />
                        <motion.circle cx="15" cy="50" r="4" fill="#34d399" stroke="#000" strokeWidth="2" animate={{ rotate: 360, originX: 35, originY: 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} transform="rotate(60 50 50)" />
                        {/* 3. Yörünge */}
                        <ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(120 50 50)" />
                        <motion.circle cx="15" cy="50" r="4" fill="#a78bfa" stroke="#000" strokeWidth="2" animate={{ rotate: 360, originX: 35, originY: 0 }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} transform="rotate(120 50 50)" />
                    </g>
                </svg>
            </NeoSticker>
        );
    }

    // 14. Soluk Mavi Nokta (Carl Sagan)
    if (normalName.includes("soluk") || normalName.includes("mavi")) {
        return (
            <NeoSticker color="#020617" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Güneş Işınları */}
                    <path d="M0 20 L100 50 L100 80 L0 50 Z" fill="#fde047" opacity="0.1" />
                    <path d="M0 40 L100 70 L100 90 L0 60 Z" fill="#fca5a5" opacity="0.05" />
                    <path d="M0 10 L100 40 L100 60 L0 30 Z" fill="#60a5fa" opacity="0.05" />

                    {/* Soluk Mavi Nokta */}
                    <motion.circle
                        cx="65" cy="55" r="2.5"
                        fill="#38bdf8" stroke="#1e3a8a" strokeWidth="1"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Parıltı çapraz çizgisi */}
                    <motion.line x1="62" y1="52" x2="68" y2="58" stroke="#fff" strokeWidth="0.5" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                    <motion.line x1="62" y1="58" x2="68" y2="52" stroke="#fff" strokeWidth="0.5" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} />
                </svg>
            </NeoSticker>
        );
    }

    // 15. Kırmızı Gezegen (Mars & Rover)
    if (normalName.includes("kırmızı") || normalName.includes("mars")) {
        return (
            <NeoSticker color="#b91c1c" rotate={5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Mars Yüzeyi */}
                    <path d="M0 70 Q25 60 50 70 T100 65 L100 100 L0 100 Z" fill="#7f1d1d" stroke="#000" strokeWidth="4" />
                    {/* Kraterler */}
                    <ellipse cx="20" cy="85" rx="10" ry="3" fill="#450a0a" stroke="#000" strokeWidth="2" />
                    <ellipse cx="80" cy="75" rx="15" ry="4" fill="#450a0a" stroke="#000" strokeWidth="2" />

                    {/* Rover Araç */}
                    <motion.g animate={{ x: [-10, 10, -10], y: [0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                        {/* Gövde */}
                        <path d="M35 55 L65 55 L60 45 L40 45 Z" fill="#cbd5e1" stroke="#000" strokeWidth="3" />
                        {/* Kamera Boynu */}
                        <path d="M45 45 L45 30 L55 30" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="55" cy="30" r="4" fill="#000" stroke="#fff" strokeWidth="2" />

                        {/* İletişim Anteni (Yanıp Sönen) */}
                        <line x1="60" y1="45" x2="65" y2="35" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                        <motion.circle cx="65" cy="35" r="2" fill="#ef4444" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />

                        {/* Tekerlekler */}
                        <circle cx="40" cy="62" r="6" fill="#1e293b" stroke="#000" strokeWidth="2" />
                        <circle cx="50" cy="62" r="6" fill="#1e293b" stroke="#000" strokeWidth="2" />
                        <circle cx="60" cy="62" r="6" fill="#1e293b" stroke="#000" strokeWidth="2" />
                        <motion.circle cx="40" cy="62" r="2" fill="#fff" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <motion.circle cx="50" cy="62" r="2" fill="#fff" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <motion.circle cx="60" cy="62" r="2" fill="#fff" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 16. Turing Makinesi
    if (normalName.includes("turing")) {
        return (
            <NeoSticker color="#14b8a6" rotate={-5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Makine Gövdesi */}
                    <rect x="20" y="30" width="60" height="50" fill="#334155" stroke="#000" strokeWidth="4" rx="5" />
                    <rect x="25" y="35" width="50" height="20" fill="#0f172a" stroke="#000" strokeWidth="3" />

                    {/* Rotorlar (Animasyonlu Dönen) */}
                    <g transform="translate(35, 45) scale(0.6)">
                        <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "0px", originY: "0px" }}>
                            <path d="M0 -15 L10 -5 L10 5 L0 15 L-10 5 L-10 -5 Z" fill="#64748b" stroke="#000" strokeWidth="2" />
                            <circle cx="0" cy="0" r="3" fill="#000" />
                        </motion.g>
                    </g>
                    <g transform="translate(50, 45) scale(0.6)">
                        <motion.g animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "0px", originY: "0px" }}>
                            <path d="M0 -15 L10 -5 L10 5 L0 15 L-10 5 L-10 -5 Z" fill="#64748b" stroke="#000" strokeWidth="2" />
                            <circle cx="0" cy="0" r="3" fill="#000" />
                        </motion.g>
                    </g>
                    <g transform="translate(65, 45) scale(0.6)">
                        <motion.g animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ originX: "0px", originY: "0px" }}>
                            <path d="M0 -15 L10 -5 L10 5 L0 15 L-10 5 L-10 -5 Z" fill="#64748b" stroke="#000" strokeWidth="2" />
                            <circle cx="0" cy="0" r="3" fill="#000" />
                        </motion.g>
                    </g>

                    {/* Veri Şeridi (Akan bant) */}
                    <motion.path
                        d="M30 65 Q50 90 70 65 L60 65 Q50 80 40 65 Z"
                        fill="#fff" stroke="#000" strokeWidth="2"
                        animate={{ strokeDasharray: ["5,5", "10,10"], strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Delikler */}
                    <circle cx="40" cy="72" r="2" fill="#000" />
                    <circle cx="50" cy="75" r="2" fill="#000" />
                    <circle cx="60" cy="72" r="2" fill="#000" />
                </svg>
            </NeoSticker >
        );
    }

    // 17. Newton Beşiği
    if (normalName.includes("beşiği") || normalName.includes("besigi")) {
        return (
            <NeoSticker color="#cbd5e1" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Üst İskelet */}
                    <path d="M20 20 L80 20" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                    <path d="M20 20 L20 80" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                    <path d="M80 20 L80 80" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

                    {/* Sabit Toplar */}
                    <line x1="40" y1="20" x2="40" y2="60" stroke="#000" strokeWidth="2" />
                    <circle cx="40" cy="65" r="5" fill="#94a3b8" stroke="#000" strokeWidth="2" />

                    <line x1="50" y1="20" x2="50" y2="60" stroke="#000" strokeWidth="2" />
                    <circle cx="50" cy="65" r="5" fill="#94a3b8" stroke="#000" strokeWidth="2" />

                    <line x1="60" y1="20" x2="60" y2="60" stroke="#000" strokeWidth="2" />
                    <circle cx="60" cy="65" r="5" fill="#94a3b8" stroke="#000" strokeWidth="2" />

                    {/* Animasyonlu Sol Top */}
                    <motion.g animate={{ rotateZ: [30, 0, 0, 0, 30] }} transition={{ duration: 1.5, repeat: Infinity, ease: "circOut" }} style={{ originX: "30px", originY: "20px" }}>
                        <line x1="30" y1="20" x2="30" y2="60" stroke="#000" strokeWidth="2" />
                        <circle cx="30" cy="65" r="5" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
                        <circle cx="28" cy="63" r="1.5" fill="#fff" />
                    </motion.g>

                    {/* Animasyonlu Sağ Top */}
                    <motion.g animate={{ rotateZ: [0, 0, -30, 0, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "circOut" }} style={{ originX: "70px", originY: "20px" }}>
                        <line x1="70" y1="20" x2="70" y2="60" stroke="#000" strokeWidth="2" />
                        <circle cx="70" cy="65" r="5" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
                        <circle cx="68" cy="63" r="1.5" fill="#fff" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // 18. Süpernova
    if (normalName.includes("süpernova") || normalName.includes("supernova")) {
        return (
            <NeoSticker color="#000000" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Genişleyen Şok Dalgaları */}
                    <motion.circle cx="50" cy="50" r="10" fill="none" stroke="#6366f1" strokeWidth="4" animate={{ r: [10, 45], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
                    <motion.circle cx="50" cy="50" r="10" fill="none" stroke="#a855f7" strokeWidth="4" animate={{ r: [10, 45], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />

                    {/* Yıldız Merkezi Püskürmeler */}
                    <motion.g animate={{ scale: [1, 1.2, 1], rotate: 180 }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "50px" }}>
                        <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="#ec4899" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
                        <path d="M50 30 L53 47 L70 50 L53 53 L50 70 L47 53 L30 50 L47 47 Z" fill="#fef08a" stroke="#000" strokeWidth="2" strokeLinejoin="round" transform="rotate(45 50 50)" />
                    </motion.g>

                    {/* Parlayan Çekirdek */}
                    <motion.circle cx="50" cy="50" r="8" fill="#fff" animate={{ r: [7, 10, 7] }} transition={{ duration: 0.5, repeat: Infinity }} />
                </svg>
            </NeoSticker>
        );
    }

    // 19. Çifte Yarık Deneyi
    if (normalName.includes("çifte") || normalName.includes("cifte")) {
        return (
            <NeoSticker color="#475569" rotate={10}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Elektron Kaynağı Tabancası (Sol) */}
                    <path d="M0 40 V60 H20 L25 50 L20 40 Z" fill="#1e293b" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    <line x1="25" y1="50" x2="35" y2="50" stroke="#fcd34d" strokeWidth="4" strokeDasharray="5 5" />

                    {/* Çift Yarıklı Plaka (Orta) */}
                    <rect x="45" y="10" width="10" height="80" fill="#334155" stroke="#000" strokeWidth="4" />
                    <rect x="45" y="30" width="10" height="15" fill="#475569" /> {/* Üst Yarık boşluğu izlenimi */}
                    <rect x="45" y="55" width="10" height="15" fill="#475569" /> {/* Alt Yarık boşluğu izlenimi */}
                    <line x1="40" y1="37" x2="60" y2="37" stroke="#000" strokeWidth="8" />
                    <line x1="40" y1="62" x2="60" y2="62" stroke="#000" strokeWidth="8" />

                    {/* Karşı Duvar Parazit/Girişim Deseni (Sağ) */}
                    <path d="M80 10 V90" stroke="#fff" strokeWidth="4" />
                    <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <rect x="75" y="45" width="10" height="10" fill="#22c55e" /> {/* Merkez Parlak */}
                        <rect x="75" y="25" width="10" height="8" fill="#22c55e" opacity="0.6" />
                        <rect x="75" y="67" width="10" height="8" fill="#22c55e" opacity="0.6" />
                        <rect x="75" y="10" width="10" height="5" fill="#22c55e" opacity="0.3" />
                        <rect x="75" y="85" width="10" height="5" fill="#22c55e" opacity="0.3" />
                    </motion.g>

                    {/* Dalgalar */}
                    <motion.path d="M30 20 Q50 50 30 80" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" animate={{ x: [0, 15] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} opacity="0.5" />
                    <motion.path d="M55 35 Q65 50 55 65" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="4 4" animate={{ x: [0, 20], opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </svg>
            </NeoSticker>
        );
    }

    // 20. FizikHub Efsanesi (Feynman)
    if (normalName.includes("efsane") || normalName.includes("feynman")) {
        return (
            <NeoSticker color="#f59e0b" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Arka plan Feynman diyagramı */}
                    <line x1="20" y1="20" x2="50" y2="50" stroke="#000" strokeWidth="3" />
                    <path d="M40 25 L45 35 L50 25" fill="none" stroke="#000" strokeWidth="2" />
                    <line x1="80" y1="20" x2="50" y2="50" stroke="#000" strokeWidth="3" />
                    <path d="M60 25 L55 35 L50 25" fill="none" stroke="#000" strokeWidth="2" />
                    <motion.path d="M50 50 Q60 65 50 80 Q40 65 50 50" fill="none" stroke="#000" strokeWidth="3" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    <circle cx="50" cy="50" r="4" fill="#ef4444" stroke="#000" strokeWidth="2" />

                    {/* Bongo Davulları */}
                    <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}>
                        {/* Sol Bongo */}
                        <ellipse cx="35" cy="70" rx="15" ry="8" fill="#fef08a" stroke="#000" strokeWidth="4" />
                        <path d="M20 70 V90 Q35 100 50 90 V70" fill="#b45309" stroke="#000" strokeWidth="4" />
                    </motion.g>

                    <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: 0.25 }}>
                        {/* Sağ Bongo (Küçük) */}
                        <ellipse cx="65" cy="75" rx="12" ry="6" fill="#fef08a" stroke="#000" strokeWidth="4" />
                        <path d="M53 75 V90 Q65 100 77 90 V75" fill="#92400e" stroke="#000" strokeWidth="4" />
                    </motion.g>

                    {/* Vuran Eller / Baget (Soyut) */}
                    <motion.path d="M20 50 Q30 40 35 65" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round" animate={{ d: ["M20 50 Q30 40 35 65", "M20 40 Q30 30 35 70", "M20 50 Q30 40 35 65"] }} transition={{ duration: 0.5, repeat: Infinity }} />
                    <motion.path d="M80 55 Q70 45 65 70" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" animate={{ d: ["M80 55 Q70 45 65 70", "M80 45 Q70 35 65 75", "M80 55 Q70 45 65 70"] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }} />
                </svg>
            </NeoSticker>
        );
    }

    // ═══════════════════════════════════════════
    // DB İtibar/Seviye Rozetleri (Eksik Olanlar)
    // ═══════════════════════════════════════════

    // Gözlemci (Büyük göz/iris)
    if (normalName.includes("gözlemci")) {
        return (
            <NeoSticker color="#1d4ed8" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Göz dış çizgisi */}
                    <path d="M10 50 Q50 15 90 50 Q50 85 10 50 Z" fill="#bfdbfe" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    {/* İris */}
                    <circle cx="50" cy="50" r="18" fill="#2563eb" stroke="#000" strokeWidth="3" />
                    {/* Pupil */}
                    <motion.circle cx="50" cy="50" r="8" fill="#000" animate={{ cx: [48, 52, 48], r: [7, 9, 7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                    {/* Parlama */}
                    <circle cx="43" cy="43" r="4" fill="#fff" />
                    <circle cx="55" cy="47" r="2" fill="#fff" />
                    {/* Kirpikler */}
                    <path d="M15 45 L5 35 M25 35 L20 22 M40 28 L38 15 M60 28 L62 15 M75 35 L80 22 M85 45 L95 35" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                </svg>
            </NeoSticker>
        );
    }

    // Çırak (Çekiç & Anahtar)
    if (normalName.includes("çırak")) {
        return (
            <NeoSticker color="#78350f" rotate={-5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Çekiç */}
                    <motion.g animate={{ rotateZ: [-15, 15, -15] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "30px", originY: "70px" }}>
                        <rect x="25" y="40" width="10" height="40" fill="#a16207" stroke="#000" strokeWidth="3" rx="2" />
                        <rect x="15" y="30" width="30" height="15" fill="#94a3b8" stroke="#000" strokeWidth="3" rx="2" />
                    </motion.g>
                    {/* Anahtar (İngiliz Anahtarı) */}
                    <g transform="translate(55, 20) rotate(30)">
                        <rect x="5" y="10" width="8" height="55" fill="#64748b" stroke="#000" strokeWidth="3" rx="2" />
                        <path d="M0 5 L18 5 L18 20 L12 15 L6 20 L0 15 Z" fill="#94a3b8" stroke="#000" strokeWidth="3" />
                    </g>
                </svg>
            </NeoSticker>
        );
    }

    // Teorisyen (Karatahta + denklemler)
    if (normalName.includes("teorisyen")) {
        return (
            <NeoSticker color="#166534" rotate={3}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Tahta */}
                    <rect x="10" y="10" width="80" height="60" fill="#14532d" stroke="#000" strokeWidth="5" rx="3" />
                    <rect x="5" y="65" width="90" height="8" fill="#a16207" stroke="#000" strokeWidth="3" rx="2" />
                    {/* Tebeşir yazıları */}
                    <motion.g animate={{ opacity: [0, 1] }} transition={{ duration: 2 }}>
                        <text x="22" y="35" fontSize="14" fill="#fef08a" fontFamily="monospace" fontWeight="bold">F=ma</text>
                        <text x="18" y="55" fontSize="12" fill="#bbf7d0" fontFamily="monospace">∇·E = ρ/ε₀</text>
                    </motion.g>
                    {/* Tebeşir */}
                    <rect x="70" y="70" width="20" height="6" fill="#fff" stroke="#000" strokeWidth="2" rx="3" transform="rotate(-10 80 73)" />
                    {/* Tahta silgisi */}
                    <rect x="15" y="70" width="15" height="10" fill="#d97706" stroke="#000" strokeWidth="2" rx="2" />
                </svg>
            </NeoSticker>
        );
    }

    // Profesör (Mezuniyet kepi & kürsü)
    if (normalName.includes("profesör")) {
        return (
            <NeoSticker color="#7c3aed" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Mezuniyet Kepi */}
                    <polygon points="50,15 10,35 50,55 90,35" fill="#1e293b" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    <line x1="50" y1="35" x2="50" y2="55" stroke="#000" strokeWidth="3" />
                    <path d="M30 42 Q50 60 70 42" fill="none" stroke="#000" strokeWidth="3" />
                    {/* Püskül */}
                    <motion.g animate={{ rotateZ: [-10, 10, -10] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "85px", originY: "35px" }}>
                        <line x1="85" y1="35" x2="90" y2="55" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="90" cy="58" r="4" fill="#fbbf24" stroke="#000" strokeWidth="2" />
                    </motion.g>
                    {/* Kürsü */}
                    <rect x="30" y="65" width="40" height="30" fill="#a16207" stroke="#000" strokeWidth="4" rx="3" />
                    <rect x="35" y="60" width="30" height="8" fill="#b45309" stroke="#000" strokeWidth="3" rx="2" />
                </svg>
            </NeoSticker>
        );
    }

    // Kozmolog (Spiral Galaksi)
    if (normalName.includes("kozmolog")) {
        return (
            <NeoSticker color="#0c0a09" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Galaksi Spirali */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }}>
                        <path d="M50 50 Q60 30 40 25 Q20 20 25 45 Q30 70 55 65 Q80 60 70 40 Q60 20 35 30" fill="none" stroke="#c084fc" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                        <path d="M50 50 Q40 70 60 75 Q80 80 75 55 Q70 30 45 35 Q20 40 30 60 Q40 80 65 70" fill="none" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                    </motion.g>
                    {/* Merkez */}
                    <motion.circle cx="50" cy="50" r="8" fill="#fbbf24" animate={{ r: [7, 10, 7], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
                    {/* Yıldızlar */}
                    <circle cx="20" cy="20" r="1.5" fill="#fff" />
                    <circle cx="80" cy="80" r="1" fill="#fff" />
                    <circle cx="85" cy="15" r="1.5" fill="#fff" />
                </svg>
            </NeoSticker>
        );
    }

    // Kuantum Mekaniği (Psi dalga fonksiyonu)
    if (normalName.includes("kuantum")) {
        return (
            <NeoSticker color="#581c87" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Dalga fonksiyonu ψ */}
                    <motion.path
                        d="M10 50 Q20 20 30 50 Q40 80 50 50 Q60 20 70 50 Q80 80 90 50"
                        fill="none" stroke="#c084fc" strokeWidth="5" strokeLinecap="round"
                        animate={{ d: ["M10 50 Q20 20 30 50 Q40 80 50 50 Q60 20 70 50 Q80 80 90 50", "M10 50 Q20 80 30 50 Q40 20 50 50 Q60 80 70 50 Q80 20 90 50", "M10 50 Q20 20 30 50 Q40 80 50 50 Q60 20 70 50 Q80 80 90 50"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Büyük Ψ sembolü */}
                    <text x="50" y="40" fontSize="35" fill="#e9d5ff" textAnchor="middle" fontFamily="serif" fontWeight="bold" fontStyle="italic">
                        Ψ
                    </text>
                    {/* Parçacık parıltıları */}
                    <motion.circle cx="30" cy="50" r="3" fill="#fef08a" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle cx="70" cy="50" r="3" fill="#fef08a" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }} />
                </svg>
            </NeoSticker>
        );
    }

    // Gece Kuşu (Baykuş + Ay)
    if (normalName.includes("gece") || normalName.includes("kuşu")) {
        return (
            <NeoSticker color="#1e1b4b" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Hilal Ay */}
                    <circle cx="75" cy="25" r="15" fill="#fbbf24" stroke="#000" strokeWidth="3" />
                    <circle cx="82" cy="20" r="12" fill="#1e1b4b" />
                    {/* Baykuş Gövdesi */}
                    <path d="M30 45 Q50 30 70 45 Q75 70 70 85 L30 85 Q25 70 30 45 Z" fill="#78350f" stroke="#000" strokeWidth="4" />
                    {/* Kulak çıkıntıları */}
                    <path d="M30 45 L20 30 L35 40" fill="#78350f" stroke="#000" strokeWidth="3" />
                    <path d="M70 45 L80 30 L65 40" fill="#78350f" stroke="#000" strokeWidth="3" />
                    {/* Gözler */}
                    <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}>
                        <circle cx="40" cy="55" r="10" fill="#fbbf24" stroke="#000" strokeWidth="3" />
                        <circle cx="60" cy="55" r="10" fill="#fbbf24" stroke="#000" strokeWidth="3" />
                        <circle cx="40" cy="55" r="5" fill="#000" />
                        <circle cx="60" cy="55" r="5" fill="#000" />
                        <circle cx="38" cy="52" r="2" fill="#fff" />
                        <circle cx="58" cy="52" r="2" fill="#fff" />
                    </motion.g>
                    {/* Gaga */}
                    <path d="M45 67 L50 75 L55 67" fill="#f59e0b" stroke="#000" strokeWidth="2" />
                    {/* Yıldızlar */}
                    <motion.circle cx="15" cy="20" r="1.5" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="55" cy="10" r="1" fill="#fff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                </svg>
            </NeoSticker>
        );
    }

    // Seri Okuyucu (Kitap Yığını)
    if (normalName.includes("seri") || normalName.includes("okuyucu")) {
        return (
            <NeoSticker color="#b91c1c" rotate={-3}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Kitap Yığını */}
                    <rect x="20" y="65" width="60" height="12" fill="#3b82f6" stroke="#000" strokeWidth="3" rx="2" />
                    <rect x="22" y="53" width="56" height="12" fill="#ef4444" stroke="#000" strokeWidth="3" rx="2" />
                    <rect x="18" y="41" width="64" height="12" fill="#22c55e" stroke="#000" strokeWidth="3" rx="2" />
                    <rect x="24" y="29" width="52" height="12" fill="#f59e0b" stroke="#000" strokeWidth="3" rx="2" />
                    {/* Üst kitap (açık) */}
                    <motion.g animate={{ rotateZ: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "25px" }}>
                        <path d="M25 25 L50 15 L75 25 L50 20 Z" fill="#a855f7" stroke="#000" strokeWidth="3" />
                        <line x1="50" y1="15" x2="50" y2="20" stroke="#000" strokeWidth="2" />
                    </motion.g>
                    {/* Gözlük */}
                    <circle cx="38" cy="85" r="6" fill="none" stroke="#000" strokeWidth="3" />
                    <circle cx="55" cy="85" r="6" fill="none" stroke="#000" strokeWidth="3" />
                    <line x1="44" y1="85" x2="49" y2="85" stroke="#000" strokeWidth="2" />
                </svg>
            </NeoSticker>
        );
    }

    // Evrensel (Evren / Parlayan Yıldızlar)
    if (normalName.includes("evrensel")) {
        return (
            <NeoSticker color="#020617" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Dev Yıldız */}
                    <motion.g animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: "50px", originY: "50px" }}>
                        <path d="M50 10 L58 40 L90 40 L64 58 L72 90 L50 70 L28 90 L36 58 L10 40 L42 40 Z" fill="#fde047" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
                    </motion.g>
                    {/* İç yıldız */}
                    <circle cx="50" cy="50" r="10" fill="#fff" stroke="#000" strokeWidth="2" />
                    <text x="50" y="55" fontSize="12" fill="#000" textAnchor="middle" fontWeight="black">∞</text>
                    {/* Küçük yıldızlar */}
                    <motion.circle cx="20" cy="20" r="2" fill="#fff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="80" cy="25" r="1.5" fill="#fff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="85" cy="80" r="2" fill="#fff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                </svg>
            </NeoSticker>
        );
    }

    // Araştırmacı (Büyüteç)
    if (normalName.includes("araştırmacı")) {
        return (
            <NeoSticker color="#0369a1" rotate={10}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Büyüteç Camı */}
                    <circle cx="40" cy="40" r="25" fill="#bae6fd" stroke="#000" strokeWidth="5" />
                    <circle cx="40" cy="40" r="18" fill="#e0f2fe" stroke="#000" strokeWidth="2" />
                    {/* Parlama */}
                    <path d="M30 30 Q25 35 30 35" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    {/* Sap */}
                    <line x1="58" y1="58" x2="85" y2="85" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
                    <line x1="58" y1="58" x2="85" y2="85" stroke="#a16207" strokeWidth="6" strokeLinecap="round" />
                    {/* İçindeki atom */}
                    <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "40px", originY: "40px" }}>
                        <circle cx="40" cy="28" r="3" fill="#ef4444" stroke="#000" strokeWidth="1" />
                    </motion.g>
                    <circle cx="40" cy="40" r="4" fill="#3b82f6" stroke="#000" strokeWidth="2" />
                </svg>
            </NeoSticker>
        );
    }

    // Çaylak (Filizlenen tohum)
    if (normalName.includes("çaylak")) {
        return (
            <NeoSticker color="#365314" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Toprak */}
                    <path d="M10 75 Q50 65 90 75 L90 95 L10 95 Z" fill="#78350f" stroke="#000" strokeWidth="4" />
                    {/* Saksı */}
                    <path d="M30 70 L35 90 L65 90 L70 70 Z" fill="#b45309" stroke="#000" strokeWidth="3" />
                    <line x1="30" y1="70" x2="70" y2="70" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                    {/* Fidan Gövdesi */}
                    <motion.g animate={{ scaleY: [0, 1] }} transition={{ duration: 2 }} style={{ originX: "50px", originY: "70px" }}>
                        <path d="M50 70 Q48 50 50 30" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
                        {/* Yapraklar */}
                        <motion.path d="M50 45 Q35 35 40 50" fill="#4ade80" stroke="#000" strokeWidth="2" animate={{ rotateZ: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                        <motion.path d="M50 35 Q65 25 60 40" fill="#22c55e" stroke="#000" strokeWidth="2" animate={{ rotateZ: [5, -5, 5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // Kaşif (Pusula)
    if (normalName.includes("kaşif")) {
        return (
            <NeoSticker color="#0c4a6e" rotate={0}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Pusula Gövdesi */}
                    <circle cx="50" cy="50" r="40" fill="#e0f2fe" stroke="#000" strokeWidth="5" />
                    <circle cx="50" cy="50" r="35" fill="#f0f9ff" stroke="#000" strokeWidth="2" />
                    {/* Yön İşaretleri */}
                    <text x="50" y="22" fontSize="10" fill="#000" textAnchor="middle" fontWeight="black">K</text>
                    <text x="50" y="88" fontSize="10" fill="#000" textAnchor="middle" fontWeight="black">G</text>
                    <text x="16" y="55" fontSize="10" fill="#000" textAnchor="middle" fontWeight="black">B</text>
                    <text x="84" y="55" fontSize="10" fill="#000" textAnchor="middle" fontWeight="black">D</text>
                    {/* İbre animasyonlu */}
                    <motion.g animate={{ rotateZ: [-20, 20, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "50px" }}>
                        <polygon points="50,20 45,50 50,45 55,50" fill="#ef4444" stroke="#000" strokeWidth="2" />
                        <polygon points="50,80 45,50 50,55 55,50" fill="#e2e8f0" stroke="#000" strokeWidth="2" />
                    </motion.g>
                    <circle cx="50" cy="50" r="4" fill="#000" />
                </svg>
            </NeoSticker>
        );
    }

    // Yardımsever (El + Kalp)
    if (normalName.includes("yardımsever")) {
        return (
            <NeoSticker color="#be185d" rotate={5}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* El */}
                    <path d="M25 90 L25 50 Q25 45 30 45 L35 45 L35 35 Q35 30 40 30 L45 30 L45 25 Q45 20 50 20 L55 20 L55 25 Q55 20 60 20 L65 20 Q70 20 70 25 L70 50 L75 45 Q80 40 85 45 L80 55 Q70 75 60 85 Z" fill="#fcd34d" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                    {/* Kalp */}
                    <motion.g animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "55px" }}>
                        <path d="M50 65 Q40 50 30 55 Q20 65 35 75 L50 90 L65 75 Q80 65 70 55 Q60 50 50 65 Z" fill="#ef4444" stroke="#000" strokeWidth="3" />
                    </motion.g>
                </svg>
            </NeoSticker>
        );
    }

    // Yazar (Kalem & Mürekkep)
    if (normalName.includes("yazar")) {
        return (
            <NeoSticker color="#1e3a5f" rotate={-8}>
                <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                    {/* Tüylü Kalem */}
                    <motion.g animate={{ rotateZ: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50px", originY: "85px" }}>
                        <path d="M50 85 L45 30 Q50 10 55 30 Z" fill="#e2e8f0" stroke="#000" strokeWidth="3" />
                        {/* Tüy çizgileri */}
                        <path d="M47 40 Q35 35 30 25" fill="none" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M47 55 Q30 50 25 45" fill="none" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M53 40 Q65 35 70 25" fill="none" stroke="#94a3b8" strokeWidth="2" />
                        <path d="M53 55 Q70 50 75 45" fill="none" stroke="#94a3b8" strokeWidth="2" />
                        {/* Uç */}
                        <polygon points="50,85 47,75 53,75" fill="#fbbf24" stroke="#000" strokeWidth="2" />
                    </motion.g>
                    {/* Mürekkep Damlaları */}
                    <motion.circle cx="50" cy="90" r="3" fill="#1e3a8a" animate={{ r: [2, 4, 2], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="55" cy="93" r="1.5" fill="#1e3a8a" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
                </svg>
            </NeoSticker>
        );
    }

    // Geçici Fallback (Eğer yukarıdaki if bloklarına girmezse)
    return (
        <NeoSticker color="#71717a">
            <svg viewBox="0 0 100 100" className="w-[70%] h-[70%]">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="10 10" />
                <text x="50" y="70" fontSize="50" fill="#fff" textAnchor="middle" fontWeight="black">?</text>
            </svg>
        </NeoSticker>
    );
}
