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
        const loadScript = () => {
            if (scriptLoadedRef.current) return;

            // Check if script already exists in document
            if (document.querySelector('script[src*="unicornStudio.umd.js"]')) {
                scriptLoadedRef.current = true;
                if (window.UnicornStudio && containerRef.current) {
                    window.UnicornStudio.init();
                }
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
            script.async = true;

            script.onload = () => {
                scriptLoadedRef.current = true;
                if (window.UnicornStudio && containerRef.current) {
                    console.log('Unicorn Studio loaded, initializing project...');
                    window.UnicornStudio.init();
                }
            };

            document.head.appendChild(script);
        };

        loadScript();

        // Cleanup function to re-init if needed or cleanup
        return () => {
            // Usually we don't remove the script as it might be used elsewhere
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
