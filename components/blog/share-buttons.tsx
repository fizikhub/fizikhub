"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Link as LinkIcon, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildTrackedShareUrl } from "@/lib/growth-attribution";
import { trackGrowthEvent } from "@/lib/growth-client";

interface ShareButtonsProps {
    title: string;
    slug: string;
    variant?: 'default' | 'minimal';
    className?: string;
}

export function ShareButtons({ title, slug, variant = 'default', className }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const getShareUrl = (channel: string) => buildTrackedShareUrl(`${window.location.origin}/makale/${slug}`, channel, "article");

    const recordShare = (method: string) => {
        trackGrowthEvent("share", { method, content_type: "article", item_id: slug });
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getShareUrl("copy_link"));
        recordShare("copy_link");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareTwitter = () => {
        const url = getShareUrl("x");
        recordShare("x");
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    };

    const shareLinkedin = () => {
        const url = getShareUrl("linkedin");
        recordShare("linkedin");
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    };

    const shareWhatsApp = () => {
        const url = getShareUrl("whatsapp");
        recordShare("whatsapp");
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`, '_blank', 'noopener,noreferrer');
    };

    const shareNative = async () => {
        if (!navigator.share) return handleCopy();
        const url = getShareUrl("native_share");
        await navigator.share({ title, url });
        recordShare("native_share");
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
                    <DropdownMenuItem onClick={shareWhatsApp} className="group cursor-pointer rounded-lg py-2.5">
                        <MessageCircle className="mr-2 h-4 w-4 group-hover:text-emerald-500" />
                        <span>WhatsApp'ta Gönder</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={shareNative} className="group cursor-pointer rounded-lg py-2.5">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Cihazdan Paylaş</span>
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
            <Button variant="outline" size="icon" onClick={shareWhatsApp} className="hover:border-emerald-500 hover:text-emerald-500" aria-label="WhatsApp'ta paylaş">
                <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareNative} aria-label="Cihazdan paylaş">
                <Share2 className="h-4 w-4" />
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
