import Link from "next/link";
import { Rocket } from "lucide-react";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 group select-none">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
                FİZİKHUB
            </span>
        </Link>
    );
}
