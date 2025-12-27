export const QuantumIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-50" />
        <ellipse cx="12" cy="12" rx="9" ry="3" className="rotate-45" />
        <ellipse cx="12" cy="12" rx="9" ry="3" className="-rotate-45" />
    </svg>
);

export const AstroIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2L14.5 9L22 9.5L16 14L18 22L12 18L6 22L8 14L2 9.5L9.5 9L12 2Z" fill="currentColor" className="opacity-20" />
        <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        <circle cx="5" cy="18" r="1" fill="currentColor" />
    </svg>
);

export const TechIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" className="opacity-10" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
        <circle cx="12" cy="12" r="2" />
        <path d="M4 10V4h6" />
        <path d="M20 14v6h-6" />
    </svg>
);

export const NatureIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 3v19" />
        <path d="M12 10c0-4 6-5 8-2s-3 6-8 6" fill="currentColor" className="opacity-20" />
        <path d="M12 12c0-4-6-5-8-2s3 6 8 6" fill="currentColor" className="opacity-20" />
    </svg>
);

export const BioIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M7 20c0-6 4-10 4-10s-5-3-5-8 4 0 5 4" fill="currentColor" className="opacity-10" />
        <path d="M17 20c0-6-4-10-4-10s5-3 5-8-4 0-5 4" fill="currentColor" className="opacity-10" />
        <circle cx="12" cy="10" r="1.5" />
    </svg>
);

export const ChemIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M10 2v7.31" />
        <path d="M14 2v7.31" />
        <path d="M8.5 2h7" />
        <path d="M18.8 21.6A2 2 0 0 1 17.1 23H6.9a2 2 0 0 1-1.7-1.4c-.3-1.1 0-2.2.8-3.1l3.5-4.2a1 1 0 0 1 .7-.3h3.6a1 1 0 0 1 .7.3l3.5 4.2c.8.9 1.1 2 .8 3.1z" fill="currentColor" className="opacity-20" />
    </svg>
);

export const EduIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill="currentColor" className="opacity-20" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export const PhysicsIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2v2" />
        <path d="M12 22l8-10H4l8 10z" fill="currentColor" className="opacity-20" />
    </svg>
);

export const ExploreIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M12 2l3 7h7l-5 4.5 2 8.5-7-5-7 5 2-8.5-5-4.5h7z" className="opacity-0" />
        <path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" fill="currentColor" className="opacity-20" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
);
