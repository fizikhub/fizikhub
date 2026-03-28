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
        c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>(?:<\/span>)?/gi, (_, latex) => `<span class="math-inline">${latex}</span>`);
        c = c.replace(/<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>(?:<\/span>)?/gi, (_, latex) => `<span class="math-inline">${latex}</span>`);
        
        // Auto-promote standalone equations to block math!
        // If a line is exclusively a formula (even if the user just used inline $..$ or added spaces), 
        // we convert it to block math $$...$$ so it centers perfectly inside the neo-brutalist container.
        c = c.replace(/^[ \t]*\$\$?([^$\n]+)\$\$?[ \t]*$/gm, '$$$$$1$$$$');
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
            "max-w-none transition-all duration-300 overflow-x-hidden",
            proseSizeClasses[fontSize],
            fontClasses[fontFamily],
            isZenMode ? "leading-loose" : "",
            className
        )} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, {
                        ...defaultSchema,
                        attributes: {
                            ...defaultSchema.attributes,
                            div: [...(defaultSchema.attributes?.div || []), ['className', 'math', 'math-display'], 'style'],
                            span: [...(defaultSchema.attributes?.span || []), ['className', 'math', 'math-inline'], 'style', 'data-type', 'data-latex', 'aria-hidden'],
                            code: [['className', /^language-./, 'hljs', 'math-inline', 'math-display']],
                            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
                            iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
                            // KaTeX needs these elements
                            math: ['xmlns', 'display'],
                            semantics: [],
                            annotation: ['encoding'],
                            mrow: [],
                            mi: [],
                            mo: [],
                            mn: [],
                            msup: [],
                            msub: [],
                            mfrac: [],
                            mspace: ['width'],
                            mtext: [],
                            menclose: ['notation'],
                            mover: [],
                            munder: [],
                            msqrt: [],
                            mroot: [],
                            mtable: [],
                            mtr: [],
                            mtd: [],
                        },
                        tagNames: [
                            ...(defaultSchema.tagNames || []),
                            'iframe',
                            // KaTeX HTML tags
                            'math', 'semantics', 'annotation',
                            'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac',
                            'mspace', 'mtext', 'menclose', 'mover', 'munder',
                            'msqrt', 'mroot', 'mtable', 'mtr', 'mtd',
                        ],
                    }],
                    rehypeKatex,
                    rehypeHighlight,
                ]}
                components={{
                    // Only override p to handle block elements (img/video/iframe inside <p>)
                    p: ({ node, children, ...props }) => {
                        const hasBlockElement = node?.children?.some((child: any) =>
                            ['img', 'video', 'iframe'].includes(child.tagName)
                        );
                        if (hasBlockElement) {
                            return <div>{children}</div>;
                        }
                        return <p {...props}>{children}</p>;
                    },
                    // External links open in new tab
                    a: ({ node, ...props }) => {
                        const isExternal = props.href && (props.href.startsWith('http') || props.href.startsWith('//'));
                        return (
                            <a
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                {...props}
                            />
                        );
                    },
                    // Wrap KaTeX block math in overflow-x-auto container for mobile
                    div: ({ node, children, className: divClassName, ...props }: any) => {
                        if (divClassName?.includes('math-display')) {
                            return (
                                <div className="overflow-x-auto my-6 sm:my-8 py-4 px-3 sm:px-5 bg-zinc-50 dark:bg-zinc-900/60 border-2 border-black dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]" style={{ maxWidth: '100%' }} {...props}>
                                    <div className={divClassName} style={{ textAlign: 'center', minWidth: 0 }}>{children}</div>
                                </div>
                            );
                        }
                        return <div className={divClassName} {...props}>{children}</div>;
                    },
                    // Image with Dialog zoom (must stay as custom override)
                    img: ({ node, ...props }: any) => {
                        const src = props.src as string;
                        if (src?.endsWith(".mp4") || src?.endsWith(".webm")) {
                            return (
                                <video controls className="rounded-xl w-full my-6 border-4 border-black dark:border-zinc-800 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]" {...props}>
                                    <source src={src} type={`video/${src.split('.').pop()}`} />
                                    Tarayıcınız video etiketini desteklemiyor.
                                </video>
                            );
                        }
                        return (
                            <div className="flex flex-col items-center my-8 sm:my-12">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-zoom-in w-full flex justify-center">
                                            <img
                                                loading="lazy"
                                                decoding="async"
                                                className="rounded-xl shadow-lg border-4 border-black dark:border-zinc-800 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.01] max-h-[600px] object-contain"
                                                {...props}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                                                <div className="bg-black/60 backdrop-blur-sm p-2.5 rounded-full text-white border-2 border-white/30">
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
                                    <span className="text-xs sm:text-sm text-muted-foreground mt-3 text-center italic font-medium">
                                        {props.alt}
                                    </span>
                                )}
                            </div>
                        );
                    },
                    // Iframe responsive embed
                    iframe: ({ node, ...props }: any) => (
                        <div className="aspect-video w-full my-8 sm:my-12 rounded-xl overflow-hidden border-4 border-black dark:border-zinc-800 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] bg-black/50">
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
