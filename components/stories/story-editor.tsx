"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Type, Move, Image as ImageIcon, CheckCircle, XCircle, ZoomIn, ZoomOut, Plus, Sticker } from "lucide-react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
interface TextLayer {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    bg?: string;
    rotation: number;
    nodeRef?: React.RefObject<HTMLDivElement>;
}

interface StickerLayer {
    id: string;
    src: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    nodeRef?: React.RefObject<HTMLDivElement>;
}

export function StoryEditor() {
    const [image, setImage] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
    const [stickerLayers, setStickerLayers] = useState<StickerLayer[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null); // Layer ID
    const [isUploading, setIsUploading] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const stickerInputRef = useRef<HTMLInputElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const router = useRouter();

    // 1. Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                setScale(1);
                setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Add/Upload Sticker
    const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSticker: StickerLayer = {
                    id: `sticker-${Date.now()}`,
                    src: e.target?.result as string,
                    x: 100,
                    y: 300,
                    scale: 1,
                    rotation: 0,
                    nodeRef: React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
                };
                setStickerLayers([...stickerLayers, newSticker]);
                setSelectedId(newSticker.id);
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. Add Text Layer
    const addTextLayer = () => {
        const newLayer: TextLayer = {
            id: `text-${Date.now()}`,
            text: "Metin",
            x: 100,
            y: 300,
            fontSize: 28,
            color: "#ffffff",
            rotation: 0,
            nodeRef: React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>
        };
        setTextLayers([...textLayers, newLayer]);
        setSelectedId(newLayer.id);
    };

    // 4. Update Layers
    const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
        setTextLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const updateStickerLayer = (id: string, updates: Partial<StickerLayer>) => {
        setStickerLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    // 5. Delete Layer
    const deleteLayer = (id: string) => {
        if (id.startsWith('text-')) {
            setTextLayers(layers => layers.filter(l => l.id !== id));
        } else {
            setStickerLayers(layers => layers.filter(l => l.id !== id));
        }
        if (selectedId === id) setSelectedId(null);
    };

    // 6. Background Manipulation
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const newScale = Math.min(Math.max(scale - e.deltaY * 0.01, 1), 5);
            setScale(newScale);
        }
    };

    // 7. Publish
    const handlePublish = async () => {
        if (!canvasRef.current || !image) return;
        setIsUploading(true);

        try {
            setSelectedId(null); // Clear selection specific borders

            // Wait for render cycle
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 3, // High Quality
                backgroundColor: "#000000",
                logging: false,
            });

            const blob = await new Promise<Blob>((resolve) => canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.95));
            const fileName = `story-${Date.now()}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from('stories')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('stories')
                .getPublicUrl(fileName);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Oturum açılmamış");

            const { error: dbError } = await supabase
                .from('stories')
                .insert({
                    media_url: publicUrl,
                    author_id: user.id,
                    type: 'image',
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            if (dbError) throw dbError;

            toast.success("Hikaye başarıyla paylaşıldı!");
            router.push("/");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Hikaye paylaşılırken hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    const activeTextLayer = textLayers.find(l => l.id === selectedId);
    const activeStickerLayer = stickerLayers.find(l => l.id === selectedId);

    return (
        <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#121212] text-white overflow-hidden">

            {/* CANVAS AREA (CENTER) */}
            <div className="flex-1 relative flex items-center justify-center bg-[#1a1a1a] p-4 lg:p-8 overflow-hidden select-none">

                {/* DEVICE FRAME */}
                <div
                    ref={canvasRef}
                    className="relative w-full max-w-[400px] aspect-[9/16] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10"
                    onWheel={handleWheel}
                    onClick={() => setSelectedId(null)}
                >
                    {/* BACKGROUND IMAGE WITH PAN/ZOOM */}
                    {image ? (
                        <Draggable
                            position={position}
                            onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
                            scale={1} // We handle scale via transform manually
                        >
                            <div className="w-full h-full cursor-grab active:cursor-grabbing origin-center" style={{ transform: `scale(${scale})` }}>
                                <img
                                    ref={bgImageRef}
                                    src={image}
                                    className="w-full h-full object-cover pointer-events-none"
                                    alt="Background"
                                />
                            </div>
                        </Draggable>
                    ) : (
                        <div
                            className="w-full h-full flex flex-col items-center justify-center text-zinc-600 cursor-pointer hover:bg-zinc-900/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-12 h-12 mb-4 opacity-50" />
                            <span className="font-bold text-sm">Fotoğraf Seç</span>
                            <span className="text-xs opacity-50 mt-1">Sürükle veya Tıkla</span>
                        </div>
                    )}

                    {/* TEXT LAYERS */}
                    {textLayers.map(layer => (
                        <Draggable
                            key={layer.id}
                            nodeRef={layer.nodeRef}
                            position={{ x: layer.x, y: layer.y }}
                            onStop={(e, data) => updateTextLayer(layer.id, { x: data.x, y: data.y })}
                            onStart={() => setSelectedId(layer.id)}
                            bounds="parent"
                        >
                            <div
                                ref={layer.nodeRef}
                                className={`absolute cursor-move px-4 py-2 rounded-lg border-2 transition-all ${selectedId === layer.id ? 'border-[#FFC800] bg-black/30 backdrop-blur-sm' : 'border-transparent'}`}
                                style={{
                                    color: layer.color,
                                    fontSize: `${layer.fontSize}px`,
                                    fontFamily: 'var(--font-outfit)',
                                    fontWeight: 900,
                                    transform: `rotate(${layer.rotation}deg)`,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}
                            >
                                {layer.text}
                            </div>
                        </Draggable>
                    ))}

                    {/* STICKER LAYERS */}
                    {stickerLayers.map(layer => (
                        <Draggable
                            key={layer.id}
                            nodeRef={layer.nodeRef}
                            position={{ x: layer.x, y: layer.y }}
                            onStop={(e, data) => updateStickerLayer(layer.id, { x: data.x, y: data.y })}
                            onStart={() => setSelectedId(layer.id)}
                            bounds="parent"
                        >
                            <div
                                ref={layer.nodeRef}
                                className={`absolute cursor-move transition-all border-2 ${selectedId === layer.id ? 'border-[#FFC800]' : 'border-transparent'}`}
                                style={{
                                    width: `${100 * layer.scale}px`,
                                    transform: `rotate(${layer.rotation}deg)`
                                }}
                            >
                                <img src={layer.src} alt="Sticker" className="w-full h-auto pointer-events-none" />
                            </div>
                        </Draggable>
                    ))}

                    {/* LOGO OVERLAY (Optional) */}
                    <div className="absolute top-6 left-6 pointer-events-none opacity-80">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#FFC800] rounded-full" />
                            <span className="font-black text-xs tracking-widest uppercase drop-shadow-md">FizikHub</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS AREA (BOTTOM/SIDE) */}
            <div className="w-full lg:w-[400px] bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col gap-6 z-20 shadow-2xl">

                {/* TOOLBAR */}
                <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#FFC800]" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Arkaplan</span>
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                    <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#23A9FA]" onClick={addTextLayer}>
                        <Type className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Metin</span>
                    </Button>

                    <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#FF3366]" onClick={() => stickerInputRef.current?.click()}>
                        <Sticker className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Sticker</span>
                    </Button>
                    <input type="file" ref={stickerInputRef} className="hidden" accept="image/*" onChange={handleStickerUpload} />

                    <Button variant="outline" className="h-20 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-green-500" onClick={handlePublish} disabled={!image || isUploading}>
                        {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                        <span className="text-[10px] font-bold">Paylaş</span>
                    </Button>
                </div>

                {/* LAYER PROPERTIES */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">

                    {/* BACKGROUND SETTINGS */}
                    {image && !selectedId && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <h3 className="font-bold text-sm text-zinc-500 uppercase tracking-wider">Arkaplan Ayarları</h3>
                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="text-xs">Zoom Seviyesi</Label>
                                        <span className="text-xs text-zinc-500">{scale.toFixed(1)}x</span>
                                    </div>
                                    <Slider
                                        value={[scale]}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onValueChange={(vals) => setScale(vals[0])}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                    * Fotoğrafı sürükleyerek konumlandırabilirsiniz.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TEXT SETTINGS */}
                    {activeTextLayer && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-sm text-[#23A9FA] uppercase tracking-wider">Metin Düzenle</h3>
                                <Button variant="ghost" size="sm" onClick={() => deleteLayer(activeTextLayer.id)} className="h-6 text-red-500 hover:text-red-400 hover:bg-red-500/10">Sil</Button>
                            </div>

                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                                <Input
                                    value={activeTextLayer.text}
                                    onChange={(e) => updateTextLayer(activeTextLayer.id, { text: e.target.value })}
                                    className="bg-black border-zinc-800 focus:border-[#23A9FA]"
                                />

                                <div className="space-y-2">
                                    <Label className="text-xs">Boyut</Label>
                                    <Slider
                                        value={[activeTextLayer.fontSize]}
                                        min={12}
                                        max={120}
                                        step={1}
                                        onValueChange={(vals) => updateTextLayer(activeTextLayer.id, { fontSize: vals[0] })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Renk</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['#ffffff', '#000000', '#FFC800', '#23A9FA', '#FF3366', '#4CAF50', '#9333EA'].map(color => (
                                            <button
                                                key={color}
                                                className={`w-8 h-8 rounded-full border-2 transition-transform ${activeTextLayer.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => updateTextLayer(activeTextLayer.id, { color })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STICKER SETTINGS */}
                    {activeStickerLayer && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-sm text-[#FF3366] uppercase tracking-wider">Sticker Düzenle</h3>
                                <Button variant="ghost" size="sm" onClick={() => deleteLayer(activeStickerLayer.id)} className="h-6 text-red-500 hover:text-red-400 hover:bg-red-500/10">Sil</Button>
                            </div>

                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Boyut</Label>
                                    <Slider
                                        value={[activeStickerLayer.scale]}
                                        min={0.2}
                                        max={3}
                                        step={0.1}
                                        onValueChange={(vals) => updateStickerLayer(activeStickerLayer.id, { scale: vals[0] })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
