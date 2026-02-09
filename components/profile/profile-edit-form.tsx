"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { Camera, Loader2, Save, Upload, Image as ImageIcon, Ruler, Monitor, Smartphone } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

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
            setAvatarScale(1); // Reset scale
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
            setCoverScale(1); // Reset scale
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Upload Images if changed
            let newAvatarUrl = profile.avatar_url;
            let newCoverUrl = profile.cover_url;

            if (avatarFile) {
                const res = await uploadAvatar(avatarFile);
                if (!res.success) throw new Error(res.error);
                // Note: The action updates the DB, so we don't strictly need the URL back if we revalidate, 
                // but ideally the action should return it. For now, we trust the action.
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

            toast.success("Profiliniz güncellendi.");

            router.refresh();
            router.push('/profil');

        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">

            {/* 1. IMAGES SECTION */}
            <div className="space-y-6">

                {/* Cover Photo Editor */}
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Kapak Fotoğrafı
                    </Label>

                    <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors h-48 sm:h-64 bg-muted/30">
                        {coverPreview ? (
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-100"
                                style={{
                                    backgroundImage: `url(${coverPreview})`,
                                    transform: `scale(${coverScale})`
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Kapak fotoğrafı yükle</span>
                            </div>
                        )}

                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Fotoğraf Seç
                            </Button>

                            {coverPreview && (
                                <div className="w-1/2 bg-black/50 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-white" />
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
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleCoverChange}
                        />
                    </div>
                </div>

                {/* Avatar Editor */}
                <div className="flex items-start gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Camera className="w-4 h-4" /> Profil Fotoğrafı
                        </Label>

                        <div className="relative group w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-muted/30">
                            {avatarPreview ? (
                                <div
                                    className="w-full h-full bg-cover bg-center transition-transform duration-100"
                                    style={{
                                        backgroundImage: `url(${avatarPreview})`,
                                        transform: `scale(${avatarScale})`
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <User className="w-8 h-8 opacity-50" />
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-full w-8 h-8"
                                    onClick={() => avatarInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4" />
                                </Button>
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {avatarPreview && (
                            <div className="w-32 mt-2">
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

                    <div className="flex-1 space-y-4 pt-6">
                        <p className="text-sm text-muted-foreground">
                            Kare, yüksek çözünürlüklü bir fotoğraf önerilir.
                            Minimum 400x400px.
                        </p>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* 2. TEXT FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName">İsim Soyisim</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Örn: Baran Bozkurt"
                        className="bg-muted/30"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground font-bold text-sm">@</span>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-7 bg-muted/30"
                            placeholder="kullaniciadi"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        Kullanıcı adınızı sadece 1 kez değiştirebilirsiniz.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biyografi</Label>
                    <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Kendinizden bahsedin..."
                        className="bg-muted/30 min-h-[100px] resize-none"
                    />
                    <p className="text-[10px] text-right text-muted-foreground">
                        {bio.length}/160
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="bg-muted/30"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Konum</Label>
                    <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="İstanbul, Türkiye"
                        className="bg-muted/30"
                    />
                </div>
            </div>

            {/* 3. THEME SELECTION (Visual only for now if no backend support) */}
            <div className="space-y-4">
                <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Tema Rengi
                </Label>
                <div className="flex gap-3">
                    {['#1E3A5F', '#7c3aed', '#db2777', '#059669', '#d97706'].map((color) => (
                        <button
                            key={color}
                            type="button"
                            className="w-8 h-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform ring-offset-2 focus:ring-2"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                toast.message("Tema Seçildi", { description: "Bu özellik yakında aktif olacak!" });
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4 sticky bottom-0 bg-background/80 backdrop-blur-md p-4 -mx-4 -mb-4 border-t border-border mt-8 z-10">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    İptal
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#1E3A5F] hover:bg-[#2C5282] text-white min-w-[120px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Kaydediliyor
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                        </>
                    )}
                </Button>
            </div>

        </form>
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
