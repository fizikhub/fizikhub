"use client";

import { useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
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
            <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground font-mono">GEÇERSİZ ERİŞİM İSTEĞİ.</p>
                    <Button variant="link" onClick={() => router.push("/login")}>GİRİŞ EKRANINA DÖN</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Technical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20" />

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
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            GÜVENLİK KONTROLÜ
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            <span>ERİŞİM DOĞRULAMASI GEREKLİ</span>
                        </div>
                    </div>
                </div>

                {/* Industrial Card */}
                <div className="bg-background border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 md:p-8 relative">
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1" />

                    <div className="text-center mb-6">
                        <div className="bg-muted/30 border border-black/10 dark:border-white/10 p-3 mb-4 inline-block">
                            <Mail className="h-6 w-6 mx-auto text-primary" />
                        </div>
                        <p className="text-sm font-medium">
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
                                className="text-center text-2xl tracking-[0.5em] font-mono h-14 bg-muted/20 border-2 border-black/20 dark:border-white/20 focus:border-primary transition-all uppercase rounded-none"
                                maxLength={8}
                                required
                                autoFocus
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-black uppercase tracking-wider rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all bg-primary text-primary-foreground hover:bg-primary/90"
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

                    <div className="mt-6 pt-6 border-t-2 border-dashed border-black/10 dark:border-white/10 text-center space-y-4">
                        <div className="text-sm text-muted-foreground">
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
                            className="text-muted-foreground hover:text-foreground font-mono text-xs uppercase"
                            onClick={() => router.push("/login")}
                        >
                            <ArrowLeft className="h-3 w-3 mr-2" />
                            GİRİŞ EKRANINA DÖN
                        </Button>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">SİSTEM ÇEVRİMİÇİ</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}
