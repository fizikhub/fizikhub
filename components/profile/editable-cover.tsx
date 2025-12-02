"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2, ImagePlus } from "lucide-react";
import { uploadCover } from "@/app/profil/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Lütfen bir resim dosyası seçin");
            return;
        }

        // Validate file size (4MB max)
        if (file.size > 4 * 1024 * 1024) {
            toast.error("Dosya boyutu 4MB'den küçük olmalı");
            return;
        }

        setIsUploading(true);

        try {
            // Resize and compress image
            const resizedFile = await resizeImage(file, 1500, 500, 0.85);

            // Upload to Supabase
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

    return (
        <div className="h-48 w-full relative overflow-hidden group">
            {url ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${url})` }}
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
            )}
            <div className="absolute inset-0 bg-black/10" />

            {editable && (
                <>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-4 right-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
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
