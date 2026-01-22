"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Sparkles, Send, Palette } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface RapidScienceEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RapidScienceEditorModal({ isOpen, onClose }: RapidScienceEditorModalProps) {
    const [step, setStep] = useState<'guide' | 'editor'>('guide');
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedGradient, setSelectedGradient] = useState("from-amber-600 to-orange-600");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient();

    const gradients = [
        { name: "Kehribar", val: "from-amber-600 to-orange-600" },
        { name: "Kozmik", val: "from-blue-600 to-purple-600" },
        { name: "Zehir", val: "from-emerald-600 to-cyan-600" },
        { name: "Süpernova", val: "from-pink-600 to-rose-600" },
        { name: "Kara Delik", val: "from-gray-800 to-black" },
    ];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Compression
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(file, options);
                setImageFile(compressedFile);
                setImagePreview(URL.createObjectURL(compressedFile));
            } catch (err) {
                console.error(err);
                toast.error("Resim sıkıştırılamadı.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!title || !imageFile) {
            toast.error("Başlık ve resim zorunludur.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Upload Image
            const fileName = `story-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('article-images') // Reusing existing bucket for now
                .upload(`stories/${fileName}`, imageFile);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('article-images')
                .getPublicUrl(`stories/${fileName}`);

            const imageUrl = publicUrlData.publicUrl;

            // 3. Insert into Table
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Giriş yapmalısın.");

            // Get profile id
            const { data: profile } = await supabase.from('profiles').select('id, is_writer').eq('id', user.id).single();
            if (!profile?.is_writer) throw new Error("Yazar yetkiniz yok.");

            const { error: insertError } = await supabase
                .from('stories')
                .insert({
                    author_id: user.id,
                    title,
                    summary,
                    image_url: imageUrl,
                    color: selectedGradient
                });

            if (insertError) throw insertError;

            toast.success("Hızlı Bilim hikayesi paylaşıldı!");
            onClose();
            // Reset
            setStep('guide');
            setTitle("");
            setSummary("");
            setImageFile(null);
            setImagePreview(null);

            // Force reload to see new story (simple way)
            window.location.reload();

        } catch (error: any) {
            console.error(error);
            toast.error("Hata: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <div onClick={onClose} className="absolute inset-0" /> {/* Backdrop click */}

                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content Switcher */}
                    {step === 'guide' ? (
                        <div className="p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-900/20 rotate-3">
                                <Sparkles className="w-8 h-8 text-black" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Hızlı Bilim Nedir?</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Instagram hikayeleri gibi, hızlı tüketilen, görsel ağırlıklı ve çarpıcı bilimsel gerçekler.
                                <br /><br />
                                <ul className="text-left text-sm space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <li>⚡️ <b>Kısa & Öz:</b> En fazla 3 cümle.</li>
                                    <li>🎨 <b>Görsel Odaklı:</b> Dikey (9:16) görseller tercih et.</li>
                                    <li>🧪 <b>Bilimsel:</b> Kaynağı belli, net bilgi.</li>
                                </ul>
                            </p>
                            <Button
                                onClick={() => setStep('editor')}
                                className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-xl"
                            >
                                Oluşturmaya Başla
                            </Button>
                        </div>
                    ) : (
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Hikaye Oluşturucu
                            </h2>

                            <div className="space-y-4">
                                {/* Image Upload & Preview */}
                                <div className="relative aspect-[9/16] w-full max-h-[300px] bg-black/50 border-2 border-dashed border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 group-hover:text-white transition-colors">
                                            <ImageIcon className="w-8 h-8 mb-2" />
                                            <span className="text-xs font-medium">Görsel Seç</span>
                                        </div>
                                    )}
                                    {/* Gradient Overlay Preview */}
                                    <div className={`absolute inset-0 bg-gradient-to-b ${selectedGradient} opacity-30 mix-blend-overlay pointer-events-none`} />
                                </div>

                                {/* Inputs */}
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Çarpıcı Başlık (Örn: Işık Hızı?)"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-black/20 border-white/10 text-white placeholder:text-white/20"
                                        maxLength={40}
                                    />
                                    <Textarea
                                        placeholder="Kısa Açıklama (Max 150 karakter)"
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        className="bg-black/20 border-white/10 text-white placeholder:text-white/20 h-20 resize-none"
                                        maxLength={150}
                                    />
                                </div>

                                {/* Gradient Picker */}
                                <div>
                                    <label className="text-xs text-white/40 mb-2 flex items-center gap-1">
                                        <Palette className="w-3 h-3" />
                                        Atmosfer Rengi
                                    </label>
                                    <div className="flex gap-2">
                                        {gradients.map((g) => (
                                            <button
                                                key={g.name}
                                                onClick={() => setSelectedGradient(g.val)}
                                                className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.val} border-2 transition-all ${selectedGradient === g.val ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                title={g.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 rounded-xl mt-4"
                                >
                                    {isSubmitting ? "Paylaşılıyor..." : (
                                        <>
                                            Paylaş <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
