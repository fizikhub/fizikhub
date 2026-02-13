"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ArrowRight, Sparkles, Rocket, Globe, Zap, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

interface StepProps {
    onNext: () => void;
    formData: any;
    setFormData: (data: any) => void;
}

const WelcomeStep = ({ onNext }: StepProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="space-y-6 text-center"
    >
        <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center h-full"
            >
                <Sparkles className="w-24 h-24 text-orange-500" />
            </motion.div>
        </div>

        <h2 className="text-3xl font-black uppercase tracking-tight text-white leading-tight">
            HOŞ GELDİN <span className="text-orange-500 block">DENEY FARESİ</span>
        </h2>

        <p className="text-white/60 text-sm leading-relaxed max-w-[320px] mx-auto font-mono">
            Evrenin en garip köşesine hoş geldin. Burada bilim ciddi, ama biz... pek değiliz. Hazırsan hızlı bi tur atalım, sonra karadeliklerin içine çekilirsin.
        </p>

        <Button
            onClick={onNext}
            className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all mt-4"
        >
            KEMERLERİ BAĞLA
            <Rocket className="w-5 h-5 ml-2" />
        </Button>
    </motion.div>
);

const IdentityStep = ({ onNext, formData, setFormData }: StepProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Dosya boyutu 5MB'den küçük olmalı. Evreni sığdıramayız.");
            return;
        }

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Kullanıcı bulunamadı");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setFormData({ ...formData, avatarUrl: publicUrl });
            toast.success("Tipin fena değil, yüklendi!");
        } catch (error: any) {
            toast.error("Fotoğraf yüklenemedi. Devreler yandı.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">KİMSİN SEN?</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60 mt-2">
                    KUARK AVCISI MI, YOKSA SIRADAN BİR NPC Mİ?
                </p>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
                <div
                    className="relative group w-24 h-24 bg-white/5 border-4 border-white/10 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <Camera className="w-6 h-6 text-white/20 group-hover:text-orange-500 transition-colors" />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        </div>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <span className="text-[9px] font-black text-white/30 mt-3 uppercase tracking-[0.2em]">Karakter Resmi</span>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">TAM İSİM</Label>
                    <Input
                        placeholder="Ad Soyad"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:border-orange-500/50 rounded-2xl font-mono text-sm pl-4"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">KOD ADIN (NICKNAME)</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/40 font-black text-sm">@</span>
                        <Input
                            placeholder="kuark_avcisi"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '') })}
                            className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:border-orange-500/50 pl-10 rounded-2xl transition-all font-mono text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">BİYO (KISA VE ÖZ)</Label>
                    <textarea
                        className="w-full min-h-[80px] bg-white/5 border-2 border-white/10 p-4 text-white rounded-2xl font-mono text-sm resize-none focus:outline-none focus:border-orange-500/50"
                        placeholder="Neden buradasın? Karadelikleri mi seviyorsun yoksa sadece formül mü?"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        maxLength={160}
                    />
                </div>
            </div>

            <Button
                onClick={() => {
                    if (formData.username.length < 3) {
                        toast.error("Kullanıcı adın en az 3 karakter olmalı. Kendine yakışan bi isim bul.");
                        return;
                    }
                    if (!formData.fullName) {
                        toast.error("İsimsiz kahraman olmaz. Tam ismini yaz.");
                        return;
                    }
                    onNext();
                }}
                className="w-full h-12 bg-white text-black hover:bg-orange-500 hover:text-white font-black uppercase tracking-widest text-xs rounded-xl border-2 border-black transition-all"
            >
                ŞÖYLE Bİ BAKALIM
                <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </motion.div>
    );
};

const NavigationStep = ({ onNext }: StepProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="space-y-6"
    >
        <div className="text-center mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">KEŞFEDECEK <span className="text-orange-500">ÇOK ŞEY VAR</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-2">
                AMA ÖNCE NEREYE GİDECEĞİNİ BİL
            </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {[
                { icon: Globe, title: "FORUM", desc: "Sorularını sor, cevapları kap. Saçmalama serbest.", color: "text-blue-400" },
                { icon: Zap, title: "BLOG", desc: "Kendi araştırmalarını paylaş, popüler ol.", color: "text-yellow-400" },
                { icon: Rocket, title: "MAKALE", desc: "Ciddi bilimsel içerikler. Sıkılma diye kısa tuttuk.", color: "text-red-400" },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                    <div className={`p-3 bg-white/5 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                        <p className="text-[10px] text-white/40 font-mono leading-tight">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        <Button
            onClick={onNext}
            className="w-full h-12 bg-white text-black hover:bg-orange-500 hover:text-white font-black uppercase tracking-widest text-xs rounded-xl border-2 border-black transition-all"
        >
            ANLADIM, DEVAM KE
        </Button>
    </motion.div>
);

const FinishStep = ({ onNext }: StepProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
    >
        <div className="w-32 h-32 mx-auto bg-orange-500/20 rounded-[2.5rem] flex items-center justify-center border-4 border-orange-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-orange-500/10 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <Rocket className="w-16 h-16 text-orange-500 relative z-10" />
        </div>

        <div className="space-y-3">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">HAZIRSIN!</h2>
            <p className="text-white/40 text-[11px] font-mono max-w-[280px] mx-auto leading-relaxed">
                Artık içeriden birisin. Karadeliklerden uzak dur (ya da durma, senin bileceğin iş). İlk sorunu ne zaman soracaksın merak ediyoruz.
            </p>
        </div>

        <Button
            onClick={onNext}
            className="w-full h-14 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
        >
            EVRENE FIRLAT BENİ!
        </Button>
    </motion.div>
);

export function MultiStepOnboarding({ onComplete, loading }: { onComplete: (data: any) => void; loading: boolean }) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        avatarUrl: "",
        bio: ""
    });

    const steps = [
        WelcomeStep,
        IdentityStep,
        NavigationStep,
        FinishStep,
    ];

    const CurrentStep = steps[step];

    const handleNext = () => {
        if (step === steps.length - 1) {
            onComplete(formData);
        } else {
            setStep(prev => prev + 1);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-[440px] px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: -40 }}
                    exit={{ opacity: 0, scale: 1.05, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 p-8 sm:p-10 rounded-[3rem] relative overflow-hidden"
                >
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

                    {/* Progress Bar */}
                    <div className="flex gap-1.5 mb-8 justify-center">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 rounded-full transition-all duration-500 ${i === step ? "w-8 bg-orange-500" : i < step ? "w-4 bg-orange-500/30" : "w-4 bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    <CurrentStep
                        onNext={handleNext}
                        formData={formData}
                        setFormData={setFormData}
                    />

                    {loading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-black/60 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Evren Hazırlanıyor...</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
