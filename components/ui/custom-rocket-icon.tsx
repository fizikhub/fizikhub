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
                src="/images/rocket-logo.jpg"
                alt="FizikHub Rocket Logo"
                fill
                className="object-contain" // Ensures the logo is fully visible without distortion
                priority // Priority loading for LCP since it's a key brand element
                sizes="(max-width: 768px) 32px, 64px" // Optimization for common icon sizes
            />
        </div>
    );
}
