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
    // Construct the URL with projectId
    const iframeSrc = `/energy-beam.html?projectId=${projectId}`;

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <iframe
                src={iframeSrc}
                className="w-full h-full border-0 absolute inset-0 pointer-events-none"
                title="Energy Beam Animation"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
};

export default EnergyBeam;
