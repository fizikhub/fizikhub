import { cn } from "@/lib/utils";
import Image from "next/image";

interface SiteLogoProps {
    className?: string;
}

export function SiteLogo({ className }: SiteLogoProps) {
    return (
        <Image
            src="/logo-no-bg.svg"
            alt="FizikHub Logo"
            width={53}
            height={53}
            className={cn("w-auto h-[53px]", className)}
            priority
        />
    );
}
