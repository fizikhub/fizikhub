"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import getCroppedImg from "@/lib/crop-image";

interface ImageCropperDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageSrc: string | null;
    aspectRatio: number; // 1 for avatar, 16/9 for cover etc.
    onCropComplete: (croppedImageBlob: Blob) => void;
}

export function ImageCropperDialog({ open, onOpenChange, imageSrc, aspectRatio, onCropComplete }: ImageCropperDialogProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden gap-0 fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
                style={{ transform: "translate(-50%, -50%)" }}
            >
                <DialogHeader className="p-4 border-b border-zinc-800 bg-zinc-950 z-10">
                    <DialogTitle>Medyayı Düzenle</DialogTitle>
                </DialogHeader>

                <div className="relative h-[400px] w-full bg-black">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteInternal}
                            onZoomChange={onZoomChange}
                        />
                    )}
                </div>

                <div className="p-4 bg-zinc-950 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-500">ZOOM</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="flex-1 accent-[#FFC800] h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <DialogFooter className="p-4 pt-0 bg-zinc-950">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        İptal
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-[#FFC800] text-black hover:bg-[#FFC800]/90">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Uygula
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
