"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
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
import { Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/app/profil/actions";
import { CoverUpload } from "@/components/profile/cover-upload";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { ThemeSelector } from "@/components/profile/theme-selector";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/auth/actions";

interface ProfileSettingsButtonProps {
    currentFullName: string | null;
    currentBio: string | null;
    currentAvatarUrl: string | null;
    currentCoverUrl?: string | null;
    currentWebsite?: string | null;
    currentSocialLinks?: any;
    currentUsername: string;
    userEmail?: string | null;
    usernameChangeCount?: number;
}

export function ProfileSettingsButton({
    currentFullName,
    currentBio,
    currentAvatarUrl,
    currentCoverUrl,
    currentWebsite,
    currentSocialLinks,
    currentUsername,
    userEmail,
    usernameChangeCount = 0
}: ProfileSettingsButtonProps) {
    const [open, setOpen] = useState(false);
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [fullName, setFullName] = useState(currentFullName || "");
    const [username, setUsername] = useState(currentUsername || "");
    const [bio, setBio] = useState(currentBio || "");
    const [website, setWebsite] = useState(currentWebsite || "");
    const [twitter, setTwitter] = useState(currentSocialLinks?.twitter || "");
    const [github, setGithub] = useState(currentSocialLinks?.github || "");
    const [instagram, setInstagram] = useState(currentSocialLinks?.instagram || "");
    const [linkedin, setLinkedin] = useState(currentSocialLinks?.linkedin || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();
    const isAdmin = userEmail === 'barannnbozkurttb.b@gmail.com';
    const userInitial = currentFullName?.charAt(0) || currentUsername?.charAt(0)?.toUpperCase() || "U";

    // Check if allowed to change username
    const canChangeUsername = isAdmin || (usernameChangeCount < 1);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleUpdate = async () => {
        setIsUpdating(true);

        // 1. Update Username if changed
        if (username !== currentUsername) {
            const usernameResult = await import("@/app/profil/actions").then(mod => mod.updateUsername(username));
            if (!usernameResult.success) {
                toast.error(usernameResult.error || "Kullanıcı adı güncellenemedi");
                setIsUpdating(false);
                return;
            }
        }

        // 2. Update Profile Info
        const socialLinks = {
            twitter: twitter || null,
            github: github || null,
            instagram: instagram || null,
            linkedin: linkedin || null
        };

        const result = await updateProfile({
            full_name: fullName,
            bio,
            website: website || undefined,
            social_links: socialLinks
        });

        if (result.success) {
            toast.success("Profil güncellendi!");
            setOpen(false);
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }

        setIsUpdating(false);
    };

    const handleSignOutClick = () => {
        setShowSignOutDialog(true);
    };

    const handleConfirmSignOut = async () => {
        toast.success("Görüşmek üzere! 👋");
        await signOut();
    };

    const SettingsContent = () => (
        <div className="space-y-6 py-4">
            {/* Avatar Upload */}
            <div className="space-y-2 flex flex-col items-center">
                <Label className="text-center">Profil Fotoğrafı</Label>
                <AvatarUpload
                    currentAvatarUrl={currentAvatarUrl}
                    userInitial={userInitial}
                    className="w-24 h-24 sm:w-32 sm:h-32"
                />
            </div>

            {/* Cover Upload */}
            <div className="space-y-2">
                <Label>Kapak Fotoğrafı</Label>
                <CoverUpload
                    currentCoverUrl={currentCoverUrl}
                    onSuccess={() => {
                        setOpen(false);
                        router.push('/profil?reposition=true');
                    }}
                />
            </div>

            {/* Theme Selector */}
            <div className="space-y-2 pb-2 border-b">
                <ThemeSelector />
            </div>

            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    disabled={!canChangeUsername || isUpdating}
                />
                <p className="text-xs text-muted-foreground">
                    {isAdmin
                        ? "Benzersiz olmalı, sadece harf, rakam ve alt çizgi. (Admin)"
                        : canChangeUsername
                            ? "Kullanıcı adınızı sadece bir kez değiştirebilirsiniz."
                            : "Kullanıcı adı değiştirme hakkınız doldu."}
                </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
                <Label htmlFor="fullname">Ad Soyad</Label>
                <Input
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Adınız Soyadınız"
                    disabled={isUpdating}
                />
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Kendiniz hakkında birkaç cümle yazın..."
                    disabled={isUpdating}
                    rows={4}
                    maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                    {bio.length}/500 karakter
                </p>
            </div>

            {/* Website */}
            <div className="space-y-2">
                <Label htmlFor="website">Web Sitesi</Label>
                <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    disabled={isUpdating}
                />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter (X)</Label>
                    <Input
                        id="twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="@username"
                        disabled={isUpdating}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                        id="github"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="username"
                        disabled={isUpdating}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                        id="instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="username"
                        disabled={isUpdating}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                        id="linkedin"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="username"
                        disabled={isUpdating}
                    />
                </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t">
                <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleSignOutClick}
                >
                    <LogOut className="w-4 h-4" />
                    Hesaptan Çıkış Yap
                </Button>
            </div>
        </div>
    );

    const SettingsFooter = () => (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUpdating}
            >
                İptal
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? "Güncelleniyor..." : "Kaydet"}
            </Button>
        </>
    );

    // Mobile: Use Sheet
    if (isMobile) {
        return (
            <>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-full font-bold h-10 px-4 bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80 transition-all shadow-sm"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Ayarlar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Ayarlar</SheetTitle>
                            <SheetDescription>
                                Profil ayarlarınızı buradan yönetebilirsiniz.
                            </SheetDescription>
                        </SheetHeader>
                        <SettingsContent />
                        <SheetFooter className="mt-6">
                            <SettingsFooter />
                        </SheetFooter>
                    </SheetContent>
                </Sheet>

                {/* Sign Out Confirmation Dialog */}
                <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Gerçekten gidiyor musun? 🥺</AlertDialogTitle>
                            <AlertDialogDescription asChild>
                                <div className="space-y-2">
                                    <span className="block">Kara deliklerin çekim gücü kadar güçlü bir bağımız var aramızda...</span>
                                    <span className="block text-primary font-semibold">Ama yine de ışık hızında gitmek istiyorsan, buyur! 🚀</span>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Kalsam mı? 😊</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmSignOut}
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                                Çıkış Yap 👋
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }

    // Desktop: Use Dialog
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full font-bold h-10 px-4 bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80 transition-all shadow-sm"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Ayarlar</span>
                        <span className="sm:hidden">Ayarlar</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Ayarlar</DialogTitle>
                        <DialogDescription>
                            Profil ayarlarınızı buradan yönetebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <SettingsContent />
                    <DialogFooter>
                        <SettingsFooter />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sign Out Confirmation Dialog */}
            <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Gerçekten gidiyor musun? 🥺</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-2">
                                <span className="block">Kara deliklerin çekim gücü kadar güçlü bir bağımız var aramızda...</span>
                                <span className="block text-primary font-semibold">Ama yine de ışık hızında gitmek istiyorsan, buyur! 🚀</span>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Kalsam mı? 😊</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSignOut}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                            Çıkış Yap 👋
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
