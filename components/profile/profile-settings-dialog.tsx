"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Palette, LogOut, Camera, Twitter, Github, Linkedin, Instagram, Settings2, ShieldCheck, Sparkles } from "lucide-react";
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

    const NeoInput = ({ label, icon, ...props }: any) => (
        <div className="space-y-1.5 group">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-1.5">
                {icon && <span className="text-black/50 dark:text-white/50">{icon}</span>}
                {label}
            </Label>
            <Input
                {...props}
                className={cn(
                    "h-12 border-2 border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 transition-all duration-200 font-medium",
                    "focus:border-black dark:focus:border-white focus:ring-0",
                    "group-hover:border-black/30 dark:group-hover:border-white/30",
                    "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]",
                    "focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
                    "focus:translate-x-[-2px] focus:translate-y-[-2px]",
                    props.className
                )}
            />
        </div>
    );

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {trigger || (
                        <Button variant="outline" className="gap-2 rounded-full font-bold border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                            <Settings2 className="w-4 h-4" />
                            <span>Ayarlar</span>
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent
                    className="max-w-5xl bg-[#f8f8f8] dark:bg-[#050505] border-2 border-black dark:border-white p-0 overflow-hidden rounded-[32px] fixed left-[50%] top-[50%] z-50 w-[95vw] h-[90vh] md:h-[800px] translate-x-[-50%] translate-y-[-50%] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    style={{ transform: "translate(-50%, -50%)" }}
                >
                    <Tabs defaultValue="profile" className="flex flex-col md:flex-row h-full">

                        {/* SIDEBAR */}
                        <div className="w-full md:w-72 bg-white dark:bg-zinc-950 border-b-2 md:border-b-0 md:border-r-2 border-black dark:border-white p-6 flex flex-col justify-between shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-[#FFC800]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="relative z-10">
                                <DialogTitle className="text-4xl font-black uppercase tracking-tighter mb-10 px-2 leading-none">
                                    Profil<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-black/20 to-black/10 dark:from-white/20 dark:to-white/10">Ayarları</span>
                                </DialogTitle>

                                <TabsList className="flex flex-col h-auto w-full gap-3 bg-transparent p-0">
                                    <TabsTrigger value="profile" className="w-full justify-start gap-3 px-4 py-4 rounded-xl border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-[#FFC800] data-[state=active]:text-black font-bold text-lg transition-all shadow-none hover:bg-black/5 dark:hover:bg-white/5 data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] data-[state=active]:hover:bg-[#FFC800] [&>svg]:data-[state=active]:stroke-[3px]">
                                        <User className="w-5 h-5" /> Kimlik
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="w-full justify-start gap-3 px-4 py-4 rounded-xl border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-[#FF90E8] data-[state=active]:text-black font-bold text-lg transition-all shadow-none hover:bg-black/5 dark:hover:bg-white/5 data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] data-[state=active]:hover:bg-[#FF90E8] [&>svg]:data-[state=active]:stroke-[3px]">
                                        <Palette className="w-5 h-5" /> Görünüm
                                    </TabsTrigger>
                                    <TabsTrigger value="account" className="w-full justify-start gap-3 px-4 py-4 rounded-xl border-2 border-transparent data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:bg-[#FF4D4D] data-[state=active]:text-black font-bold text-lg transition-all shadow-none hover:bg-black/5 dark:hover:bg-white/5 data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:data-[state=active]:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] data-[state=active]:hover:bg-[#FF4D4D] [&>svg]:data-[state=active]:stroke-[3px]">
                                        <ShieldCheck className="w-5 h-5" /> Hesap
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="hidden md:block relative z-10">
                                <div className="p-4 rounded-xl bg-muted/30 border-2 border-dashed border-black/10 dark:border-white/10 text-[10px] text-muted-foreground font-mono leading-relaxed">
                                    <strong className="text-foreground">FizikHub</strong> v2.0<br />
                                    Build: Neo-Genesis<br />
                                    ID: {userEmail?.split('@')[0]}
                                </div>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex-1 bg-[#FAFAFA] dark:bg-[#09090b] overflow-y-auto relative p-6 md:p-10">

                            <TabsContent value="profile" className="space-y-8 mt-0 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* COVER & AVATAR EDIT */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-[#FFC800]" />
                                            Görsel Kimlik
                                        </h3>
                                        <span className="text-xs font-bold bg-black/5 dark:bg-white/10 px-2 py-1 rounded text-muted-foreground">PREVIEW</span>
                                    </div>

                                    <div className="rounded-2xl overflow-hidden border-2 border-black dark:border-white bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                        {/* Cover Area */}
                                        <div className="h-40 w-full bg-muted relative group cursor-pointer overflow-hidden">
                                            {tempCover ? (
                                                <img src={tempCover} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-xy" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2 backdrop-blur-sm" onClick={() => coverInputRef.current?.click()}>
                                                <Button variant="secondary" className="font-bold border-2 border-transparent hover:border-white shadow-xl">
                                                    <Camera className="w-4 h-4 mr-2" /> Kapak Değiştir
                                                </Button>
                                            </div>
                                            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "cover")} />
                                        </div>

                                        {/* Avatar Area */}
                                        <div className="px-6 pb-6 relative">
                                            <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white dark:border-black bg-black shadow-lg overflow-hidden group/avatar cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage src={tempAvatar || ""} className="object-cover" />
                                                    <AvatarFallback className="rounded-none text-2xl font-black bg-neutral-900 text-neutral-500">{fullName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-200">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "avatar")} />
                                            </div>
                                            <div className="ml-28 mt-2 space-y-1">
                                                <h4 className="font-black text-lg leading-none">{fullName || "İsimsiz"}</h4>
                                                <p className="text-sm text-muted-foreground font-mono">@{username || "kullanici"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-black/10 dark:bg-white/10 border-t border-dashed border-black/10 dark:border-white/10" />

                                {/* PUBLIC INFO FORM */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black uppercase tracking-tight">Kişisel Bilgiler</h3>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <NeoInput
                                            label="Ad Soyad"
                                            value={fullName}
                                            onChange={(e: any) => setFullName(e.target.value)}
                                            placeholder="Örn: Baran Bozkurt"
                                        />
                                        <NeoInput
                                            label="Kullanıcı Adı"
                                            value={username}
                                            onChange={(e: any) => setUsername(e.target.value)}
                                            placeholder="Örn: baranbozkurt"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Biyografi</Label>
                                        <Textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Kendinden bahset..."
                                            className="min-h-[100px] border-2 border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-black/20 focus:border-black dark:focus:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all resize-none font-medium p-4"
                                        />
                                    </div>

                                    <NeoInput
                                        label="Website"
                                        value={website}
                                        onChange={(e: any) => setWebsite(e.target.value)}
                                        placeholder="https://fizikhub.com"
                                    />
                                </div>

                                <div className="h-px bg-black/10 dark:bg-white/10 border-t border-dashed border-black/10 dark:border-white/10" />

                                {/* SOCIAL LINKS */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black uppercase tracking-tight">Sosyal Medya</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <NeoInput
                                            label="Twitter"
                                            icon={<Twitter className="w-3 h-3" />}
                                            value={socialLinks.twitter}
                                            onChange={(e: any) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                                            placeholder="Kullanıcı adı"
                                        />
                                        <NeoInput
                                            label="GitHub"
                                            icon={<Github className="w-3 h-3" />}
                                            value={socialLinks.github}
                                            onChange={(e: any) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                                            placeholder="Kullanıcı adı"
                                        />
                                        <NeoInput
                                            label="Instagram"
                                            icon={<Instagram className="w-3 h-3" />}
                                            value={socialLinks.instagram}
                                            onChange={(e: any) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                                            placeholder="Kullanıcı adı"
                                        />
                                        <NeoInput
                                            label="LinkedIn"
                                            icon={<Linkedin className="w-3 h-3" />}
                                            value={socialLinks.linkedin}
                                            onChange={(e: any) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                                            placeholder="Kullanıcı adı"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 pb-10">
                                    <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto md:min-w-[200px] bg-[#FFC800] text-black font-black text-lg py-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all">
                                        {isLoading && <span className="animate-spin mr-2">⏳</span>}
                                        DEĞİŞİKLİKLERİ KAYDET
                                    </Button>
                                </div>

                            </TabsContent>

                            <TabsContent value="appearance" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                        <Palette className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold">Tema Ayarları</h3>
                                    <p className="max-w-xs text-center text-muted-foreground">Bu özellik çok yakında FizikHub v2.1 ile birlikte gelecek.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="account" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Hesap Güvenliği</h3>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase font-bold text-red-400">Kayıtlı E-Posta</Label>
                                        <div className="font-mono text-lg">{userEmail}</div>
                                    </div>
                                    <div className="pt-4">
                                        <SignOutButton />
                                    </div>
                                </div>
                            </TabsContent>

                        </div>
                    </Tabs>
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
