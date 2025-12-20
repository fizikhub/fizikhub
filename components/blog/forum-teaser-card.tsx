"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, ArrowRight } from "lucide-react";
import { CreateQuestionDialog } from "@/components/forum/create-question-dialog";

export function ForumTeaserCard() {
    return (
        <div className="my-10">
            <CreateQuestionDialog
                trigger={
                    <motion.div
                        className="w-full cursor-pointer group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        {/* Brutalist Card */}
                        <div
                            className="relative bg-card border-4 border-foreground dark:border-foreground/80 p-6 md:p-8 transition-all duration-200 group-hover:translate-x-1 group-hover:translate-y-1"
                            style={{ boxShadow: "6px 6px 0px 0px currentColor" }}
                        >
                            {/* Animated Corner Accent */}
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                <motion.div
                                    className="absolute top-0 right-0 w-24 h-24 bg-primary"
                                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <Zap className="absolute top-2 right-2 w-5 h-5 text-primary-foreground" />
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Icon Block */}
                                <div className="p-4 bg-foreground text-background shrink-0">
                                    <MessageSquare className="w-8 h-8" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">
                                        Kafanda Soru mu Var?
                                    </h3>
                                    <p className="text-muted-foreground font-medium">
                                        Foruma at, topluluk çözsün. Bekletmeyiz.
                                    </p>
                                </div>

                                {/* CTA */}
                                <motion.div
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black uppercase text-sm tracking-wider border-2 border-foreground shrink-0"
                                    whileHover={{ x: 4 }}
                                >
                                    <span>Soru Sor</span>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </div>

                            {/* Bottom Decoration */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-primary"
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                }
            />
        </div>
    );
}
