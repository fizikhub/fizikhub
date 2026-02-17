import { useState, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Upload, Type, Move, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
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
}

export function StoryEditor() {
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const router = useRouter();

    // 1. Image Upload Handler
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 2. Add Text Layer
    const addTextLayer = () => {
        const newLayer: TextLayer = {
            id: Math.random().toString(36).substr(2, 9),
            text: "Metin Yaz",
            x: 50,
            y: 300,
            fontSize: 24,
            color: "#ffffff",
            rotation: 0,
        };
        setTextLayers([...textLayers, newLayer]);
        setSelectedLayerId(newLayer.id);
    };

    // 3. Update Text Layer
    const updateLayer = (id: string, updates: Partial<TextLayer>) => {
        setTextLayers(layers => layers.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    // 4. Delete Layer
    const deleteLayer = (id: string) => {
        setTextLayers(layers => layers.filter(l => l.id !== id));
        if (selectedLayerId === id) setSelectedLayerId(null);
    };

    // 5. Publish Story
    const handlePublish = async () => {
        if (!canvasRef.current) return;
        setIsUploading(true);

        try {
            // A. Generate Flattened Image
            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                scale: 2, // Retína quality
                backgroundColor: null,
            });

            const blob = await new Promise<Blob>((resolve) => canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.9));
            const fileName = `story-${Date.now()}.jpg`;

            // B. Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('stories')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            // C. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('stories')
                .getPublicUrl(fileName);

            // D. Get User ID
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı");

            // E. Save to Database
            const { error: dbError } = await supabase
                .from('stories')
                .insert({
                    media_url: publicUrl,
                    author_id: user.id,
                    type: 'image',
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                });

            if (dbError) throw dbError;

            toast.success("Hikaye paylaşıldı!");
            router.push("/"); // Redirect to home
            router.refresh();

        } catch (error) {
            console.error("Story upload error:", error);
            toast.error("Hikaye paylaşılırken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    const selectedLayer = textLayers.find(l => l.id === selectedLayerId);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 p-4 bg-zinc-950 text-white">

            {/* LEFT: EDITOR CONTROLS */}
            <div className="w-full lg:w-96 flex flex-col gap-6 order-2 lg:order-1 bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
                <div>
                    <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                        <EditIcon className="w-5 h-5 text-[#FFC800]" />
                        Hikaye Editörü
                    </h2>

                    {!image ? (
                        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-[#FFC800] transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                            <p className="text-sm font-bold text-zinc-400">Arkaplan Seç</p>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white" onClick={() => setImage(null)}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Fotoğrafı Değiştir
                            </Button>
                        </div>
                    )}
                </div>

                {/* TEXT CONTROLS */}
                <div className="flex-1 overflow-y-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-zinc-400 font-bold uppercase text-xs">Katmanlar</Label>
                        <Button size="sm" onClick={addTextLayer} className="bg-[#23A9FA] hover:bg-[#1b8ecc] text-white font-bold">
                            <Type className="w-4 h-4 mr-2" />
                            Metin Ekle
                        </Button>
                    </div>

                    {selectedLayer && (
                        <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="space-y-2">
                                <Label className="text-xs">Metin İçeriği</Label>
                                <Input
                                    value={selectedLayer.text}
                                    onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                                    className="bg-zinc-900 border-zinc-700 focus:border-[#FFC800]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Boyut ({selectedLayer.fontSize}px)</Label>
                                <Slider
                                    value={[selectedLayer.fontSize]}
                                    min={12}
                                    max={100}
                                    step={1}
                                    onValueChange={(vals) => updateLayer(selectedLayer.id, { fontSize: vals[0] })}
                                    className="py-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Renk</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ffffff', '#000000', '#FFC800', '#23A9FA', '#FF3366', '#4CAF50'].map(color => (
                                        <button
                                            key={color}
                                            className={`w-6 h-6 rounded-full border-2 ${selectedLayer.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => updateLayer(selectedLayer.id, { color })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button variant="destructive" size="sm" onClick={() => deleteLayer(selectedLayer.id)} className="w-full mt-2">
                                Katmanı Sil
                            </Button>
                        </div>
                    )}
                </div>

                <Button
                    size="lg"
                    className="w-full bg-[#FFC800] hover:bg-[#e6b400] text-black font-black text-lg py-6 shadow-[4px_4px_0px_0px_#fff]"
                    onClick={handlePublish}
                    disabled={isUploading || !image}
                >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                    Hikayeyi Paylaş
                </Button>
            </div>

            {/* RIGHT: CANVAS PREVIEW */}
            <div className="flex-1 flex items-center justify-center bg-zinc-900/20 rounded-3xl border border-white/5 order-1 lg:order-2 p-4 lg:p-8 overflow-hidden">
                <div
                    ref={canvasRef}
                    className="relative w-[360px] h-[640px] bg-black shadow-2xl overflow-hidden"
                    style={{ aspectRatio: '9/16' }}
                    onClick={() => setSelectedLayerId(null)}
                >
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Story Background" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <ImageIcon className="w-16 h-16 opacity-20" />
                        </div>
                    )}

                    {/* OVERLAY DARK GRADIENT (Optional for readability) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

                    {textLayers.map(layer => (
                        <Draggable
                            key={layer.id}
                            position={{ x: layer.x, y: layer.y }}
                            onStop={(e, data) => updateLayer(layer.id, { x: data.x, y: data.y })}
                            onStart={() => setSelectedLayerId(layer.id)}
                            bounds="parent"
                        >
                            <div
                                className={`absolute cursor-move px-2 py-1 rounded border-2 border-transparent ${selectedLayerId === layer.id ? 'border-[#FFC800]/50 bg-black/20' : ''}`}
                                style={{
                                    color: layer.color,
                                    fontSize: `${layer.fontSize}px`,
                                    fontFamily: 'var(--font-outfit)',
                                    fontWeight: 900,
                                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                                }}
                            >
                                {layer.text}
                            </div>
                        </Draggable>
                    ))}

                    {/* BRANDING */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none">
                        <div className="w-8 h-8 bg-[#FFC800] rounded-full" />
                        <span className="text-white font-black text-sm tracking-widest uppercase dropped-shadow-md">FizikHub</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}
