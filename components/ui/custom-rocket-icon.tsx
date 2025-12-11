import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomRocketIconProps {
    className?: string;
}

export function CustomRocketIcon({ className }: CustomRocketIconProps) {
    return <Rocket className={cn("w-6 h-6", className)} />;
}
