"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { DankLogo } from "@/components/brand/dank-logo";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const StarBackground = dynamic(() => import("@/components/background/star-background").then(mod => mod.StarBackground), { ssr: false });

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
            const result = await verifyOtp(code, 'signup', email);

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
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-transparent text-white font-mono">
                <StarBackground />
                <div className="text-center space-y-4 relative z-10">
                    <p className="text-white/60">GEÇERSİZ ERİŞİM İSTEĞİ.</p>
                    <Button variant="link" onClick={() => router.push("/login")} className="text-orange-500">GİRİŞ EKRANINA DÖN</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Universal Star Background */}
            <StarBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: -40 }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2
                }}
                className="w-full max-w-[420px] relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-6 relative">
                    <div className="inline-flex justify-center mb-1 transform hover:scale-110 transition-transform duration-500">
                        <DankLogo />
                    </div>
                    <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />

                    <div className="mt-8 space-y-2">
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            GÜVENLİK KONTROLÜ
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/60">
                            <Lock className="h-3 w-3" />
                            <span>ERİŞİM DOĞRULAMASI GEREKLİ</span>
                        </div>
                    </div>
                </div>

                {/* The Card Structure */}
                <div className="relative group">
                    {/* Neo-Brutalist Shadow Layer */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

                    {/* The Card Itself */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 ring-1 ring-white/20 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden">

                        {/* Internal Liquid Shine */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                        <div className="text-center mb-6">
                            <div className="bg-white/5 border border-white/10 p-4 mb-4 inline-block rounded-2xl">
                                <Mail className="h-6 w-6 mx-auto text-white/40" />
                            </div>
                            <p className="text-xs font-bold text-white/60 tracking-tight leading-relaxed">
                                <span className="text-orange-500">{email}</span> adresine<br />gönderilen kodu gir.
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
                                    className="text-center text-3xl tracking-[0.3em] font-mono h-16 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/5 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all uppercase pl-4"
                                    maxLength={8}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_30px_rgba(234,88,12,0.2)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.3)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        DOĞRULA <ShieldCheck className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                Kod ulaşmadı mı?{" "}
                                <button
                                    className="text-orange-500 hover:text-orange-400 transition-colors"
                                    onClick={handleResend}
                                    disabled={resending}
                                >
                                    {resending ? "İLETİLİYOR..." : "TEKRAR İLET"}
                                </button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/20 hover:text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all"
                                onClick={() => router.push("/login")}
                            >
                                <ArrowLeft className="h-3 w-3 mr-2" />
                                GİRİŞ EKRANINA DÖN
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-8 text-center invisible sm:visible">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        <span className="text-[9px] font-black tracking-widest text-white/40 uppercase">SİSTEM ÇEVRİMİÇİ</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
