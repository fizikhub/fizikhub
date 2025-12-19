import { cn } from "@/lib/utils";


interface SiteLogoProps {
    className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
    return (
        <div
            className={cn("w-[53px] h-[53px] bg-primary", className)}
            style={{
                maskImage: 'url("/logo-no-bg.svg")',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url("/logo-no-bg.svg")',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
            }}
            aria-label="FizikHub Logo"
        />
    );
}
