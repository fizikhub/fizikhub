"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Type, Move, Image as ImageIcon, CheckCircle, XCircle, ZoomIn, ZoomOut, Plus, Sticker, HelpCircle, X } from "lucide-react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
    const [showHelp, setShowHelp] = useState(true); // Default show help on load

    // Metadata State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Genel");

    const canvasRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);
    const bgDragRef = useRef<HTMLDivElement>(null);
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

    // 3. Add Text Layer (Centered)
    const addTextLayer = () => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();

        const newLayer: TextLayer = {
            id: `text-${Date.now()}`,
            text: "METİN EKLE",
            x: rect.width / 2 - 60, // Approx center for "METİN EKLE"
            y: rect.height / 2 - 20,
            fontSize: 32,
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

    // 7. Publish (Optimized for Quality and Ratio)
    const handlePublish = async () => {
        if (!canvasRef.current || !image) return;
        if (!title.trim()) {
            toast.error("Lütfen hikayenize bir başlık ekleyin.");
            return;
        }

        try {
            setIsUploading(true);

            // 0. Check Auth First
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Hikaye paylaşmak için giriş yapmalısınız.");
                return;
            }

            setSelectedId(null); // Clear selection specific borders

            // Wait for render cycle to clear borders
            await new Promise(resolve => setTimeout(resolve, 300)); // Longer wait for render

            // Get exact dimensions for 9:16 ratio preservation
            const { offsetWidth, offsetHeight } = canvasRef.current;

            // Generate Canvas with forced dimensions and high scale
            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 3, // High Quality (approx 1080p+)
                backgroundColor: "#000000",
                width: offsetWidth,
                height: offsetHeight,
                scrollX: 0,
                scrollY: 0,
                logging: false,
            });

            // High quality JPEG
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            });

            if (!blob) throw new Error("Görsel oluşturulamadı.");

            const fileName = `story-${Date.now()}.jpg`;

            // 3. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('stories')
                .upload(fileName, blob, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Upload Error:", uploadError);
                throw new Error(`Yükleme hatası: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('stories')
                .getPublicUrl(fileName);

            // 4. Save Metadata to DB
            const { error: dbError } = await supabase
                .from('stories')
                .insert({
                    media_url: publicUrl,
                    author_id: user.id,
                    type: 'image',
                    title: title.trim(),
                    content: content.trim() || undefined, // Only send if set
                    category: category,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            if (dbError) {
                console.error("DB Error:", dbError);
                throw new Error(`Veritabanı hatası: ${dbError.message}`);
            }

            toast.success("Hikaye başarıyla paylaşıldı!");
            router.push("/");
            router.refresh();

        } catch (error: any) {
            console.error("Publish Error:", error);
            toast.error(error.message || "Hikaye paylaşılırken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    const activeTextLayer = textLayers.find(l => l.id === selectedId);
    const activeStickerLayer = stickerLayers.find(l => l.id === selectedId);

    return (
        <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#121212] text-white overflow-hidden font-outfit">

            {/* CANVAS AREA (CENTER) */}
            <div className="flex-1 relative flex items-center justify-center bg-[#1a1a1a] p-4 lg:p-8 overflow-hidden select-none">

                {/* TUTORIAL OVERLAY */}
                <AnimatePresence>
                    {showHelp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                            onClick={() => setShowHelp(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                        Hikaye Oluşturucu
                                    </h2>
                                    <Button variant="ghost" size="icon" onClick={() => setShowHelp(false)} className="hover:bg-white/5 rounded-full -mt-2 -mr-2">
                                        <X className="w-5 h-5 text-white/50" />
                                    </Button>
                                </div>

                                <div className="space-y-3 text-sm text-zinc-400">
                                    <p className="flex items-center gap-3">
                                        <Move className="w-4 h-4 text-[#23A9FA]" />
                                        <span>Öğeleri sürükleyerek taşıyın.</span>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Upload className="w-4 h-4 text-[#FFC800]" />
                                        <span>Kendi fotoğrafınızı yükleyin.</span>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <Type className="w-4 h-4 text-[#FF3366]" />
                                        <span>Yazı ve sticker ekleyip süsleyin.</span>
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <ZoomIn className="w-4 h-4 text-green-500" />
                                        <span>Arkaplana zoom yapabilirsiniz.</span>
                                    </p>
                                </div>

                                <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold" onClick={() => setShowHelp(false)}>
                                    Anladım, Başla! 🚀
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* DEVICE FRAME */}
                <div
                    ref={canvasRef}
                    className="relative w-full max-w-[400px] aspect-[9/16] bg-black shadow-2xl overflow-hidden ring-1 ring-white/10 touch-none"
                    onWheel={handleWheel}
                    onClick={() => setSelectedId(null)}
                >
                    {/* BACKGROUND IMAGE WITH PAN/ZOOM */}
                    {image ? (
                        <Draggable
                            nodeRef={bgDragRef}
                            position={position}
                            onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
                            scale={1} // We handle scale via transform manually
                        >
                            <div ref={bgDragRef} className="w-full h-full cursor-grab active:cursor-grabbing origin-center" style={{ transform: `scale(${scale})` }}>
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
                            className="w-full h-full flex flex-col items-center justify-center text-zinc-600 cursor-pointer hover:bg-zinc-900/50 transition-colors group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-[#23A9FA] group-hover:scale-110 transition-all mb-4">
                                <Upload className="w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:text-[#23A9FA] transition-all" />
                            </div>
                            <span className="font-bold text-sm text-zinc-500 group-hover:text-white transition-colors">Fotoğraf Seç</span>
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
                            <div className="w-6 h-6 bg-[#FFC800] rounded-full shadow-[0_0_15px_rgba(255,200,0,0.5)]" />
                            <span className="font-black text-xs tracking-widest uppercase drop-shadow-md">FizikHub</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS AREA (BOTTOM/SIDE) */}
            <div className="w-full lg:w-[400px] bg-[#121212] border-t lg:border-t-0 lg:border-l border-white/10 p-6 flex flex-col gap-6 z-20 shadow-2xl overflow-y-auto">

                {/* BRAND HEADER */}
                <div className="flex items-center justify-between lg:hidden mb-2">
                    <span className="font-black text-lg tracking-tight">KONTROL PANELİ</span>
                    <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
                        <HelpCircle className="w-5 h-5 text-zinc-500" />
                    </Button>
                </div>

                <div className="hidden lg:flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                    <div>
                        <h2 className="font-black text-xl tracking-tight">HİKAYE STÜDYOSU</h2>
                        <p className="text-xs text-zinc-500">Kendi bilimsel hikayeni tasarla.</p>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-full" onClick={() => setShowHelp(true)}>
                        <HelpCircle className="w-5 h-5 text-zinc-500" />
                    </Button>
                </div>

                {/* LAYER PROPERTIES - OR - METADATA */}

                <AnimatePresence mode="popLayout">
                    {/* EDITING A LAYER */}
                    {selectedId ? (
                        <div className="space-y-6">
                            {/* TEXT SETTINGS */}
                            {activeTextLayer && (
                                <motion.div
                                    key="text-settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-[#23A9FA] uppercase tracking-wider flex items-center gap-2">
                                            <Type className="w-3 h-3" /> Metin Düzenle
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={() => deleteLayer(activeTextLayer.id)} className="h-6 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">Sil</Button>
                                    </div>

                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                                        <Input
                                            value={activeTextLayer.text}
                                            onChange={(e) => updateTextLayer(activeTextLayer.id, { text: e.target.value })}
                                            className="bg-black border-zinc-800 focus:border-[#23A9FA] font-bold"
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

                                        <div className="space-y-2">
                                            <Label className="text-xs">Döndürme</Label>
                                            <Slider
                                                value={[activeTextLayer.rotation]}
                                                min={-180}
                                                max={180}
                                                step={5}
                                                onValueChange={(vals) => updateTextLayer(activeTextLayer.id, { rotation: vals[0] })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STICKER SETTINGS */}
                            {activeStickerLayer && (
                                <motion.div
                                    key="sticker-settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-[#FF3366] uppercase tracking-wider flex items-center gap-2">
                                            <Sticker className="w-3 h-3" /> Sticker Düzenle
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={() => deleteLayer(activeStickerLayer.id)} className="h-6 text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">Sil</Button>
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

                                        <div className="space-y-2">
                                            <Label className="text-xs">Döndürme</Label>
                                            <Slider
                                                value={[activeStickerLayer.rotation]}
                                                min={-180}
                                                max={180}
                                                step={5}
                                                onValueChange={(vals) => updateStickerLayer(activeStickerLayer.id, { rotation: vals[0] })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Button variant="ghost" onClick={() => setSelectedId(null)} className="w-full mt-2">
                                Düzenlemeyi Bitir
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* CATEGORY & TITLE */}
                            <div className="space-y-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400 font-bold uppercase">Kategori</Label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFC800] transition-colors"
                                    >
                                        <option value="Genel">Genel</option>
                                        <option value="Kuantum">Kuantum</option>
                                        <option value="Astrofizik">Astrofizik</option>
                                        <option value="Mars">Mars</option>
                                        <option value="Biyoloji">Biyoloji</option>
                                        <option value="Kimya">Kimya</option>
                                        <option value="Fizik">Fizik</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400 font-bold uppercase">Hikaye Başlığı</Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        maxLength={20}
                                        placeholder="Kısa ve etkileyici bir başlık..."
                                        className="bg-black/50 border-white/10 focus:border-[#FFC800] transition-colors"
                                    />
                                    <p className="text-[10px] text-zinc-600 text-right">{title.length}/20</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400 font-bold uppercase">Açıklama / İçerik</Label>
                                    <Input
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        maxLength={120}
                                        placeholder="Görüntüleyenler için açıklama..."
                                        className="bg-black/50 border-white/10 focus:border-[#FFC800] transition-colors"
                                    />
                                    <p className="text-[10px] text-zinc-600 text-right">{content.length}/120</p>
                                </div>
                            </div>

                            {/* BG SETTINGS */}
                            {image && (
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400 font-bold uppercase">Görsel Ayarları</Label>
                                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 space-y-4">
                                        <div className="flex justify-between">
                                            <Label className="text-xs">Zoom</Label>
                                            <span className="text-xs text-zinc-500">{scale.toFixed(1)}x</span>
                                        </div>
                                        <Slider
                                            value={[scale]}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            onValueChange={(vals) => setScale(vals[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ADD NEW */}
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" className="h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#FFC800] hover:scale-105 transition-all text-xs" onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon className="w-5 h-5 mb-1" />
                                    {image ? "Değiştir" : "Fotoğraf"}
                                </Button>
                                <Button variant="outline" className="h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#23A9FA] hover:scale-105 transition-all text-xs" onClick={addTextLayer}>
                                    <Type className="w-5 h-5 mb-1" />
                                    Metin
                                </Button>
                                <Button variant="outline" className="h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 hover:text-[#FF3366] hover:scale-105 transition-all text-xs" onClick={() => stickerInputRef.current?.click()}>
                                    <Sticker className="w-5 h-5 mb-1" />
                                    Sticker
                                </Button>
                            </div>

                            <Button
                                onClick={handlePublish}
                                disabled={!image || isUploading || !title.trim()}
                                className="w-full bg-[#FFC800] text-black hover:bg-[#FFD700] font-black uppercase tracking-wide py-6 text-sm shadow-xl shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                                {isUploading ? "Paylaşılıyor..." : "HİKAYEYİ PAYLAŞ"}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <input type="file" ref={stickerInputRef} className="hidden" accept="image/*" onChange={handleStickerUpload} />

            </div>
        </div>
    );
}
