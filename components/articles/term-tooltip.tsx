"use client";

import React from "react";
import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CURATED_DICTIONARY_TERMS } from "@/lib/dictionary-defaults";
import { slugify } from "@/lib/slug";

interface TermTooltipProps {
    term: string;
    slug: string;
    definition: string;
    category?: string;
    children: React.ReactNode;
}

export function TermTooltip({ term, slug, definition, category = "Fizik Terimi", children }: TermTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline cursor-help border-b-2 border-dashed border-[#FFC800] hover:text-[#FFC800] transition-colors font-bold">
                    {children}
                </span>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                sideOffset={6}
                className="z-50 max-w-[280px] sm:max-w-xs p-4 border-[3px] border-black bg-[#FFBD2E] text-black shadow-[4px_4px_0_0_#000] rounded-[4px] font-sans transition-all duration-150 animate-in fade-in-0 zoom-in-95"
            >
                <div className="flex flex-col gap-1 text-left select-none">
                    <div className="flex items-center justify-between border-b-2 border-black/10 pb-1.5 mb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-black/60">
                            {category}
                        </span>
                        <Link
                            href={`/sozluk/${slug}`}
                            className="text-[10px] font-black uppercase tracking-wider text-black hover:underline cursor-pointer flex items-center"
                        >
                            Sözlükte Gör →
                        </Link>
                    </div>
                    <h4 className="text-sm font-black text-black leading-none uppercase tracking-wide mb-1">
                        {term}
                    </h4>
                    <p className="text-xs font-semibold leading-relaxed text-black/80 line-clamp-3">
                        {definition}
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}

// Build dictionary map and sorted term list once to optimize performance
const sortedTerms = [...CURATED_DICTIONARY_TERMS]
    .sort((a, b) => b.term.length - a.term.length); // Sort longest first

export function highlightDictionaryTerms(text: string): React.ReactNode {
    if (!text || text.length < 3) return text;

    // Track which terms have been highlighted in the current paragraph/block
    // to avoid over-highlighting (max once per term per paragraph)
    const highlightedInBlock = new Set<string>();

    function processText(str: string): React.ReactNode[] {
        if (!str) return [];

        // Find the earliest match among all sorted terms
        let earliestMatch: {
            index: number;
            length: number;
            term: typeof CURATED_DICTIONARY_TERMS[number];
        } | null = null;

        for (const item of sortedTerms) {
            const termName = item.term;
            if (highlightedInBlock.has(termName.toLowerCase())) continue;

            // Construct Turkish-friendly word boundary regex (case-insensitive)
            const regex = new RegExp(`(?<=^|[^a-zA-Z0-9ğüşöçıİIı])(${termName})(?=$|[^a-zA-Z0-9ğüşöçıİIı])`, "gi");
            const match = regex.exec(str);

            if (match) {
                if (!earliestMatch || match.index < earliestMatch.index) {
                    earliestMatch = {
                        index: match.index,
                        length: match[0].length,
                        term: item
                    };
                }
            }
        }

        if (!earliestMatch) {
            return [str];
        }

        const { index, length, term } = earliestMatch;
        const matchedText = str.substring(index, index + length);
        const leftPart = str.substring(0, index);
        const rightPart = str.substring(index + length);

        // Mark as highlighted to prevent duplicate highlights of the same term in this block
        highlightedInBlock.add(term.term.toLowerCase());

        return [
            ...processText(leftPart),
            <TermTooltip
                key={`${term.term}-${index}`}
                term={term.term}
                slug={slugify(term.term)}
                definition={term.definition}
                category={term.category || "Fizik Terimi"}
            >
                {matchedText}
            </TermTooltip>,
            ...processText(rightPart)
        ];
    }

    const result = processText(text);
    if (result.length === 1 && typeof result[0] === "string") {
        return result[0];
    }
    
    return <>{result}</>;
}
