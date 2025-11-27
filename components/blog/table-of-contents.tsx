"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse HTML content to extract headings
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const headings = doc.querySelectorAll('h2, h3');

        const items: TocItem[] = Array.from(headings).map((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            const text = heading.textContent || '';

            // Create ID if doesn't exist
            let id = heading.id;
            if (!id) {
                id = `heading-${index}`;
                heading.id = id;
            }

            return { id, text, level };
        });

        setTocItems(items);

        // Observer for active section
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' }
        );

        // Observe actual headings in the page
        setTimeout(() => {
            items.forEach(({ id }) => {
                const element = document.getElementById(id);
                if (element) observer.observe(element);
            });
        }, 100);

        return () => observer.disconnect();
    }, [content]);

    if (tocItems.length === 0) return null;

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto">
            <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    İçindekiler
                </h3>
                <ul className="space-y-2">
                    <AnimatePresence>
                        {tocItems.map((item) => (
                            <motion.li
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={cn(
                                    "transition-all duration-200",
                                    item.level === 3 && "pl-4"
                                )}
                            >
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className={cn(
                                        "text-left text-sm w-full py-1.5 px-2 rounded-md transition-all duration-200 hover:bg-primary/10",
                                        activeId === item.id
                                            ? "text-primary font-medium bg-primary/5 border-l-2 border-primary pl-3"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {item.text}
                                </button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </div>
        </nav>
    );
}
