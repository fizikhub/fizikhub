"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, MoveLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center p-4 selection:bg-[#F43F5E] selection:text-white">

            <div className="max-w-3xl w-full flex flex-col items-center text-center">

                {/* 1. Header (YIKES / HAY AKSİ) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="mb-4 relative z-10"
                >
                    <div className="bg-[#E5E7EB] px-8 py-4 rounded-xl relative bubble-tail">
                        <h1 className="text-6xl sm:text-8xl font-black text-zinc-900 tracking-tighter">
                            HAY AKSİ!
                        </h1>
                        {/* Speech Bubble Tail */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-t-[30px] border-t-[#E5E7EB] border-r-[20px] border-r-transparent"></div>
                    </div>
                </motion.div>

                {/* 2. Generated Character Asset */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-[500px] aspect-square -mt-4 mb-8"
                >
                    <Image
                        src="/404-scientist.png"
                        alt="Embarrassed Scientist holding 404 sign"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </motion.div>

                {/* 3. Humorous Copy */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6 max-w-xl"
                >
                    <h2 className="text-3xl font-black text-zinc-900">
                        Sanırım yanlış zamanda geldin...
                    </h2>

                    <p className="text-xl text-zinc-600 font-medium">
                        Bu sayfa henüz giyinmemişti. Yakalandık!
                        <br />
                        Hemen çaktırmadan ana sayfaya dönelim.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Link href="/">
                            <Button className="h-14 px-8 bg-[#F43F5E] hover:bg-[#E11D48] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                <Home className="w-5 h-5 mr-2" />
                                Bizi Buradan Çıkar
                            </Button>
                        </Link>
                        <Link href="/forum">
                            <Button variant="outline" className="h-14 px-8 border-2 border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-lg font-bold rounded-xl">
                                <MoveLeft className="w-5 h-5 mr-2" />
                                Geri Dön
                            </Button>
                        </Link>
                    </div>

                </motion.div>

            </div>
        </div>
    );
}
