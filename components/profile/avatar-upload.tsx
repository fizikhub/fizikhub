"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X } from "lucide-react";
import { uploadAvatar } from "@/app/profil/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
    currentAvatarUrl?: string | null;
    userInitial: string;
    className?: string;
}

export function AvatarUpload({ currentAvatarUrl, userInitial, className }: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Dosya boyutu 2MB'den küçük olmalı veritabanının depolamasını doldurma eşek");
            return;
        }

        setIsUploading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Resize and compress image
            const resizedFile = await resizeImage(file, 500, 500, 0.8);

            // Upload to Supabase
            const result = await uploadAvatar(resizedFile);

            if (result.success) {
                toast.success("Profil fotoğrafı güncellendi!");
                router.refresh();
                setPreviewUrl(null);
            } else {
                toast.error(result.error || "Yükleme başarısız");
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Bir hata oluştu");
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={cn("relative group", className)}>
            <Avatar className="h-full w-full aspect-square rounded-full border-4 border-background shadow-sm transition-transform group-hover:scale-105 duration-300 bg-background overflow-hidden">
                <AvatarImage
                    src={previewUrl || currentAvatarUrl || ""}
                    className="object-cover h-full w-full"
                />
                <AvatarFallback className="text-3xl sm:text-4xl bg-primary/5 flex items-center justify-center">
                    {userInitial}
                </AvatarFallback>
            </Avatar>

            {/* Upload Button Overlay */}
            <button
                onClick={handleClick}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                    <Camera className="h-8 w-8 text-white" />
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
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

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
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
