"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import { CustomRocketIcon as Rocket } from "@/components/ui/custom-rocket-icon";
import Link from "next/link";
import { sendPasswordResetEmail } from "./actions";
import { toast } from "sonner";

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
            toast.success("Şifre sıfırlama linki e-postana gönderildi!");
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-black">
            {/* Simple Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black" />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-6 font-bold uppercase text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Giriş Sayfasına Dön
                </Link>

                <div className="bg-black border border-white/10 p-1 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Industrial Hazard Stripes */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#ea580c_10px,#ea580c_20px)] opacity-50 z-20" />

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary z-30" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary z-30" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary z-30" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary z-30" />

                    <div className="bg-black/60 p-6 md:p-8 rounded-xl relative z-10">
                        {!sent ? (
                            <>
                                <div className="text-center mb-6">
                                    <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                        Şİfreni Mİ Unuttun?
                                    </h1>
                                    <p className="text-white/60 text-sm font-medium">
                                        E-posta adresini gir, sıfırlama linki gönderelim.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold uppercase text-white/60 tracking-wider flex items-center gap-2">
                                            <div className="w-1 h-1 bg-primary rounded-full" />
                                            E-posta
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="einstein@fizikhub.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="h-12 border-white/10 rounded-none bg-white/5 text-white placeholder:text-white/20 focus-visible:ring-0 focus-visible:border-primary transition-all font-medium pl-4 border-l-2 border-l-primary/50"
                                            />
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base font-bold uppercase rounded-none bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                Gönderiliyor...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Link Gönder
                                                <Rocket className="h-5 w-5" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                        <Mail className="h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-black text-white uppercase mb-2">
                                        E-posta Gönderildi!
                                    </h2>
                                    <p className="text-white/60 text-sm font-medium max-w-sm mx-auto">
                                        <span className="text-primary font-bold">{email}</span> adresine şifre sıfırlama linki gönderdik.
                                        E-postanı kontrol et ve linke tıkla.
                                    </p>
                                </div>

                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 border-white/10 rounded-none bg-white/5 text-white hover:bg-white/10 hover:text-white transition-all font-bold uppercase"
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
