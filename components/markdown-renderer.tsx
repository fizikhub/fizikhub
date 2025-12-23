"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
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
                rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
                components={{
                    p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                    a: ({ node, ...props }) => <a className="text-secondary hover:underline" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-primary" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-primary border-b border-white/10 pb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 text-secondary" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary pl-4 py-1 my-4 italic bg-white/5 rounded-r-lg" {...props} />
                    ),
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
                            <div className="flex flex-col items-center my-8">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-zoom-in w-full flex justify-center">
                                            <img
                                                className="rounded-lg shadow-lg border border-white/5 transition-transform duration-300 group-hover:scale-[1.01] max-h-[600px] object-contain"
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
                                {props.alt && props.alt !== "Makale görseli" && (
                                    <span className="text-sm text-muted-foreground mt-2 text-center italic border-b-2 border-primary/20 pb-1 px-4">
                                        {props.alt}
                                    </span>
                                )}
                            </div>
                        );
                    },
                    iframe: ({ node, ...props }: any) => (
                        <div className="aspect-video w-full my-8 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
                            <iframe
                                className="w-full h-full"
                                {...props}
                                loading="lazy"
                                allowFullScreen
                            />
                        </div>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
