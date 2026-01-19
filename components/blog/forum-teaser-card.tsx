"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, ArrowRight } from "lucide-react";
import { CreateQuestionDialog } from "@/components/forum/create-question-dialog";
import { cn } from "@/lib/utils";

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
                        {/* Improved Card */}
                        <div
                            className={cn(
                                "relative overflow-hidden rounded-[2rem] transition-all duration-300",
                                "bg-card border-3 border-foreground/10",
                                "p-6 md:p-8",
                                "group-hover:-translate-y-1 group-hover:translate-x-1",
                                "group-hover:border-primary/50 dark:group-hover:border-primary/50",
                                "group-hover:shadow-[-4px_4px_0px_0px_rgba(var(--primary),0.2)]"
                            )}
                        >
                            {/* Animated Corner Accent */}
                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-20 group-hover:opacity-100 transition-opacity">
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
                                <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                                    <MessageSquare className="w-8 h-8" strokeWidth={2.5} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black font-heading tracking-tight text-foreground group-hover:text-primary transition-colors">
                                        Kafanda Soru mu Var?
                                    </h3>
                                    <p className="text-muted-foreground font-medium">
                                        Foruma at, topluluk çözsün. Bekletmeyiz.
                                    </p>
                                </div>

                                {/* CTA */}
                                <motion.div
                                    className="flex items-center gap-2 px-6 py-3 bg-muted/30 text-foreground font-bold uppercase text-sm tracking-wider rounded-xl border border-border/50 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors shrink-0"
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
