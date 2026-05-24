'use client';

import { useEffect, useState } from 'react';

export function SpeculationRules() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only render on client-side production browsers that support speculation rules
    if (!mounted || process.env.NODE_ENV !== 'production') return null;

    // Check if the browser supports speculation rules
    const supportsSpeculationRules = 
        typeof HTMLScriptElement !== 'undefined' && 
        HTMLScriptElement.supports && 
        HTMLScriptElement.supports('speculationrules');

    if (!supportsSpeculationRules) return null;

    const rules = {
        prerender: [
            {
                source: 'document',
                where: {
                    and: [
                        { href_matches: ['/makale/*', '/konular/*', '/sozluk/*'] },
                        { not: { href_matches: ['/admin/*', '/yazar-paneli/*', '/profil/*', '/login', '/reset-password', '/forgot-password'] } }
                    ]
                },
                eagerness: 'moderate' // triggers prerender on hover/focus (moderate latency reduction)
            }
        ]
    };

    return (
        <script
            type="speculationrules"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
        />
    );
}
