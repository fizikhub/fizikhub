"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import { CreateQuestionDialog } from "@/components/forum/create-question-dialog";
import { Button } from "@/components/ui/button";

export function ForumTeaserCard() {
    return (
        <div className="my-8">
            <CreateQuestionDialog
                trigger={
                    <div className="w-full group cursor-pointer">
                        <div className="border-2 border-border bg-card p-6 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">

                            {/* Icon */}
                            <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                                <MessageCircle className="w-6 h-6 text-primary" />
                            </div>

                            {/* Text */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-foreground mb-1">
                                    Kafanda bir soru mu var?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Foruma sor, topluluktan cevap al.
                                </p>
                            </div>

                            {/* Button */}
                            <Button variant="outline" className="gap-2 border-2 font-bold shrink-0">
                                Soru Sor
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                }
            />
        </div>
    );
}

