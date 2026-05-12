"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MarkdownRendererProps {
    content: string;
    className?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
    fontFamily?: 'sans' | 'serif';
    isZenMode?: boolean;
    demoteH1?: boolean;
}

export function MarkdownRenderer({
    content,
    className,
    fontSize = 'base',
    fontFamily = 'serif',
    isZenMode = false,
    demoteH1 = false
}: MarkdownRendererProps) {
    // Preprocess content: convert HTML math nodes to proper LaTeX notation
    // The Tiptap editor stores math as <span data-type="math" data-latex="..."></span>
    // The tiptap-markdown extension serializes math as $latex$ (always inline)
    // ReactMarkdown + remarkMath only understands $...$ / $$...$$ in markdown
    const processedContent = useMemo(() => {
        if (!content) return "";
        let c = content;

        // Step 0: Normalize — remove zero-width spaces, normalize line endings
        c = c.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
        c = c.replace(/\r\n/g, '\n');

        // Step 1: Ensure headers starts on a new line with proper spacing
        // This fixes "### Header" appearing as literal text if previous line ended poorly
        c = c.replace(/^([ \t]*)#{1,6}[ \t]+/gm, (match) => `\n\n${match.trim()}\n\n`);

        // Step 2: Convert <p> containing ONLY a math span → block math $$...$$
        c = c.replace(/<p>\s*<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>[^<]*<\/span>\s*<\/p>/gi, (_, latex) => `\n\n$$\n${latex.trim()}\n$$\n\n`);
        c = c.replace(/<p>\s*<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>[^<]*<\/span>\s*<\/p>/gi, (_, latex) => `\n\n$$\n${latex.trim()}\n$$\n\n`);

        // Step 3: Remaining inline math spans (mixed with text in a paragraph)
        c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>[^<]*<\/span>/gi, (_, latex) => `$${latex.trim()}$`);
        c = c.replace(/<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>[^<]*<\/span>/gi, (_, latex) => `$${latex.trim()}$`);

        // Step 4: Self-closing math spans
        c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*\/>/gi, (_, latex) => `$${latex.trim()}$`);

        // Step 5: Auto-promote standalone $...$ on their own line to block $$...$$
        c = c.replace(/^[ \t]*\$([^$\n]+)\$[ \t]*$/gm, (_, latex) => `\n\n$$\n${latex}\n$$\n\n`);
        c = c.replace(/^[ \t]*\$\$([^$\n]+)\$\$[ \t]*$/gm, (_, latex) => `\n\n$$\n${latex}\n$$\n\n`);

        // Step 6: Collapse multiple newlines — but ensure at least 2 between logical blocks
        c = c.replace(/\n{3,}/g, '\n\n');
        
        // Final trim to avoid leading/trailing garbage
        return c.trim();
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
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css" precedence="default" crossOrigin="anonymous" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css" precedence="default" crossOrigin="anonymous" />
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
                    h1: ({ node, ...props }) => {
                        if (demoteH1) {
                            return <h2 {...props} />;
                        }

                        return <h1 {...props} />;
                    },
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
                    // External links open in new tab, internal links use Next.js routing
                    a: ({ node, ...props }) => {
                        const href = props.href || '';
                        const isExternal = href.startsWith('http') && !href.includes('fizikhub.com');
                        
                        if (!isExternal && href) {
                            return (
                                <Link href={href} prefetch={true} {...props} />
                            );
                        }
                        
                        return (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
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
                    // Image with Dialog zoom
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
                            <div className="flex flex-col items-center my-7 sm:my-10">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-zoom-in w-full flex justify-center">
                                            <Image
                                                src={src}
                                                alt={props.alt || "Makale görseli"}
                                                width={1200}
                                                height={675}
                                                unoptimized
                                                className="w-full h-auto rounded-xl shadow-lg border-4 border-black dark:border-zinc-800 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-[1.01] max-h-[600px] object-contain"
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
