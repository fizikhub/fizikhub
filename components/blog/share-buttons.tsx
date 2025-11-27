"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Link as LinkIcon, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar toast lib is used, or we can use simple alert for now
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
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

    return (
        <div className="flex items-center gap-2 my-8 border-t border-b border-border/50 py-4">
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
