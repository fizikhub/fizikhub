"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Twitter, Github, Linkedin, Instagram, Settings2, Save, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateUsername, uploadAvatar, uploadCover } from "@/app/profil/actions";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ImageCropperDialog } from "@/components/profile/image-cropper-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";


interface ProfileSettingsDialogProps {
    currentUsername: string | null;
    currentFullName: string | null;
    currentBio: string | null;
    currentAvatarUrl: string | null;
    currentCoverUrl: string | null;
    currentWebsite: string | null;
    currentSocialLinks: any | null;
    userEmail: string | null;
    trigger?: React.ReactNode;
}

export function ProfileSettingsDialog({
    currentUsername,
    currentFullName,
    currentBio,
    currentAvatarUrl,
    currentCoverUrl,
    currentWebsite,
    currentSocialLinks,
    userEmail,
    trigger
}: ProfileSettingsDialogProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [fullName, setFullName] = useState(currentFullName || "");
    const [username, setUsername] = useState(currentUsername || "");
    const [bio, setBio] = useState(currentBio || "");
    const [website, setWebsite] = useState(currentWebsite || "");
    const [socialLinks, setSocialLinks] = useState(currentSocialLinks || { twitter: "", github: "", instagram: "", linkedin: "" });

    // Image States
    const [tempAvatar, setTempAvatar] = useState<string | null>(currentAvatarUrl);
    const [tempCover, setTempCover] = useState<string | null>(currentCoverUrl);

    // Cropper States
    const [cropperOpen, setCropperOpen] = useState(false);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [cropperType, setCropperType] = useState<"avatar" | "cover">("avatar");

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setCropperImage(reader.result as string);
                setCropperType(type);
                setCropperOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = async (croppedBlob: Blob) => {
        setIsLoading(true);
        try {
            const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });

            if (cropperType === "avatar") {
                const res = await uploadAvatar(file);
                if (res.success) {
                    setTempAvatar(URL.createObjectURL(croppedBlob));
                    toast.success("Profil fotoğrafı güncellendi");
                } else {
                    toast.error(res.error || "Hata oluştu");
                }
            } else {
                const res = await uploadCover(file);
                if (res.success) {
                    setTempCover(URL.createObjectURL(croppedBlob));
                    toast.success("Kapak fotoğrafı güncellendi");
                } else {
                    toast.error(res.error || "Hata oluştu");
                }
            }
        } catch (error) {
            toast.error("Yükleme sırasında hata oluştu");
        } finally {
            setIsLoading(false);
            setCropperOpen(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            if (username !== currentUsername) {
                const usernameRes = await updateUsername(username);
                if (!usernameRes.success) {
                    toast.error(usernameRes.error);
                    setIsLoading(false);
                    return;
                }
            }

            const res = await updateProfile({
                full_name: fullName,
                bio: bio,
                website: website,
                social_links: socialLinks
            });

            if (res.success) {
                toast.success("Profil bilgileri kaydedildi");
                setOpen(false);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const SettingsForm = () => (
        <div className="space-y-6 pb-24 md:pb-0">
            {/* 1. VISUAL IDENTITY */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-muted-foreground tracking-wider mb-2">Görsel Kimlik</h3>

                {/* Cover & Avatar Combo */}
                <div className="relative group rounded-xl overflow-hidden border border-border">
                    {/* Cover */}
                    <div className="h-32 bg-muted relative">
                        {tempCover ? (
                            <img src={tempCover} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900" />
                        )}
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Camera className="text-white w-6 h-6 drop-shadow-md" />
                        </button>
                        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "cover")} />
                    </div>

                    {/* Avatar */}
                    <div className="absolute -bottom-6 left-4">
                        <div className="w-20 h-20 rounded-full border-[3px] border-background bg-background relative group/avatar cursor-pointer overflow-hidden" onClick={() => avatarInputRef.current?.click()}>
                            <Avatar className="w-full h-full">
                                <AvatarImage src={tempAvatar || ""} className="object-cover" />
                                <AvatarFallback>{fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                <Camera className="text-white w-4 h-4" />
                            </div>
                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "avatar")} />
                        </div>
                    </div>

                    <div className="h-8 bg-background" /> {/* Spacer for avatar overlap */}
                </div>
            </div>

            {/* 2. PUBLIC INFO */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-muted-foreground tracking-wider mb-2">Genel Bilgiler</h3>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Ad Soyad</Label>
                            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ad Soyad" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Kullanıcı Adı</Label>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="kullanici" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Biyografi</Label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Kendinden bahset..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Website</Label>
                        <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
                    </div>
                </div>
            </div>

            {/* 3. SOCIAL LINKS */}
            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-muted-foreground tracking-wider mb-2">Sosyal Medya</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Twitter className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="Twitter" />
                    </div>
                    <div className="relative">
                        <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9" value={socialLinks.github} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} placeholder="GitHub" />
                    </div>
                    <div className="relative">
                        <Instagram className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="Instagram" />
                    </div>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-9" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="LinkedIn" />
                    </div>
                </div>
            </div>

            {/* 4. ACCOUNT & ACTIONS (Sticky on Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur-md md:static md:bg-transparent md:border-0 md:p-0 flex flex-col gap-3 z-50">
                <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full bg-[#FFC800] text-black hover:bg-[#FFC800]/90 font-bold h-12 rounded-xl text-base">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Kaydet
                </Button>

                <div className="md:hidden">
                    <SignOutButton />
                </div>
            </div>

            <div className="hidden md:block pt-4 border-t">
                <SignOutButton />
            </div>
        </div>
    );

    // --- RENDER ---
    // Mobile: Sheet (Bottom Drawer style)
    if (isMobile) {
        return (
            <>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        {trigger || (
                            <Button variant="outline" size="sm" className="gap-2">
                                <Settings2 className="w-4 h-4" />
                                <span>Düzenle</span>
                            </Button>
                        )}
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] px-0 flex flex-col">
                        <SheetHeader className="px-6 pb-4 border-b">
                            <SheetTitle>Profili Düzenle</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <SettingsForm />
                        </div>
                    </SheetContent>
                </Sheet>
                <ImageCropperDialog
                    open={cropperOpen}
                    onOpenChange={setCropperOpen}
                    imageSrc={cropperImage}
                    aspectRatio={cropperType === "avatar" ? 1 : 16 / 5}
                    onCropComplete={handleCropComplete}
                />
            </>
        );
    }

    // Desktop: Clean Dialog
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {trigger || (
                        <Button variant="outline" className="gap-2">
                            <Settings2 className="w-4 h-4" />
                            <span>Ayarlar</span>
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl border-2 border-black">
                    <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                        <DialogTitle className="text-xl font-black uppercase">Profili Düzenle</DialogTitle>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <SettingsForm />
                    </div>
                </DialogContent>
            </Dialog>

            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={cropperImage}
                aspectRatio={cropperType === "avatar" ? 1 : 16 / 5}
                onCropComplete={handleCropComplete}
            />
        </>
    );
}
