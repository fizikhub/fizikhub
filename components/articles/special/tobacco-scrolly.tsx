"use client";

import dynamic from "next/dynamic";
import { Article } from "@/lib/api";

// Dynamically import 3D Scene with NO SSR to prevent 500 errors
const Tobacco3DScene = dynamic(() => import("./tobacco-3d-scene").then(mod => mod.Tobacco3DScene), {
    ssr: false,
    loading: () => <div className="h-screen w-screen bg-black flex items-center justify-center text-green-500 font-mono animate-pulse">Yükleniyor...</div>
});

interface TobaccoScrollyProps {
    article: Article;
    readingTime: string;
}

export function TobaccoScrolly({ article, readingTime }: TobaccoScrollyProps) {
    return (
        <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
            <Tobacco3DScene />
        </div>
    );
}
