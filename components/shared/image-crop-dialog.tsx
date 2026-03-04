"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Crop, ZoomIn, ZoomOut, Check, X, Image as ImageIcon } from "lucide-react";
import getCroppedImg from "@/lib/crop-image";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageCropDialogProps {
    imageSrc: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCropComplete: (file: File) => void;
    aspectRatio?: number | null; // null for free cropping
    title?: string;
    showAspectControls?: boolean;
}

export function ImageCropDialog({
    imageSrc,
    open,
    onOpenChange,
    onCropComplete,
    aspectRatio = 16 / 9,
    title = "Görseli Kırp",
    showAspectControls = false,
}: ImageCropDialogProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspectRatio === null ? undefined : aspectRatio);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);

            if (croppedBlob) {
                // Konvert Blob to File object
                const file = new File([croppedBlob], `cropped-${Date.now()}.webp`, { type: "image/webp" });
                onCropComplete(file);
                onOpenChange(false);
            } else {
                toast.error("Görsel kırpılırken bir hata oluştu.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Kırpma işlemi başarısız.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !isProcessing && onOpenChange(val)}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background border-2 border-border shadow-2xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Crop className="w-5 h-5 text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        Görselin görünmesini istediğiniz kısmını seçin. Kapak görselleri için 16:9 oranı zorunludur.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-[400px] bg-black/5 flex-shrink-0">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={currentAspect}
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                        objectFit="contain"
                        showGrid={true}
                    />
                </div>

                <div className="p-6 space-y-6 bg-muted/10">
                    {showAspectControls && (
                        <div className="flex gap-2 mb-4 justify-center bg-background p-1.5 rounded-md w-max mx-auto border shadow-sm">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={currentAspect === 16 / 9 ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentAspect(16 / 9)}
                                            className="px-3"
                                        >
                                            16:9
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Google SEO için en ideal ölçü</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={currentAspect === 4 / 3 ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentAspect(4 / 3)}
                                            className="px-3"
                                        >
                                            4:3
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Klasik fotoğraf ölçüsü</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={currentAspect === 1 ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentAspect(1)}
                                            className="px-3"
                                        >
                                            1:1
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Kare ölçü</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant={currentAspect === undefined ? "secondary" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentAspect(undefined)}
                                            className="px-3"
                                        >
                                            Serbest
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Serbest oranlı kesim</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-4 h-4 text-muted-foreground" />
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(val) => setZoom(val[0])}
                            className="flex-1"
                            disabled={isProcessing}
                        />
                        <ZoomIn className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isProcessing}
                        >
                            <X className="w-4 h-4 mr-2" />
                            İptal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="min-w-[120px]"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 mr-2 stroke-[3]" />
                                    Kırpmayı Uygula
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
