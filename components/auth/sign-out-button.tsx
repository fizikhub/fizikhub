"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";
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

export function SignOutButton() {
    const [showDialog, setShowDialog] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await signOut();
        } catch (error) {
            // Redirect happens in server action
            setIsSigningOut(false);
        }
    };

    return (
        <>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDialog(true)}
                className="gap-2"
            >
                <LogOut className="h-4 w-4" /> Çıkış Yap
            </Button>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Emin misin çıkmaya?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            emin misin çıkmaya? şifreni falan hatırlıyor musun? sonra gelip deme bana şifremi sıfırla diye? şaka şaka şifreni sıfırlarız turunçu kızıl saçlı bir hanımefendi isen daha güzel sıfırlarız hatta.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSigningOut}>
                            Kalmaya Devam
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSigningOut ? "Çıkış Yapılıyor..." : "Evet, Çıkış Yap"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
