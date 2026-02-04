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

            // Check if script already exists to prevent duplicates
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
                    // Initialize the Unicorn Studio project
                    window.UnicornStudio.init();
                }
            };

            document.head.appendChild(script);
        };

        loadScript();

        // Cleanup not strictly necessary for singleton script, but good practice if we were removing it.
        // For this, we'll leave it to avoid reloading issues on navigation.
    }, [projectId]);

    return (
        <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
            <div
                ref={containerRef}
                data-us-project={projectId}
                className="w-full h-full"
            />
        </div>
    );
};

export default EnergyBeam;
