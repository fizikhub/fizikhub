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
            // 1. If script is already there, check if global is ready
            if (document.querySelector('script[src*="unicornStudio.umd.js"]')) {
                const checkGlobal = setInterval(() => {
                    if (window.UnicornStudio) {
                        clearInterval(checkGlobal);
                        console.log("UnicornStudio global found, initializing...");
                        window.UnicornStudio.init();
                    }
                }, 100);

                // Stop checking after 5 seconds to avoid infinite loop
                setTimeout(() => clearInterval(checkGlobal), 5000);
                return;
            }

            // 2. If script not there, append it
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
            script.async = true;

            script.onload = () => {
                scriptLoadedRef.current = true;
                if (window.UnicornStudio) {
                    console.log('Unicorn Studio loaded, initializing project...');
                    window.UnicornStudio.init();
                }
            };

            script.onerror = (e) => {
                console.error("Failed to load UnicornStudio script", e);
            };

            document.head.appendChild(script);
        };

        loadScript();

        // Cleanup not strictly necessary for singleton script, but good practice if we were removing it.
        // For this, we'll leave it to avoid reloading issues on navigation.
    }, [projectId]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <div
                ref={containerRef}
                data-us-project={projectId}
                className="w-full h-full absolute inset-0 z-10"
                style={{ width: '100%', height: '100%' }}
            />
            {/* Force Canvas Style */}
            <style jsx global>{`
                [data-us-project] canvas {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    display: block !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default EnergyBeam;
