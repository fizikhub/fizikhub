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
import { m as motion } from "framer-motion";
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
                router.push("/kurulum");
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
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">GEÇERSİZ ERİŞİM İSTEĞİ.</p>
                    <Button variant="link" onClick={() => router.push("/login")} className="text-neo-yellow font-black uppercase tracking-widest text-xs">GİRİŞ EKRANINA DÖN</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-5 py-8 relative overflow-hidden bg-transparent font-sans selection:bg-neo-yellow/30 selection:text-neo-yellow">
            <StarBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: -30 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* ──── THE CARD ──── */}
                <div className="bg-[#292929] border-2 border-white/[0.12] shadow-[5px_5px_0px_0px_rgba(255,255,255,0.8)] rounded-2xl relative overflow-hidden">

                    {/* Inner content */}
                    <div className="px-7 pt-8 pb-7 sm:px-9 sm:pt-10 sm:pb-8">

                        {/* ── Logo ── */}
                        <div className="text-center mb-6">
                            <div className="inline-flex justify-center transform hover:-translate-y-0.5 transition-transform duration-200 scale-[1.3] sm:scale-[1.45] origin-center mb-5">
                                <DankLogo />
                            </div>

                            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-1.5">
                                Güvenlik Kontrolü
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neo-yellow/60">
                                <Lock className="h-3 w-3" />
                                <span>Erişim Doğrulaması Gerekli</span>
                            </div>
                        </div>

                        {/* ── Mail Info ── */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/[0.05] border-2 border-white/[0.08] rounded-xl mb-3">
                                <Mail className="h-5 w-5 text-zinc-500" />
                            </div>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider leading-relaxed">
                                <span className="text-neo-yellow">{email}</span>
                                <br />adresine gönderilen kodu gir.
                            </p>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div>
                                <Label htmlFor="code" className="sr-only">Doğrulama Kodu</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="KODU GİR"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="text-center text-2xl sm:text-3xl tracking-[0.3em] font-mono font-bold h-14 bg-white/[0.05] border-2 border-white/[0.08] text-white placeholder:text-zinc-700 focus:border-neo-yellow/70 focus:bg-white/[0.07] focus:ring-0 rounded-xl transition-all uppercase"
                                    maxLength={8}
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-[50px] bg-neo-yellow hover:bg-yellow-300 text-black font-black uppercase tracking-widest text-[13px] rounded-xl border-2 border-black/80 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center gap-2.5"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-black" />
                                ) : (
                                    <>
                                        Doğrula
                                        <ShieldCheck className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* ── Resend ── */}
                        <div className="mt-6 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-1">
                                Kod ulaşmadı mı?{" "}
                                <button
                                    className="text-neo-yellow hover:text-white transition-colors"
                                    onClick={handleResend}
                                    disabled={resending}
                                >
                                    {resending ? "İletiliyor..." : "Tekrar İlet"}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* ── Bottom bar — Back to login ── */}
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="w-full py-3.5 border-t-2 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all group/back flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 text-zinc-600 group-hover/back:text-white transition-colors" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover/back:text-white transition-colors">
                            Giriş Ekranına Dön
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-neo-yellow" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
