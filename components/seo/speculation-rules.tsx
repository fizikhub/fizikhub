'use client';

export function SpeculationRules() {
    // Unsupported browsers ignore unknown script types, so this can be emitted
    // without a client-only mounted state.
    if (process.env.NODE_ENV !== 'production') return null;

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
