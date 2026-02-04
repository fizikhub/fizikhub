"use client";

import React, { useEffect, useRef } from 'react';

interface EnergyBeamProps {
    projectId?: string;
    className?: string;
}

declare global {
    interface Window {
        UnicornStudio?: any;
    }
}

const EnergyBeam: React.FC<EnergyBeamProps> = ({
    projectId = "hRFfUymDGOHwtFe7evR2",
    className = ""
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const init = () => {
            if (window.UnicornStudio) {
                console.log("UnicornStudio found, initializing...");
                window.UnicornStudio.init();
            } else {
                // If script exists but global not ready, verify if script is actually loaded or just inserted
                // We'll standardly poll for a bit
                timeoutId = setTimeout(init, 100);
            }
        };

        const existingScript = document.querySelector('script[src*="unicornStudio.umd.js"]');

        if (existingScript) {
            init();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
            script.async = true;
            script.onload = init;
            document.head.appendChild(script);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [projectId]);

    return (
        <div className={`relative w-full h-[400px] md:h-[600px] bg-black overflow-hidden rounded-xl border-2 border-white/10 ${className}`}>
            <div
                ref={containerRef}
                data-us-project={projectId}
                className="w-full h-full"
            />

            {/* Overlay Gradient for seamless integration */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
    );
};

export default EnergyBeam;
