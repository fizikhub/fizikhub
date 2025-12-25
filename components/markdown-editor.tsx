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
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Yaz</TabsTrigger>
                    <TabsTrigger value="preview">Önizle</TabsTrigger>
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
                    <p className="text-xs text-muted-foreground mt-1">
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

