"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, User, Palette, LogOut, Camera, Upload, Loader2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateUsername, uploadAvatar, uploadCover } from "@/app/profil/actions";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ImageCropperDialog } from "@/components/profile/image-cropper-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileSettingsDialogProps {
    currentUsername: string | null;
    currentFullName: string | null;
    currentBio: string | null;
    currentAvatarUrl: string | null;
    currentCoverUrl: string | null;
    currentWebsite: string | null;
    currentSocialLinks: any | null;
    userEmail: string | null;
}

export function ProfileSettingsDialog({
    currentUsername,
    currentFullName,
    currentBio,
    currentAvatarUrl,
    currentCoverUrl,
    currentWebsite,
    currentSocialLinks,
    userEmail
}: ProfileSettingsDialogProps) {
    const [open, setOpen] = useState(false);
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
            // Update Username independent check
            if (username !== currentUsername) {
                const usernameRes = await updateUsername(username);
                if (!usernameRes.success) {
                    toast.error(usernameRes.error);
                    setIsLoading(false);
                    return;
                }
            }

            // Update Profile Info
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

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-full font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                        <Settings className="w-4 h-4" />
                        <span>Ayarlar</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-2 border-black dark:border-white p-0 overflow-hidden rounded-3xl">
                    <div className="flex flex-col h-[80vh] md:h-auto">

                        {/* Header */}
                        <div className="p-6 border-b-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-between">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Profil Ayarları</DialogTitle>
                            {/* Close button is built-in but we can add custom if needed */}
                        </div>

                        <Tabs defaultValue="profile" className="flex-1 flex flex-col md:flex-row">
                            {/* Sidebar Tabs */}
                            <div className="w-full md:w-48 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-black/10 dark:border-white/10 bg-muted/30 p-2 md:p-4">
                                <TabsList className="flex flex-row md:flex-col h-auto w-full gap-2 bg-transparent">
                                    <TabsTrigger value="profile" className="w-full justify-start gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                                        <User className="w-4 h-4" /> Profil
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="w-full justify-start gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">
                                        <Palette className="w-4 h-4" /> Görünüm
                                    </TabsTrigger>
                                    <TabsTrigger value="account" className="w-full justify-start gap-2 px-3 py-2.5 data-[state=active]:bg-red-500 data-[state=active]:text-white font-bold">
                                        <Settings className="w-4 h-4" /> Hesap
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <TabsContent value="profile" className="space-y-6 mt-0">

                                    {/* Cover & Avatar Edit Sesiion */}
                                    <div className="relative group rounded-xl overflow-hidden border-2 border-black/10 dark:border-white/10">
                                        {/* Cover */}
                                        <div className="h-32 w-full bg-muted relative">
                                            {tempCover ? (
                                                <img src={tempCover} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="sm" className="gap-2" onClick={() => coverInputRef.current?.click()}>
                                                    <Camera className="w-4 h-4" /> Kapak Değiştir
                                                </Button>
                                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "cover")} />
                                            </div>
                                        </div>

                                        {/* Avatar */}
                                        <div className="absolute -bottom-10 left-6">
                                            <div className="w-24 h-24 rounded-full border-4 border-card relative group/avatar">
                                                <Avatar className="w-full h-full">
                                                    <AvatarImage src={tempAvatar || ""} />
                                                    <AvatarFallback>{currentFullName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer text-white" onClick={() => avatarInputRef.current?.click()}>
                                                    <Camera className="w-6 h-6" />
                                                </div>
                                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "avatar")} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-8" />{/* Spacer for avatar overlap */}

                                    {/* Text Inputs */}
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Ad Soyad</Label>
                                                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adın Soyadın" className="border-2 border-black/10 focus-visible:ring-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Kullanıcı Adı</Label>
                                                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="kullaniciadi" className="border-2 border-black/10 focus-visible:ring-primary" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Biyografi</Label>
                                            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Kendinden bahset..." className="min-h-[80px] border-2 border-black/10 focus-visible:ring-primary" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Website</Label>
                                            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." className="border-2 border-black/10 focus-visible:ring-primary" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Sosyal Medya</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="Twitter Username" className="text-xs" />
                                                <Input value={socialLinks.github} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} placeholder="Github Username" className="text-xs" />
                                                <Input value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="Instagram Username" className="text-xs" />
                                                <Input value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="Linkedin Username" className="text-xs" />
                                            </div>
                                        </div>
                                    </div>

                                    <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full bg-[#FFC800] text-black font-bold hover:bg-[#FFC800]/90 h-11">
                                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Değişiklikleri Kaydet
                                    </Button>

                                </TabsContent>

                                <TabsContent value="appearance" className="space-y-6 mt-0">
                                    <div className="text-center py-10 opacity-50">
                                        <Palette className="w-12 h-12 mx-auto mb-3" />
                                        <p>Tema ayarları yakında eklenecek.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="account" className="space-y-6 mt-0">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted/50 rounded-lg border-2 border-black/5">
                                            <p className="text-sm font-bold text-muted-foreground mb-1">E-posta</p>
                                            <p className="font-mono">{userEmail}</p>
                                        </div>
                                        <SignOutButton />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Image Cropper Overlay */}
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
