"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { uploadCover } from "@/app/profil/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface EditableCoverProps {
    url?: string | null;
    gradient: string;
    editable?: boolean;
}

export function EditableCover({ url, gradient, editable = false }: EditableCoverProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen bir resim dosyası seçin");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Dosya boyutu 4MB'den küçük olmalı");
            return;
        }

        setIsUploading(true);

        try {
            const resizedFile = await resizeImage(file, 1500, 500, 0.85);
            const result = await uploadCover(resizedFile);

            if (result.success) {
                toast.success("Kapak fotoğrafı güncellendi!");
                router.refresh();
            } else {
                toast.error(result.error || "Yükleme başarısız");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Bir hata oluştu");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClick = () => {
        if (!editable) return;
        fileInputRef.current?.click();
    };

    const isPinkTheme = mounted && theme === 'pink';

    return (
        <div className={cn(
            "h-48 w-full relative overflow-hidden group border-b-2",
            isPinkTheme ? "border-primary" : "border-black dark:border-white"
        )}>
            {/* Technical Grid Background */}
            <div className={cn(
                "absolute inset-0 bg-[size:24px_24px] pointer-events-none",
                isPinkTheme
                    ? "bg-[linear-gradient(to_right,rgba(236,72,153,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,72,153,0.1)_1px,transparent_1px)]"
                    : "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
            )} />

            {url ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105 opacity-80"
                    style={{ backgroundImage: `url(${url})` }}
                />
            ) : (
                <div className={cn(
                    "absolute inset-0",
                    isPinkTheme ? "bg-primary/5" : "bg-muted/20",
                    !isPinkTheme && gradient // Use random gradient if not pink theme
                )} />
            )}

            {/* Industrial Overlay Elements */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Top Secret Stamp */}
            <div className="absolute top-4 right-4 border-2 border-primary/30 px-3 py-1 -rotate-6 pointer-events-none select-none">
                <span className="text-xs font-black text-primary/50 tracking-[0.2em]">TOP SECRET</span>
            </div>

            {/* Data Lines */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20" />
            <div className="absolute bottom-2 left-4 flex gap-1 pointer-events-none">
                <div className="w-2 h-2 bg-primary/40" />
                <div className="w-2 h-2 bg-primary/40" />
                <div className="w-2 h-2 bg-primary/40" />
            </div>

            {editable && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-4 right-4 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-20"
                        onClick={handleClick}
                        disabled={isUploading}
                        title="Kapak fotoğrafını değiştir"
                    >
                        {isUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Pencil className="h-4 w-4" />
                        )}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </>
            )}
        </div>
    );
}

// Helper function to resize and compress image
async function resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number
): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Failed to get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to create blob"));
                            return;
                        }
                        const resizedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    "image/jpeg",
                    quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}
