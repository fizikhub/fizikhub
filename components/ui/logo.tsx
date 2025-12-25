import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-1.5 group select-none">
            <SiteLogo className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110" />
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                FizikHub
            </span>
        </Link>
    );
}
