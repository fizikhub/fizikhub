"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Brain,
    Tree,
    CompassTool,
    Binoculars,
    Planet,
    MathOperations,
    Wheelchair,
    Palette,
    Footprints,
    GlobeHemisphereWest,
    MapTrifold,
    HandHeart,
    Sparkle,
    ShootingStar,
    Atom,
    Question,
    MagnifyingGlass,
    ChatsTeardrop,
    Trophy,
    Lightning,
    BookOpenText,
    Eye,
    BookmarkSimple,
    GraduationCap,
    Users,
    Star,
    Lightbulb,
    Heart,
    Plant,
    Microscope,
    ChalkboardTeacher,
    Student,
    Globe,
    Infinity,
    Shapes,
    Wrench,
    Flask,
    Moon,
    Bird,
    PuzzlePiece,
    CircleDashed,
    Cat,
    Target,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

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

export const BadgeData: { match: string; icon: Icon; color: string }[] = [
    // 1. Einstein
    { match: "einstein", icon: Brain, color: COLORS.cyan },
    // 2. Newton
    { match: "newton", icon: Tree, color: COLORS.green },
    // 3. Da Vinci
    { match: "vinci", icon: CompassTool, color: COLORS.yellow },
    // 4. Galileo
    { match: "galileo", icon: Binoculars, color: COLORS.blue },
    // 5. Kopernik
    { match: "kopernik", icon: Planet, color: COLORS.orange },
    // 6. Leibniz
    { match: "leibniz", icon: MathOperations, color: COLORS.purple },
    // 7. Hawking
    { match: "hawking", icon: Wheelchair, color: COLORS.blue },
    // 8. Mona Lisa
    { match: "monalisa", icon: Palette, color: COLORS.pink },
    // 9. Ay'a İlk Adım
    { match: "adım", icon: Footprints, color: COLORS.white },
    // 10. Merhaba Dünya
    { match: "merhaba", icon: GlobeHemisphereWest, color: COLORS.blue },
    // 11. Kaşif
    { match: "kaşif", icon: MapTrifold, color: COLORS.yellow },
    { match: "kasif", icon: MapTrifold, color: COLORS.yellow },
    // 12. Yardımsever
    { match: "yardımsever", icon: HandHeart, color: COLORS.pink },
    { match: "yardimsever", icon: HandHeart, color: COLORS.pink },
    // 13. Yıldız Tozu
    { match: "yıldız tozu", icon: Sparkle, color: COLORS.purple },
    { match: "yildiz tozu", icon: Sparkle, color: COLORS.purple },
    // 14. Kuyruklu Yıldız
    { match: "kuyruklu", icon: ShootingStar, color: COLORS.cyan },
    // 15. Galaksi
    { match: "galaksi", icon: Atom, color: COLORS.blue },
    // 16. Soru İşareti
    { match: "soru", icon: Question, color: COLORS.orange },
    // 17. Meraklı
    { match: "meraklı", icon: MagnifyingGlass, color: COLORS.green },
    { match: "merakli", icon: MagnifyingGlass, color: COLORS.green },
    // 18. Soru Ustası
    { match: "usta", icon: ChatsTeardrop, color: COLORS.purple },
    // 19. En İyi Cevap
    { match: "cevap", icon: Trophy, color: COLORS.yellow },
    // 20. Tesla
    { match: "tesla", icon: Lightning, color: COLORS.yellow },
    // 21. Seri Okuyucu
    { match: "okuyucu", icon: BookOpenText, color: COLORS.cyan },
    // 22. Keskin Göz
    { match: "keskin", icon: Eye, color: COLORS.green },
    // 23. Bilge
    { match: "bilge", icon: BookmarkSimple, color: COLORS.purple },
    // 24. Uzman
    { match: "uzman", icon: GraduationCap, color: COLORS.orange },
    // 25. Fizik Dehası
    { match: "dehas", icon: Atom, color: COLORS.blue },
    // 26. Sosyal Kelebek
    { match: "sosyal", icon: Users, color: COLORS.pink },
    // 27. Popüler
    { match: "popüler", icon: Star, color: COLORS.yellow },
    { match: "populer", icon: Star, color: COLORS.yellow },
    // 28. Fikir Önderi
    { match: "önder", icon: Lightbulb, color: COLORS.yellow },
    { match: "onder", icon: Lightbulb, color: COLORS.yellow },
    // 29. Sevilen
    { match: "sevilen", icon: Heart, color: COLORS.pink },
    // 30. Çaylak
    { match: "çaylak", icon: Plant, color: COLORS.green },
    { match: "caylak", icon: Plant, color: COLORS.green },
    // 31. Gözlemci
    { match: "gözlemci", icon: Binoculars, color: COLORS.blue },
    { match: "gozlemci", icon: Binoculars, color: COLORS.blue },
    // 32. Araştırmacı
    { match: "araştır", icon: Microscope, color: COLORS.pink },
    { match: "arastir", icon: Microscope, color: COLORS.pink },
    // 33. Teorisyen
    { match: "teorisyen", icon: ChalkboardTeacher, color: COLORS.yellow },
    // 34. Profesör
    { match: "profesör", icon: Student, color: COLORS.green },
    { match: "profesor", icon: Student, color: COLORS.green },
    // 35. Kozmolog
    { match: "kozmolog", icon: Globe, color: COLORS.purple },
    // 36. Evrensel
    { match: "evrensel", icon: Infinity, color: COLORS.blue },
    // 37. Kuantum
    { match: "kuantum", icon: Shapes, color: COLORS.purple },
    // 38. Çırak
    { match: "çırak", icon: Wrench, color: COLORS.orange },
    { match: "cirak", icon: Wrench, color: COLORS.orange },
    // 39. Curie
    { match: "curie", icon: Flask, color: COLORS.cyan },
    // 40. Galileo Fallback
    { match: "galileo fallback", icon: Binoculars, color: COLORS.blue },
    // 41. Gece Kuşu
    { match: "gece", icon: Moon, color: COLORS.purple },
    // 42. Bilge Baykuş
    { match: "baykuş", icon: Bird, color: COLORS.blue },
    { match: "baykus", icon: Bird, color: COLORS.blue },
    // 43. Sorun Çözücü
    { match: "çözücü", icon: PuzzlePiece, color: COLORS.orange },
    { match: "cozucu", icon: PuzzlePiece, color: COLORS.orange },
    // 44. Karadelik
    { match: "karadelik", icon: CircleDashed, color: COLORS.white },
    // 45. Schrödinger
    { match: "schrödinger", icon: Cat, color: COLORS.green },
    { match: "schrodinger", icon: Cat, color: COLORS.green },
    // 46. Bohr
    { match: "bohr", icon: Target, color: COLORS.yellow },
];

export function CustomBadgeIcon({ name, size = 48, className }: CustomBadgeIconProps) {
    const n = name.toLocaleLowerCase("tr-TR").trim();

    // Bul veya Fallback'e düş
    const match = BadgeData.find(b => n.includes(b.match)) || { icon: Star, color: COLORS.white };
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
