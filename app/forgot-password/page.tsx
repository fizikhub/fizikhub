"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { sendPasswordResetEmail } from "./actions";
import { toast } from "sonner";
import { StarBackground } from "@/components/background/star-background";
import { DankLogo } from "@/components/brand/dank-logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await sendPasswordResetEmail(email);

        if (result.success) {
            setSent(true);
            toast.success("Şifre sıfırlama linki gönderildi!");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setLoading(false);
    };

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
                {/* Back Link */}
                <div className="mb-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-orange-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Geri Dön
                    </Link>
                </div>

                {/* The Card Structure */}
                <div className="relative group">
                    {/* Neo-Brutalist Shadow Layer */}
                    <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500" />

                    {/* The Card Itself */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/20 ring-1 ring-white/20 p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden">

                        {/* Internal Liquid Shine */}
                        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

                        {!sent ? (
                            <>
                                <div className="text-center mb-6 relative">
                                    <div className="inline-flex justify-center mb-1 transform hover:scale-110 transition-transform duration-500">
                                        <DankLogo />
                                    </div>
                                    <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-2" />
                                    <h1 className="text-lg font-black text-white uppercase tracking-[0.1em] mt-6">
                                        Şifreni Sıfırla
                                    </h1>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">
                                        E-posta adresine bir sıfırlama linki göndereceğiz.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-white/40 pl-2 tracking-widest">E-Posta</Label>
                                        <Input
                                            type="email"
                                            placeholder="mail@ornek.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-12 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-orange-500/50 focus:ring-0 rounded-2xl transition-all font-mono text-sm pl-4"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl border-4 border-black shadow-[0_10px_30px_rgba(234,88,12,0.2)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.3)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        ) : (
                                            <>
                                                Link Gönder
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 mx-auto bg-green-500/10 border-2 border-green-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                                    E-posta Gönderildi
                                </h1>
                                <p className="text-white/40 text-xs font-bold leading-relaxed mb-8 px-4">
                                    <span className="text-orange-500">{email}</span> adresine bir şifre sıfırlama linki gönderdik. Lütfen gelen kutunu kontrol et.
                                </p>

                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/30 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                                    >
                                        Giriş Sayfasına Dön
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
