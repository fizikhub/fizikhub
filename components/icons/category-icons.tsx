export const QuantumIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Atom nucleus */}
        <circle cx="12" cy="12" r="2.5" fill="#60A5FA" />
        {/* Electron orbits */}
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#3B82F6" strokeWidth="1.5" fill="none" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#60A5FA" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#93C5FD" strokeWidth="1.5" fill="none" transform="rotate(-60 12 12)" />
        {/* Electrons */}
        <circle cx="21" cy="12" r="1.5" fill="#3B82F6" />
        <circle cx="7.5" cy="4" r="1.5" fill="#60A5FA" />
        <circle cx="7.5" cy="20" r="1.5" fill="#93C5FD" />
    </svg>
);

export const AstroIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Saturn-like planet */}
        <circle cx="12" cy="12" r="6" fill="#F97316" />
        <ellipse cx="12" cy="12" rx="10" ry="3" stroke="#FDBA74" strokeWidth="2" fill="none" />
        {/* Stars */}
        <circle cx="4" cy="5" r="1" fill="#FCD34D" />
        <circle cx="20" cy="7" r="0.8" fill="#FCD34D" />
        <circle cx="19" cy="19" r="1.2" fill="#FCD34D" />
    </svg>
);

export const TechIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Circuit board */}
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#A855F7" strokeWidth="1.5" fill="#A855F7" fillOpacity="0.1" />
        {/* CPU core */}
        <rect x="8" y="8" width="8" height="8" fill="#A855F7" rx="1" />
        {/* Connection pins */}
        <line x1="12" y1="2" x2="12" y2="4" stroke="#C084FC" strokeWidth="2" />
        <line x1="12" y1="20" x2="12" y2="22" stroke="#C084FC" strokeWidth="2" />
        <line x1="2" y1="12" x2="4" y2="12" stroke="#C084FC" strokeWidth="2" />
        <line x1="20" y1="12" x2="22" y2="12" stroke="#C084FC" strokeWidth="2" />
    </svg>
);

export const NatureIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Earth */}
        <circle cx="12" cy="12" r="9" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="1.5" />
        {/* Continents */}
        <path d="M8 7c2-1 4 0 5 2s2 4 0 5-4 0-5-2" fill="#22C55E" />
        <path d="M14 14c1.5 0 3 1 3 2.5S16 19 14 18" fill="#22C55E" />
        <circle cx="17" cy="8" r="1.5" fill="#22C55E" />
    </svg>
);

export const BioIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* DNA double helix */}
        <path d="M8 2c0 4 8 4 8 8s-8 4-8 8c0 2 0 4 0 4" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 2c0 4-8 4-8 8s8 4 8 8c0 2 0 4 0 4" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
        {/* Connecting bars */}
        <line x1="9" y1="5" x2="15" y2="5" stroke="#5EEAD4" strokeWidth="1.5" />
        <line x1="8" y1="10" x2="16" y2="10" stroke="#5EEAD4" strokeWidth="1.5" />
        <line x1="9" y1="15" x2="15" y2="15" stroke="#5EEAD4" strokeWidth="1.5" />
        <line x1="9" y1="20" x2="15" y2="20" stroke="#5EEAD4" strokeWidth="1.5" />
    </svg>
);

export const ChemIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Flask */}
        <path d="M9 2h6v6l4 10a2 2 0 01-2 2H7a2 2 0 01-2-2l4-10V2z" stroke="#EAB308" strokeWidth="1.5" fill="#EAB308" fillOpacity="0.15" />
        {/* Liquid */}
        <path d="M6 16h12" stroke="#FACC15" strokeWidth="3" />
        {/* Bubbles */}
        <circle cx="10" cy="14" r="1" fill="#FDE047" />
        <circle cx="14" cy="13" r="0.8" fill="#FDE047" />
        <circle cx="12" cy="15" r="1.2" fill="#FDE047" />
        {/* Top */}
        <line x1="8" y1="2" x2="16" y2="2" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const EduIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Graduation cap */}
        <path d="M2 9l10-5 10 5-10 5-10-5z" fill="#6366F1" fillOpacity="0.3" stroke="#6366F1" strokeWidth="1.5" />
        {/* Cap top */}
        <path d="M6 11v5c0 2 3 4 6 4s6-2 6-4v-5" stroke="#818CF8" strokeWidth="1.5" fill="none" />
        {/* Tassel */}
        <line x1="20" y1="9" x2="20" y2="15" stroke="#6366F1" strokeWidth="2" />
        <circle cx="20" cy="16" r="1.5" fill="#A5B4FC" />
    </svg>
);

export const PhysicsIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Pendulum base */}
        <line x1="4" y1="4" x2="20" y2="4" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
        {/* Pendulum strings */}
        <line x1="8" y1="4" x2="8" y2="16" stroke="#FB7185" strokeWidth="1.5" />
        <line x1="12" y1="4" x2="12" y2="16" stroke="#FB7185" strokeWidth="1.5" />
        <line x1="16" y1="4" x2="16" y2="16" stroke="#FB7185" strokeWidth="1.5" />
        {/* Balls */}
        <circle cx="8" cy="18" r="2.5" fill="#F43F5E" />
        <circle cx="12" cy="18" r="2.5" fill="#FB7185" />
        <circle cx="16" cy="18" r="2.5" fill="#FDA4AF" />
    </svg>
);

export const ExploreIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        {/* Compass */}
        <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.5" fill="#F59E0B" fillOpacity="0.1" />
        {/* Compass needle */}
        <path d="M12 5l2 7-2 2-2-2 2-7z" fill="#EF4444" />
        <path d="M12 19l-2-7 2-2 2 2-2 7z" fill="#3B82F6" />
        {/* Center */}
        <circle cx="12" cy="12" r="1.5" fill="#F59E0B" />
        {/* Cardinal points */}
        <circle cx="12" cy="3" r="1" fill="#FCD34D" />
        <circle cx="12" cy="21" r="1" fill="#FCD34D" />
        <circle cx="3" cy="12" r="1" fill="#FCD34D" />
        <circle cx="21" cy="12" r="1" fill="#FCD34D" />
    </svg>
);
