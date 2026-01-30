"use client";

import { useRef, useEffect, useState } from "react";
import p5 from "p5";

interface P5WrapperProps {
    sketch: (p: p5, parentRef: HTMLDivElement) => void;
    className?: string;
}

export function P5Wrapper({ sketch, className = "" }: P5WrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current) return;

        // Create p5 instance
        p5InstanceRef.current = new p5((p: p5) => {
            sketch(p, containerRef.current!);
        }, containerRef.current);

        // Cleanup
        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove();
                p5InstanceRef.current = null;
            }
        };
    }, [mounted, sketch]);

    if (!mounted) {
        return (
            <div className={`bg-neutral-900 flex items-center justify-center ${className}`}>
                <div className="text-white/50 text-sm">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef} 
            className={`relative overflow-hidden ${className}`}
            style={{ touchAction: 'none' }}
        />
    );
}
