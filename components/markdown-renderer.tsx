"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

interface MarkdownRendererProps {
    content: string;
    className?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
    fontFamily?: 'sans' | 'serif';
    isZenMode?: boolean;
}

export function MarkdownRenderer({
    content,
    className,
    fontSize = 'base',
    fontFamily = 'sans',
    isZenMode = false
}: MarkdownRendererProps) {
    const proseSizeClasses = {
        sm: 'prose-sm',
        base: 'prose-base',
        lg: 'prose-lg',
        xl: 'prose-xl'
    };

    const fontClasses = {
        sans: 'font-sans',
        serif: 'font-serif'
    };

    return (
        <div className={cn(
            "prose prose-invert max-w-none transition-all duration-300",
            "prose-headings:text-primary prose-a:text-secondary",
            proseSizeClasses[fontSize],
            fontClasses[fontFamily],
            isZenMode ? "prose-p:opacity-90 leading-loose" : "",
            className
        )}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                    a: ({ node, ...props }) => <a className="text-secondary hover:underline" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        return inline ? (
                            <code className="bg-secondary/20 rounded px-1 py-0.5 text-sm font-mono" {...props}>
                                {children}
                            </code>
                        ) : (
                            <pre className="bg-secondary/10 rounded-lg p-4 overflow-x-auto mb-4">
                                <code className="text-sm font-mono" {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                    img: ({ node, ...props }: any) => {
                        const src = props.src as string;
                        if (src?.endsWith(".mp4") || src?.endsWith(".webm")) {
                            return (
                                <video controls className="rounded-lg w-full my-4 shadow-lg border border-white/5" {...props}>
                                    <source src={src} type={`video/${src.split('.').pop()}`} />
                                    Tarayıcınız video etiketini desteklemiyor.
                                </video>
                            );
                        }

                        return (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative group cursor-zoom-in my-6">
                                        <img
                                            className="rounded-lg w-full shadow-lg border border-white/5 transition-transform duration-300 group-hover:scale-[1.01]"
                                            {...props}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                            <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
                                                <ZoomIn className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] h-[90vh] bg-transparent border-none shadow-none flex items-center justify-center overflow-hidden p-0">
                                    <img
                                        src={src}
                                        alt={props.alt || "Makale görseli"}
                                        className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                                    />
                                </DialogContent>
                            </Dialog>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
