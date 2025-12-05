"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldCheck, ArrowLeft, Lock, Radio } from "lucide-react";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("E-posta adresi bulunamadı.");
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtp(email, code);

            if (result.success) {
                toast.success("Erişim izni onaylandı.");
                router.push("/onboarding");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Sistem hatası.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;

        setResending(true);
        try {
            const result = await resendOtp(email);
            if (result.success) {
                toast.success("Yeni kod iletildi.");
            } else {
                toast.error(result.error || "Kod gönderilemedi.");
            }
        } catch (error) {
            toast.error("Sistem hatası.");
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black text-white">
                <div className="text-center space-y-4">
                    <p className="text-white/60 font-mono">GEÇERSİZ ERİŞİM İSTEĞİ.</p>
                    <Button variant="link" onClick={() => router.push("/login")} className="text-primary">GİRİŞ EKRANINA DÖN</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Black Hole Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-transparent via-primary/5 to-transparent blur-3xl opacity-40"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-transparent via-orange-600/10 to-transparent blur-2xl opacity-30"
                />
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            opacity: Math.random()
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8 space-y-4">
                    <div className="inline-block">
                        <Logo />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                            GÜVENLİK KONTROLÜ
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-primary/80">
                            <Lock className="h-3 w-3" />
                            <span>ERİŞİM DOĞRULAMASI GEREKLİ</span>
                        </div>
                    </div>
                </div>

                {/* Industrial Glass Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-2xl shadow-2xl relative overflow-hidden group">
                    {/* Industrial Hazard Stripes */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary z-30" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary z-30" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary z-30" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary z-30" />

                    <div className="bg-black/60 p-6 md:p-8 rounded-xl relative z-10">
                        <div className="text-center mb-6">
                            <div className="bg-primary/10 border border-primary/20 p-3 mb-4 inline-block rounded-full">
                                <Mail className="h-6 w-6 mx-auto text-primary" />
                            </div>
                            <p className="text-sm font-medium text-white/80">
                                <span className="font-bold text-primary">{email}</span> adresine gönderilen kodu gir.
                            </p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="sr-only">Doğrulama Kodu</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="KODU GİR"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-white/5 border-white/10 focus:border-primary transition-all uppercase rounded-none text-white placeholder:text-white/20"
                                    maxLength={8}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-black uppercase tracking-wider rounded-none border border-white/20 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-white hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        DOĞRULA <ShieldCheck className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-4">
                            <div className="text-sm text-white/60">
                                Kod ulaşmadı mı?{" "}
                                <button
                                    className="font-bold text-primary hover:underline uppercase tracking-wide"
                                    onClick={handleResend}
                                    disabled={resending}
                                >
                                    {resending ? "İLETİLİYOR..." : "TEKRAR İLET"}
                                </button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/40 hover:text-white font-mono text-xs uppercase hover:bg-white/5"
                                onClick={() => router.push("/login")}
                            >
                                <ArrowLeft className="h-3 w-3 mr-2" />
                                GİRİŞ EKRANINA DÖN
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[10px] font-mono text-white/60 uppercase">SİSTEM ÇEVRİMİÇİ</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
