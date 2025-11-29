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

interface SignOutButtonProps {
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    iconOnly?: boolean;
}

export function SignOutButton({ className, variant = "destructive", iconOnly = false }: SignOutButtonProps) {
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
                variant={variant}
                size={iconOnly ? "icon" : "sm"}
                onClick={() => setShowDialog(true)}
                className={className}
            >
                <LogOut className={iconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"} />
                {!iconOnly && "Çıkış Yap"}
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
