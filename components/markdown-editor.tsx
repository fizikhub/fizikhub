"use client";

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
    return (
        <div className="space-y-2">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border-[3px] border-black p-0 h-10 rounded-[4px] bg-neutral-100 dark:bg-zinc-900 overflow-hidden mb-2 shadow-[2px_2px_0_0_#000]">
                    <TabsTrigger value="write" className="data-[state=active]:bg-[#FFBD2E] data-[state=active]:text-black data-[state=active]:font-black text-black dark:text-white font-bold h-full rounded-none">Yaz</TabsTrigger>
                    <TabsTrigger value="preview" className="data-[state=active]:bg-[#FFBD2E] data-[state=active]:text-black data-[state=active]:font-black text-black dark:text-white font-bold h-full border-l-[3px] border-black rounded-none">Önizle</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                    <Textarea
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="font-mono text-sm min-h-[200px] resize-y"
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

