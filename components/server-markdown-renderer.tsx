/**
 * ServerMarkdownRenderer — SEO-critical server component
 * 
 * This renders article markdown to static HTML on the server so that 
 * Googlebot can read the full article text WITHOUT executing JavaScript.
 * 
 * Unlike the client-side MarkdownRenderer (which has interactive features
 * like image zoom, lightbox, copy buttons), this is a pure server component
 * that outputs plain semantic HTML visible in the initial page source.
 * 
 * IMPORTANT: Do NOT add "use client" to this file.
 */

import { cn } from "@/lib/utils";

interface ServerMarkdownRendererProps {
    content: string;
    className?: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value: string): string {
    return escapeHtml(value).replace(/`/g, '&#96;');
}

function sanitizeUrlForAttribute(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) return "#";
    if (/^(?:javascript|vbscript|data:text\/html)/i.test(trimmed)) return "#";
    if (/^(?:https?:|mailto:|\/|#)/i.test(trimmed)) return escapeAttribute(trimmed);

    try {
        const parsed = new URL(trimmed, "https://www.fizikhub.com");
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return escapeAttribute(trimmed);
        }
    } catch {
        return "#";
    }

    return "#";
}

function isAllowedEmbedUrl(value: string | null): boolean {
    if (!value) return false;

    try {
        const url = new URL(value, "https://www.fizikhub.com");
        return [
            "www.youtube.com",
            "youtube.com",
            "www.youtube-nocookie.com",
            "youtube-nocookie.com",
            "phet.colorado.edu",
        ].includes(url.hostname);
    } catch {
        return false;
    }
}

function sanitizeRenderedHtml(html: string): string {
    return html
        .replace(/<\s*(script|style|object|embed|form|input|button|textarea|select|meta|link)\b[\s\S]*?<\/\s*\1\s*>/gi, "")
        .replace(/<\s*(script|style|object|embed|form|input|button|textarea|select|meta|link)\b[^>]*\/?>/gi, "")
        .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\s+(href|src)\s*=\s*(["'])(.*?)\2/gi, (_match, attr, quote, rawValue) => {
            return ` ${attr}=${quote}${sanitizeUrlForAttribute(rawValue)}${quote}`;
        })
        .replace(/<iframe\b([^>]*)><\/iframe>/gi, (_match, attrs) => {
            const src = attrs.match(/\ssrc=(["'])(.*?)\1/i)?.[2] || null;
            if (!isAllowedEmbedUrl(src)) return "";

            const title = attrs.match(/\stitle=(["'])(.*?)\1/i)?.[2] || "Gömülü fizik içeriği";

            return `<iframe src="${sanitizeUrlForAttribute(src)}" title="${escapeAttribute(title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-popups" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        });
}

/**
 * Preprocesses markdown content:
 * - Strips zero-width characters
 * - Converts Tiptap math spans to LaTeX notation
 * - Normalizes whitespace
 */
function preprocessContent(content: string): string {
    if (!content) return "";
    let c = content;

    // Normalize — remove zero-width spaces, normalize line endings
    c = c.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
    c = c.replace(/\r\n/g, '\n');

    // Convert <p> containing ONLY a math span → block math $$...$$
    c = c.replace(/<p>\s*<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>[^<]*<\/span>\s*<\/p>/gi, (_, latex) => `\n\n$$\n${latex.trim()}\n$$\n\n`);
    c = c.replace(/<p>\s*<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>[^<]*<\/span>\s*<\/p>/gi, (_, latex) => `\n\n$$\n${latex.trim()}\n$$\n\n`);

    // Remaining inline math spans
    c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*>[^<]*<\/span>/gi, (_, latex) => `$${latex.trim()}$`);
    c = c.replace(/<span[^>]*data-latex="([^"]*)"[^>]*data-type="math"[^>]*>[^<]*<\/span>/gi, (_, latex) => `$${latex.trim()}$`);

    // Self-closing math spans
    c = c.replace(/<span[^>]*data-type="math"[^>]*data-latex="([^"]*)"[^>]*\/>/gi, (_, latex) => `$${latex.trim()}$`);

    // Collapse multiple newlines
    c = c.replace(/\n{3,}/g, '\n\n');

    return c.trim();
}

/**
 * Simple markdown-to-HTML converter for server-side rendering.
 * Handles the most common markdown patterns without requiring
 * any client-side JavaScript or heavy dependencies.
 * 
 * This ensures Google can read the full text content from the HTML source.
 */
