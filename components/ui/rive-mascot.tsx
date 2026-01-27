"use client";

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

interface RiveMascotProps {
    className?: string;
    state?: 'idle' | 'searching' | 'success' | 'fail';
}

export function RiveMascot({ className, state = 'idle' }: RiveMascotProps) {
    // Note: You need to place a valid .riv file in public/rive/
    // specific file: /rive/mascot.riv
    // For now we use a placeholder or a common free one if available.
    // Ideally, the user provides "mascot.riv".

    const { rive, RiveComponent } = useRive({
        src: '/rive/mascot.riv', // EXPECTED FILE
        stateMachines: "State Machine 1", // Common default name, update based on file
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    useEffect(() => {
        if (rive && state) {
            // Example input triggers based on state
            // You would customize these inputs based on your specific Rive file's state machine
            const inputs = rive.stateMachineInputs("State Machine 1");
            // Example: inputs.find(i => i.name === 'Level')?.value = 1;
        }
    }, [rive, state]);

    return (
        <div className={className}>
            <RiveComponent />
        </div>
    );
}
