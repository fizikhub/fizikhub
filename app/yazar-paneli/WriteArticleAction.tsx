"use client";

import { useState } from "react";
import { PenSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export function WriteArticleAction() {
    const [showPrompt, setShowPrompt] = useState(false);
    const router = useRouter();

    const handleAction = () => {
        setShowPrompt(true);
    };

    const goToManifesto = () => {
        setShowPrompt(false);
        router.push("/yazar-paneli/manifesto");
    };

    return (
        <>
            <Button 
                onClick={handleAction}
                className="font-black border-2 border-black dark:border-zinc-800 bg-[#FFBD2E] text-black hover:bg-[#FFD268] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none h-11 px-5"
            >
                <PenSquare className="w-4 h-4 mr-2" />
                Yazı Yaz
            </Button>

            <AlertDialog open={showPrompt} onOpenChange={setShowPrompt}>
                <AlertDialogContent className="border-[3px] border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black uppercase italic">Dur Yolcu!</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-900 dark:text-zinc-100 font-bold text-lg">
                            Yazmaya başlamadan önce, FizikHub&apos;ın ruhunu ve kurallarını içeren 
                            <span className="text-yellow-600 dark:text-yellow-400"> Yazar Rehberi Manifestosu</span>&apos;nu okumanız gerekiyor.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="font-bold border-2 border-black">Vazgeç</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={goToManifesto}
                            className="bg-black text-white hover:bg-zinc-800 font-black flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" /> Rehberi Oku
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