export function markdownToHtml(markdown: string): string {
    let html = markdown;

    // Escape HTML entities first (but preserve existing HTML tags from Tiptap)
    // We only escape & that are not part of HTML entities
    html = html.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g, '&amp;');

    // Block math $$...$$ → <div class="math-display">
    html = html.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, '<div class="math-display" aria-label="Mathematical formula">$1</div>');

    // Inline math $...$ → <span class="math-inline">
    html = html.replace(/\$([^$\n]+?)\$/g, '<span class="math-inline" aria-label="Math expression">$1</span>');

    // Headers (must be at start of line)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Bold + Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code
    html = html.replace(/`([^`]+?)`/g, '<code>$1</code>');

    // Code blocks ```lang\n...\n```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
        const langAttr = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langAttr}>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr />');
    html = html.replace(/^\*\*\*$/gm, '<hr />');

    // Images ![alt](src)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
        const safeAlt = escapeHtml(alt || 'Makale görseli');
        const safeSrc = sanitizeUrlForAttribute(src);
        return `<figure><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />${alt ? `<figcaption>${safeAlt}</figcaption>` : ''}</figure>`;
    });

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
        const isExternal = href.startsWith('http') && !href.includes('fizikhub.com');
        const safeHref = sanitizeUrlForAttribute(href);
        const safeText = escapeHtml(text);
        if (isExternal) {
            return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
        }
        return `<a href="${safeHref}">${safeText}</a>`;
    });

    // Unordered lists
    html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
        // Only wrap consecutive <li> groups
        return match;
    });

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, '<ul>$1</ul>');

    // YouTube embeds (common in Fizikhub articles)
    html = html.replace(/<iframe[^>]*src="(https:\/\/(?:www\.)?youtube\.com\/embed\/[^"]+)"[^>]*><\/iframe>/gi,
        '<div class="video-embed"><iframe src="$1" loading="lazy" allowfullscreen></iframe></div>'
    );

    // Paragraphs: wrap remaining text blocks
    // Split by double newlines and wrap non-block elements in <p>
    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        // Don't wrap if already a block element
        if (/^<(h[1-6]|ul|ol|li|blockquote|pre|div|figure|hr|table|iframe|p)/i.test(trimmed)) {
            return trimmed;
        }
        // Wrap in paragraph
        return `<p>${trimmed}</p>`;
    }).join('\n');

    // Clean up any double-wrapped paragraphs
    html = html.replace(/<p>\s*<p>/g, '<p>');
    html = html.replace(/<\/p>\s*<\/p>/g, '</p>');

    // Clean up single newlines within paragraphs → <br>
    html = html.replace(/<p>([\s\S]*?)<\/p>/g, (_match, content) => {
        return `<p>${content.replace(/\n/g, '<br />')}</p>`;
    });

    return sanitizeRenderedHtml(html);
}

export function ServerMarkdownRenderer({ content, className }: ServerMarkdownRendererProps) {
    const processed = preprocessContent(content);
    const html = markdownToHtml(processed);

    return (
        <>
            {/* KaTeX CSS for math rendering (loaded with precedence for deduplication) */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css" precedence="default" crossOrigin="anonymous" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css" precedence="default" crossOrigin="anonymous" />
            <div
                className={cn(
                    "prose prose-base sm:prose-lg dark:prose-invert max-w-none",
                    // Headings
                    "prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground",
                    "prose-h2:border-l-[6px] sm:prose-h2:border-l-[8px] prose-h2:border-[#FFC800] prose-h2:pl-4 sm:prose-h2:pl-5",
                    "prose-h3:border-l-[4px] sm:prose-h3:border-l-[6px] prose-h3:border-[#23A9FA] prose-h3:pl-3 sm:prose-h3:pl-4",
                    // Paragraphs
                    "prose-p:text-[15px] sm:prose-p:text-[17px] md:prose-p:text-[18px] prose-p:leading-[1.85] prose-p:font-[450]",
                    "prose-p:text-[#1a1a1a] dark:prose-p:text-[#e5e5e5]",
                    // Links
                    "prose-a:text-black dark:prose-a:text-white prose-a:font-black prose-a:no-underline prose-a:border-b-[3px] prose-a:border-[#23A9FA] dark:prose-a:border-[#FFC800]",
                    // Strong
                    "prose-strong:text-black dark:prose-strong:text-white prose-strong:font-black",
                    // Lists
                    "prose-li:text-[15px] sm:prose-li:text-[17px] prose-li:leading-[1.8] prose-li:marker:text-[#FFC800]",
                    // Blockquotes
                    "prose-blockquote:border-l-[5px] sm:prose-blockquote:border-l-[8px] prose-blockquote:border-black dark:prose-blockquote:border-[#FFC800] prose-blockquote:bg-[#FFC800]/10",
                    // Code
                    "prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#FF3366]",
                    "prose-pre:bg-zinc-950 prose-pre:border-4 prose-pre:border-black dark:prose-pre:border-zinc-700 prose-pre:rounded-xl",
                    // Images
                    "prose-img:rounded-xl prose-img:border-4 prose-img:border-black dark:prose-img:border-zinc-800 prose-img:mx-auto",
                    // HR
                    "prose-hr:border-t-[3px] prose-hr:border-dashed prose-hr:border-black/15 dark:prose-hr:border-white/10",
                    className
                )}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
}
