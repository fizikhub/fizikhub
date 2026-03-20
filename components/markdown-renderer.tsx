"use client";

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

// Lazy load heavy CSS — only when MarkdownRenderer mounts
let cssLoaded = false;
function loadMarkdownCSS() {
    if (cssLoaded || typeof window === 'undefined') return;
    cssLoaded = true;
    // Inject KaTeX CSS
    const katexLink = document.createElement('link');
    katexLink.rel = 'stylesheet';
    katexLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css';
    katexLink.crossOrigin = 'anonymous';
    katexLink.integrity = 'sha384-WcoG4HRXMzYzfCgiyfrySxx90XSl2rxY5mnVY5TwtWE6KLrArNKn0T/mOgNL0Mmi';
    document.head.appendChild(katexLink);
    // Inject highlight.js CSS
    const hlLink = document.createElement('link');
    hlLink.rel = 'stylesheet';
    hlLink.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css';
    hlLink.crossOrigin = 'anonymous';
    hlLink.integrity = 'sha384-wH75j6z1lH97ZOpMOInqhgKzFkAInZPPSPlZpYKYTOqsaizPvhQZmAtLcPKXpLyH';
    document.head.appendChild(hlLink);
}

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
    fontFamily = 'serif',
    isZenMode = false
}: MarkdownRendererProps) {
    // Load KaTeX + highlight.js CSS on first mount
    useEffect(() => {
        loadMarkdownCSS();
    }, []);

    // Preprocess content: convert HTML math nodes to $...$ notation
    // The editor stores math as <span data-type="math" data-latex="..."></span>
    // but ReactMarkdown + remarkMath only understands $...$ in markdown
    const processedContent = useMemo(() => {
        let c = content;
        // Convert <span data-type="math" data-latex="..."></span> or self-closing variants
        c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>(?:<\/span>)?/gi, (_, latex) => `$${latex}$`);
        // Also handle reverse attribute order: data-latex before data-type
        c = c.replace(/<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>(?:<\/span>)?/gi, (_, latex) => `$${latex}$`);
        return c;
    }, [content]);

    const proseSizeClasses = {
        sm: 'prose-sm',
        base: 'prose-base',
        lg: 'prose-lg',
        xl: 'prose-xl'
    };

    const fontClasses = {
        sans: 'font-sans',
        serif: 'font-serif tracking-wide'
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
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                        ...defaultSchema,
                        attributes: {
                            ...defaultSchema.attributes,
                            div: [...(defaultSchema.attributes?.div || []), 'className', 'math', 'math-display'],
                            span: [...(defaultSchema.attributes?.span || []), 'className', 'math', 'math-inline', 'data-type', 'data-latex'],
                            code: ['className'],
                            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
                            iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
                        },
                        tagNames: [...(defaultSchema.tagNames || []), 'iframe'],
                    }],
                    rehypeKatex,
                    rehypeHighlight,
                ]}
                components={{
                    p: ({ node, children, ...props }) => {
                        // Check if the paragraph contains any element that will render as a div/block
                        // react-markdown nodes use 'tagName'
                        const hasBlockElement = node?.children?.some((child: any) =>
                            ['img', 'video', 'iframe'].includes(child.tagName)
                        );

                        if (hasBlockElement) {
                            return <div className="mb-4">{children}</div>;
                        }

                        return <p className="mb-4 leading-relaxed" {...props}>{children}</p>;
                    },
                    a: ({ node, ...props }) => {
                        const isExternal = props.href && (props.href.startsWith('http') || props.href.startsWith('//'));
                        return (
                            <a 
                                className="text-secondary hover:underline" 
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                {...props} 
                            />
                        );
                    },
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-black font-serif mt-10 mb-6 text-primary leading-tight" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold font-serif mt-10 mb-5 text-primary border-b border-black/10 dark:border-white/10 pb-2 leading-snug" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold font-serif mt-8 mb-4 text-secondary leading-normal" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-[3px] border-black border-l-[8px] border-l-[#FF3366] dark:border-l-[#FFBD2E] pl-4 sm:pl-6 py-4 my-8 italic bg-neutral-100 dark:bg-[#27272a] rounded-[8px] shadow-[4px_4px_0_0_#000] font-serif font-medium text-black dark:text-zinc-200 leading-relaxed" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                        return inline ? (
                            <code className="bg-neutral-200 dark:bg-black border-[2px] border-black text-black dark:text-neo-yellow font-bold px-1.5 py-0.5 mx-0.5 rounded-[4px] font-mono shadow-[2px_2px_0_0_#000] text-[0.9em]" {...props}>
                                {children}
                            </code>
                        ) : (
                            <pre className="bg-black dark:bg-[#111111] border-[3px] border-black rounded-[8px] p-4 sm:p-5 overflow-x-auto mb-6 shadow-[4px_4px_0_0_#000]">
                                <code className="text-sm font-mono text-zinc-50" {...props}>
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
                                                loading="lazy"
                                                decoding="async"
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
                                sandbox="allow-scripts allow-same-origin allow-popups"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ),
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
