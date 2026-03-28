"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Link as LinkIcon, Facebook, Linkedin, Share2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar toast lib is used, or we can use simple alert for now
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonsProps {
    title: string;
    slug: string;
    variant?: 'default' | 'minimal';
    className?: string;
}

export function ShareButtons({ title, slug, variant = 'default', className }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    const isMinimal = variant === 'minimal';

    if (isMinimal) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("rounded-full w-9 h-9 sm:w-10 sm:h-10 text-neutral-600 dark:text-neutral-300", className)}>
                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48 p-2 border-2 border-black/10 dark:border-white/10 rounded-xl shadow-xl">
                    <DropdownMenuItem onClick={shareTwitter} className="group cursor-pointer rounded-lg py-2.5">
                        <Twitter className="mr-2 h-4 w-4 group-hover:text-blue-400" />
                        <span>Twitter'da Paylaş</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareLinkedin} className="group cursor-pointer rounded-lg py-2.5">
                        <Linkedin className="mr-2 h-4 w-4 group-hover:text-blue-700" />
                        <span>LinkedIn'de Paylaş</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy} className="group cursor-pointer rounded-lg py-2.5">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        <span>{copied ? 'Kopyalandı!' : 'Bağlantıyı Kopyala'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <div className={cn(
            "flex items-center gap-2",
            `my-8 border-t border-b border-border/50 py-4 ${className || ''}`
        )}>
            <span className="text-sm font-medium text-muted-foreground mr-2">Paylaş:</span>
            <Button variant="outline" size="icon" onClick={shareTwitter} className="hover:text-blue-400 hover:border-blue-400">
                <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareLinkedin} className="hover:text-blue-700 hover:border-blue-700">
                <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy} className="relative">
                <LinkIcon className="h-4 w-4" />
                {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded animate-in fade-in zoom-in duration-200">
                        Kopyalandı!
                    </span>
                )}
            </Button>
        </div>
    );
}
