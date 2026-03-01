"use client";

import React from "react";
import { ArrowLeft, ShieldCheck, Mail, Lock, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function KvkkPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-black selection:text-[#00F5D4] dark:selection:bg-white dark:selection:text-black">
            <div className="container mx-auto py-8 md:py-16 px-4 max-w-4xl">

                {/* Header Section */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8 border-2 border-black/20 dark:border-white/20 px-3 py-1.5 rounded-lg hover:border-black dark:hover:border-white transition-all group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Ana Sayfaya Dön
                    </Link>

                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="p-4 bg-[#FF914D] text-black border-[3px] border-black rounded-xl shadow-[6px_6px_0px_#000] rotate-2 z-10">
                            <ShieldCheck className="w-10 h-10 stroke-[2.5px]" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground drop-shadow-sm">
                                KVKK & Gizlilik
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground font-bold mt-1">
                                Kişisel verilerinizin korunması bizim için önemlidir.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >

                    {/* Section 1 */}
                    <section className="bg-card border-[3px] border-black dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3EC1F3] rounded-bl-[100px] -z-0 opacity-20 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#3EC1F3] text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
                                    <Database className="w-5 h-5 stroke-[2.5px]" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">1. Verilerin İşlenme Amacı</h2>
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed space-y-3">
                                <p>
                                    Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, sitemize kayıt olduğunuzda sağladığınız bilgiler
                                    (ad, e-posta, meslek beyanları vb.) sistem güvenliğinizin sağlanması ve site içi deneyiminizin
                                    özelleştirilmesi amacıyla işlenmektedir.
                                </p>
                                <p>
                                    FizikHub platformunu kullanarak bilimsel tartışmalara katılabilmeniz ve içerik üretebilmeniz için girmeyi
                                    tercih ettiğiniz bilgiler, sadece yasal yükümlülükler doğrultusunda güvenli sunucularda muhafaza edilir.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-card border-[3px] border-black dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D084] rounded-bl-[100px] -z-0 opacity-20 transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#00D084] text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
                                    <Lock className="w-5 h-5 stroke-[2.5px]" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">2. Verilerin Güvenliği</h2>
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed space-y-3">
                                <p>
                                    Kullanıcılara ait hassas bilgiler (şifreler vb.) şifrelenerek veritabanında saklanmaktadır. Biz ve üçüncü
                                    şahıslar bu şifrelere erişemeyiz. Çerezler (cookies) yalnızca oturum yönetimi ve site stabilitesini sağlamak
                                    için kullanılır, üçüncü taraf reklam ağlarıyla paylaşılmaz.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-[#FFD100] text-black border-[3px] border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
                                    <Mail className="w-5 h-5 stroke-[2.5px]" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">3. Haklarınız ve İletişim</h2>
                            </div>
                            <div className="text-sm md:text-base font-bold leading-relaxed space-y-3 opacity-90">
                                <p>
                                    Kişisel verilerinizin silinmesini, düzeltilmesini veya hangi amaçlarla kullanıldığını
                                    öğrenmeyi talep etme hakkına sahipsiniz. Platform üyeliğinizi tamamen sildiğinizde, içerikleriniz isteğinize
                                    bağlı olarak anonimleştirilebilir veya sistemden topyekûn kaldırılabilir.
                                </p>
                                <p className="pt-4 border-t-2 border-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <span>Talepleriniz için e-posta adresi:</span>
                                    <a href="mailto:iletisim@fizikhub.com" className="font-black bg-white px-3 py-1 rounded-md border-2 border-black hover:bg-black hover:text-white transition-colors">
                                        iletisim@fizikhub.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </section>

                </motion.div>

                <div className="mt-16 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Fiziki ve Dijital Uzayda Güvendesiniz.
                    </p>
                </div>

            </div>
        </div>
    );
}
