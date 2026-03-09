"use client";

import { useRef } from "react";
import { Bold, Italic, Code, Sigma, Quote } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
const MarkdownRenderer = dynamic(() => import("./markdown-renderer").then(mod => mod.MarkdownRenderer), {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/50 rounded-md" />
});
import { Label } from "@/components/ui/label";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    id?: string;
    minHeight?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, label, id, minHeight = "200px" }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormat = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border-[3px] border-black p-0 h-10 rounded-[4px] bg-neutral-100 dark:bg-zinc-900 overflow-hidden mb-2 shadow-[2px_2px_0_0_#000]">
                    <TabsTrigger value="write" className="data-[state=active]:bg-[#FFBD2E] data-[state=active]:text-black data-[state=active]:font-black text-black dark:text-white font-bold h-full rounded-none">Yaz</TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-[#FFBD2E] data-[state=active]:text-black data-[state=active]:font-black text-black dark:text-white font-bold h-full border-l-[3px] border-black rounded-none">Önizle</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="flex flex-col gap-2">
                    {/* Mobile Formatting Toolbar (Neo-Brutalist) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full px-1">
                        <button type="button" onClick={() => insertFormat("**", "**")} className="shrink-0 p-2 border-[2px] border-black rounded-[4px] bg-white text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertFormat("*", "*")} className="shrink-0 p-2 border-[2px] border-black rounded-[4px] bg-white text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertFormat("`", "`")} className="shrink-0 p-2 border-[2px] border-black rounded-[4px] bg-neutral-200 text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Code className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertFormat("$$", "$$")} className="shrink-0 p-2 border-[2px] border-black rounded-[4px] bg-[#FFBD2E] text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" title="LaTeX formülü">
                            <Sigma className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertFormat("> ", "")} className="shrink-0 p-2 border-[2px] border-black rounded-[4px] bg-neo-blue text-black shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Quote className="w-4 h-4" />
                        </button>
                    </div>

                    <Textarea
                        ref={textareaRef}
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono text-sm min-h-[200px] resize-y border-[2px] border-black shadow-[2px_2px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0_0_#000] transition-shadow rounded-[4px]"
                        style={{ minHeight }}
                    />
                    <p className="hidden sm:block text-xs text-muted-foreground mt-1">
                        Markdown ve LaTeX desteklenir. Örn: **kalın**, *italik*, $E=mc^2$
                    </p>
                </TabsContent>
                <TabsContent value="preview">
                    <div
                        className="border rounded-md p-4 bg-card overflow-y-auto"
                        style={{ minHeight }}
                    >
                        {value ? (
                            <MarkdownRenderer content={value} />
                        ) : (
                            <p className="text-muted-foreground text-sm italic">Önizleme burada görünecek...</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

