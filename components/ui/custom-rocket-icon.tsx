import Image from "next/image";
import { cn } from "@/lib/utils";

interface CustomRocketIconProps {
    className?: string; // Expects standard tailwind sizing classes e.g. "h-6 w-6"
}

export function CustomRocketIcon({ className = "" }: CustomRocketIconProps) {
    // The user provided a specific image (JPG). It will not inherit CSS colors like text-primary.
    // We wrap it in a relative container to allow sizing via className and proper image filling.
    return (
        <div className={cn("relative inline-block aspect-square select-none", className)}>
            <Image
                src="/images/rocket-logo-v4.png"
                alt="FizikHub Rocket Logo"
                fill
                className="object-contain scale-[1.3]" // Scaled up 30% as per user request
                priority
                sizes="(max-width: 768px) 32px, 64px"
            />
        </div>
    );
}
