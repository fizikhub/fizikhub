"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { signOut } from "@/app/auth/actions"; // Import from main auth actions file
import { Camera, Loader2, Save, Upload, Image as ImageIcon, Ruler, Monitor, LogOut, ChevronLeft, MapPin, Link as LinkIcon, AtSign, User as UserIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileEditFormProps {
    user: any;
    profile: any;
}

export function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [username, setUsername] = useState(profile?.username || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [website, setWebsite] = useState(profile?.website || "");
    const [location, setLocation] = useState(profile?.location || "");

    // Image States
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState(profile?.cover_url || "");

    // Scale/Position States
    const [avatarScale, setAvatarScale] = useState<number>(1);
    const [coverScale, setCoverScale] = useState<number>(1);

    // Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setAvatarScale(1);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
            setCoverScale(1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Upload Images if changed
            if (avatarFile) {
                const res = await uploadAvatar(avatarFile);
                if (!res.success) throw new Error(res.error);
            }

            if (coverFile) {
                const res = await uploadCover(coverFile);
                if (!res.success) throw new Error(res.error);
            }

            // 2. Update Basic Info
            const updateRes = await updateProfile({
                full_name: fullName,
                bio: bio,
                website: website,
                location: location,
            });

            if (!updateRes.success) throw new Error(updateRes.error);

            // 3. Update Username (separate check)
            if (username !== profile.username) {
                const usernameRes = await updateUsername(username);
                if (!usernameRes.success) throw new Error(usernameRes.error);
            }

            toast.success("Profil başarıyla güncellendi ✨");

            router.refresh();
            router.push('/profil');

        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            toast.error("Çıkış yapılırken bir hata oluştu.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-muted">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Profili Düzenle</h1>
                        <p className="text-muted-foreground text-sm">Görünümünü ve bilgilerini güncelle</p>
                    </div>
                </div>

                <Button variant="destructive" size="sm" onClick={handleSignOut} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Çıkış Yap</span>
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. VISUAL IDENTITY SECTION */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Görsel Kimlik
                        </h2>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border border-border shadow-sm h-48 sm:h-64 bg-muted/30">
                        {/* Cover Photo */}
                        {coverPreview ? (
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
                                style={{
                                    backgroundImage: `url(${coverPreview})`,
                                    transform: `scale(${coverScale})`
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                                <span className="text-sm font-medium opacity-60">Kapak Fotoğrafı Yok</span>
                            </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                            <Button
                                type="button"
                                variant="secondary"
                                className="gap-2 shadow-lg"
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4" />
                                Kapak Değiştir
                            </Button>

                            {coverPreview && (
                                <div className="bg-black/60 p-3 rounded-full backdrop-blur-md flex items-center gap-3 w-48 animate-in fade-in slide-in-from-bottom-4">
                                    <Ruler className="w-4 h-4 text-white/80" />
                                    <Slider
                                        value={[coverScale]}
                                        min={1}
                                        max={2}
                                        step={0.1}
                                        onValueChange={(value: number[]) => setCoverScale(value[0])}
                                        className="flex-1"
                                    />
                                </div>
                            )}
                        </div>
                        <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
                    </div>

                    {/* Avatar - Overlapping */}
                    <div className="relative -mt-16 ml-6 sm:ml-10 flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background overflow-hidden bg-muted shadow-xl relative z-10">
                                {avatarPreview ? (
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${avatarPreview})`,
                                            transform: `scale(${avatarScale})`
                                        }}
                                    />
                                ) : (
                                    <Avatar className="w-full h-full rounded-none">
                                        <AvatarFallback className="rounded-none text-2xl">
                                            {profile?.full_name?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full w-10 h-10 shadow-lg"
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        <Camera className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                            <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                        </div>

                        {avatarPreview && (
                            <div className="mb-2 hidden sm:block w-48">
                                <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">Profil Zoom</p>
                                <Slider
                                    value={[avatarScale]}
                                    min={1}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(value: number[]) => setAvatarScale(value[0])}
                                />
                            </div>
                        )}
                    </div>
                </section>

                <div className="h-px bg-border/50" />

                {/* 2. PERSONAL INFO SECTION */}
                <section className="space-y-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        Kişisel Bilgiler
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                        <div className="space-y-2.5">
                            <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">İsim Soyisim</Label>
                            <div className="relative">
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Adınız Soyadınız"
                                    className="pl-3 h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary focus:ring-0 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Kullanıcı Adı</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <AtSign className="w-5 h-5" />
                                </div>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary focus:ring-0 transition-all"
                                    placeholder="kullaniciadi"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground ml-1">
                                *Sadece 1 kez değiştirilebilir.
                            </p>
                        </div>

                        <div className="space-y-2.5 md:col-span-2">
                            <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Biyografi</Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Kendinden, ilgi alanlarından veya çalışmalarından bahset..."
                                className="bg-muted/40 border-muted-foreground/20 min-h-[120px] resize-none focus:border-primary focus:ring-0 transition-all p-4 leading-relaxed"
                            />
                            <p className="text-[10px] text-right text-muted-foreground">
                                {bio.length}/160
                            </p>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Website</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <Input
                                    id="website"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://seninsiten.com"
                                    className="pl-10 h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary focus:ring-0 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Konum</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="İstanbul, Türkiye"
                                    className="pl-10 h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary focus:ring-0 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border/50" />

                {/* 3. THEME & SAVE */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary" />
                            Arayüz Teması
                        </h2>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">Yakında</span>
                    </div>

                    <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-dashed border-border">
                        {['#1E3A5F', '#7c3aed', '#db2777', '#059669', '#d97706', '#000000'].map((color) => (
                            <button
                                key={color}
                                type="button"
                                className="w-10 h-10 rounded-full border-2 border-white/20 hover:scale-110 transition-transform shadow-sm relative group"
                                style={{ backgroundColor: color }}
                                onClick={() => toast.info("Tema değiştirme özelliği çok yakında!")}
                            >
                                <div className="absolute inset-0 rounded-full ring-2 ring-white/0 group-hover:ring-white/20 transition-all" />
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sticky Mobile Save Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border sm:static sm:bg-transparent sm:border-0 sm:p-0 z-50">
                    <div className="max-w-4xl mx-auto flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1 sm:flex-none border-foreground/10"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] sm:flex-none sm:min-w-[150px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Değişiklikleri Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

// Helper icon
function User(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
