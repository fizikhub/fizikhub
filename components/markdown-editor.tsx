"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useRef } from "react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    id?: string;
    minHeight?: string;
}

export function MarkdownEditor({ value, onChange, placeholder, label, id, minHeight = "200px" }: MarkdownEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    // Fix: Initialize supabase client once
    const [supabase] = useState(() => createClient());

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Lütfen bir resim dosyası seçin.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Resim boyutu 5MB'dan küçük olmalıdır.");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            const imageMarkdown = `![${file.name}](${publicUrl})`;
            onChange(value + (value ? '\n' : '') + imageMarkdown);
            toast.success("Resim yüklendi!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Resim yüklenirken hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="write">Yaz</TabsTrigger>
                    <TabsTrigger value="preview">Önizle</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                    <div className="relative">
                        <Textarea
                            id={id}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="font-mono text-sm min-h-[200px] resize-y"
                            style={{ minHeight }}
                        />
                        <div className="absolute bottom-2 right-2 flex gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-8 px-2 text-xs gap-1.5"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <ImageIcon className="h-3.5 w-3.5" />
                                )}
                                Resim Ekle
                            </Button>
                        </div>
                    </div>
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
