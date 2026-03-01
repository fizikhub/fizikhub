"use client";

import React from "react";
import { cn } from "@/lib/utils";
import * as Phosphor from "@phosphor-icons/react";

export interface CustomBadgeIconProps {
    name: string;
    size?: number;
    className?: string;
}

// Renk Paleti (Neo-Brutalist)
const COLORS = {
    yellow: "#FFD166",
    pink: "#EF476F",
    blue: "#118AB2",
    green: "#06D6A0",
    orange: "#F77F00",
    purple: "#8338EC",
    cyan: "#00F5D4",
    white: "#FFFFFF",
};

export const BadgeData = [
    // 1. Einstein
    { match: "einstein", icon: Phosphor.Brain, color: COLORS.cyan },
    // 2. Newton
    { match: "newton", icon: Phosphor.Tree, color: COLORS.green },
    // 3. Da Vinci
    { match: "vinci", icon: Phosphor.CompassTool, color: COLORS.yellow },
    // 4. Galileo
    { match: "galileo", icon: Phosphor.Binoculars, color: COLORS.blue },
    // 5. Kopernik
    { match: "kopernik", icon: Phosphor.Planet, color: COLORS.orange },
    // 6. Leibniz
    { match: "leibniz", icon: Phosphor.MathOperations, color: COLORS.purple },
    // 7. Hawking
    { match: "hawking", icon: Phosphor.Wheelchair, color: COLORS.blue },
    // 8. Mona Lisa
    { match: "monalisa", icon: Phosphor.Palette, color: COLORS.pink },
    // 9. Ay'a İlk Adım
    { match: "adım", icon: Phosphor.Footprints, color: COLORS.white },
    // 10. Merhaba Dünya
    { match: "merhaba", icon: Phosphor.GlobeHemisphereWest, color: COLORS.blue },
    // 11. Kaşif
    { match: "kaşif", icon: Phosphor.MapTrifold, color: COLORS.yellow },
    { match: "kasif", icon: Phosphor.MapTrifold, color: COLORS.yellow },
    // 12. Yardımsever
    { match: "yardımsever", icon: Phosphor.HandHeart, color: COLORS.pink },
    { match: "yardimsever", icon: Phosphor.HandHeart, color: COLORS.pink },
    // 13. Yıldız Tozu
    { match: "yıldız tozu", icon: Phosphor.Sparkle, color: COLORS.purple },
    { match: "yildiz tozu", icon: Phosphor.Sparkle, color: COLORS.purple },
    // 14. Kuyruklu Yıldız
    { match: "kuyruklu", icon: Phosphor.ShootingStar, color: COLORS.cyan },
    // 15. Galaksi
    { match: "galaksi", icon: Phosphor.Atom, color: COLORS.blue },
    // 16. Soru İşareti
    { match: "soru", icon: Phosphor.Question, color: COLORS.orange },
    // 17. Meraklı
    { match: "meraklı", icon: Phosphor.MagnifyingGlass, color: COLORS.green },
    { match: "merakli", icon: Phosphor.MagnifyingGlass, color: COLORS.green },
    // 18. Soru Ustası
    { match: "usta", icon: Phosphor.ChatsTeardrop, color: COLORS.purple },
    // 19. En İyi Cevap
    { match: "cevap", icon: Phosphor.Trophy, color: COLORS.yellow },
    // 20. Tesla
    { match: "tesla", icon: Phosphor.Lightning, color: COLORS.yellow },
    // 21. Seri Okuyucu
    { match: "okuyucu", icon: Phosphor.BookOpenText, color: COLORS.cyan },
    // 22. Keskin Göz
    { match: "keskin", icon: Phosphor.Eye, color: COLORS.green },
    // 23. Bilge
    { match: "bilge", icon: Phosphor.BookmarkSimple, color: COLORS.purple },
    // 24. Uzman
    { match: "uzman", icon: Phosphor.GraduationCap, color: COLORS.orange },
    // 25. Fizik Dehası
    { match: "dehas", icon: Phosphor.Atom, color: COLORS.blue },
    // 26. Sosyal Kelebek
    { match: "sosyal", icon: Phosphor.Users, color: COLORS.pink },
    // 27. Popüler
    { match: "popüler", icon: Phosphor.Star, color: COLORS.yellow },
    { match: "populer", icon: Phosphor.Star, color: COLORS.yellow },
    // 28. Fikir Önderi
    { match: "önder", icon: Phosphor.Lightbulb, color: COLORS.yellow },
    { match: "onder", icon: Phosphor.Lightbulb, color: COLORS.yellow },
    // 29. Sevilen
    { match: "sevilen", icon: Phosphor.Heart, color: COLORS.pink },
    // 30. Çaylak
    { match: "çaylak", icon: Phosphor.Plant, color: COLORS.green },
    { match: "caylak", icon: Phosphor.Plant, color: COLORS.green },
    // 31. Gözlemci
    { match: "gözlemci", icon: Phosphor.Binoculars, color: COLORS.blue },
    { match: "gozlemci", icon: Phosphor.Binoculars, color: COLORS.blue },
    // 32. Araştırmacı
    { match: "araştır", icon: Phosphor.Microscope, color: COLORS.pink },
    { match: "arastir", icon: Phosphor.Microscope, color: COLORS.pink },
    // 33. Teorisyen
    { match: "teorisyen", icon: Phosphor.ChalkboardTeacher, color: COLORS.yellow },
    // 34. Profesör
    { match: "profesör", icon: Phosphor.Student, color: COLORS.green },
    { match: "profesor", icon: Phosphor.Student, color: COLORS.green },
    // 35. Kozmolog
    { match: "kozmolog", icon: Phosphor.Globe, color: COLORS.purple },
    // 36. Evrensel
    { match: "evrensel", icon: Phosphor.Infinity, color: COLORS.blue },
    // 37. Kuantum
    { match: "kuantum", icon: Phosphor.Shapes, color: COLORS.purple },
    // 38. Çırak
    { match: "çırak", icon: Phosphor.Wrench, color: COLORS.orange },
    { match: "cirak", icon: Phosphor.Wrench, color: COLORS.orange },
    // 39. Curie
    { match: "curie", icon: Phosphor.Flask, color: COLORS.cyan },
    // 40. Galileo Fallback
    { match: "galileo fallback", icon: Phosphor.Binoculars, color: COLORS.blue },
    // 41. Gece Kuşu
    { match: "gece", icon: Phosphor.Moon, color: COLORS.purple },
    // 42. Bilge Baykuş
    { match: "baykuş", icon: Phosphor.Bird, color: COLORS.blue },
    { match: "baykus", icon: Phosphor.Bird, color: COLORS.blue },
    // 43. Sorun Çözücü
    { match: "çözücü", icon: Phosphor.PuzzlePiece, color: COLORS.orange },
    { match: "cozucu", icon: Phosphor.PuzzlePiece, color: COLORS.orange },
    // 44. Karadelik
    { match: "karadelik", icon: Phosphor.CircleDashed, color: COLORS.white },
    // 45. Schrödinger
    { match: "schrödinger", icon: Phosphor.Cat, color: COLORS.green },
    { match: "schrodinger", icon: Phosphor.Cat, color: COLORS.green },
    // 46. Bohr
    { match: "bohr", icon: Phosphor.Target, color: COLORS.yellow },
];

export function CustomBadgeIcon({ name, size = 48, className }: CustomBadgeIconProps) {
    const n = name.toLocaleLowerCase("tr-TR").trim();

    // Bul veya Fallback'e düş
    const match = BadgeData.find(b => n.includes(b.match)) || { icon: Phosphor.Star, color: COLORS.white };
    const IconComponent = match.icon;

    // Kutunun boyutları (Neo-Brutalist wrapper)
    const wrapperSize = size + 16;
    const iconSize = size * 0.75;

    return (
        <div
            className={cn(
                "relative flex items-center justify-center rounded-xl",
                "border-2 md:border-3 border-black",
                "transition-transform duration-200 ease-in-out",
                "hover:-translate-y-1 hover:translate-x-1",
                className
            )}
            style={{
                width: wrapperSize,
                height: wrapperSize,
                backgroundColor: match.color,
                // Neo-Brutalist Hard Shadow
                boxShadow: "3px 3px 0px 0px #000000"
            }}
        >
            <IconComponent
                size={iconSize}
                weight="bold"
                color="#000000"
            />
        </div>
    );
}
