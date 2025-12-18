"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { CreateQuestionDialog } from "@/components/forum/create-question-dialog";

export function ForumTeaserCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="my-8"
        >
            <CreateQuestionDialog
                trigger={
                    <div className="w-full group cursor-pointer">
                        <div className="relative border-2 border-dashed border-amber-500/30 bg-amber-500/5 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center gap-4 transition-all duration-300 hover:border-amber-500 hover:bg-amber-500/10 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] group-hover:scale-[1.01]">

                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                <motion.div
                                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* Icon */}
                            <div className="relative z-10 p-4 bg-amber-500 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-8 h-8 text-black" />
                            </div>

                            {/* Text */}
                            <div className="relative z-10 space-y-2">
                                <h3 className="text-2xl font-black uppercase text-foreground group-hover:text-amber-500 transition-colors">
                                    Aklında Bir Soru mu Var?
                                </h3>
                                <p className="text-muted-foreground font-medium max-w-md mx-auto">
                                    Bilim topluluğuna sor, tartışmalara katıl ve cevapları birlikte keşfedelim.
                                </p>
                            </div>

                            {/* Button-like visual */}
                            <div className="relative z-10 mt-2 px-6 py-2 bg-background border-2 border-foreground rounded-full font-bold uppercase text-sm tracking-wider flex items-center gap-2 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-black transition-all">
                                <span>Soru Sor</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                }
            />
        </motion.div>
    );
}
