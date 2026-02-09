"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { signOut } from "@/app/auth/actions";
import { Camera, Loader2, X, MapPin, Link as LinkIcon, AtSign, User as UserIcon, ArrowLeft, Sparkles, LogOut, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileEditFormProps {
    user: any;
    profile: any;
}

export function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<"info" | "visuals">("info");

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

    // Refs
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (avatarFile) {
                const res = await uploadAvatar(avatarFile);
                if (!res.success) throw new Error(res.error);
            }

            if (coverFile) {
                const res = await uploadCover(coverFile);
                if (!res.success) throw new Error(res.error);
            }

            const updateRes = await updateProfile({
                full_name: fullName,
                bio: bio,
                website: website,
                location: location,
            });

            if (!updateRes.success) throw new Error(updateRes.error);

            if (username !== profile.username) {
                const usernameRes = await updateUsername(username);
                if (!usernameRes.success) throw new Error(usernameRes.error);
            }

            toast.success("Profil güncellendi!");
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
        } catch {
            toast.error("Çıkış yapılırken bir hata oluştu.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
            {/* HEADER */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Geri</span>
                    </button>

                    <h1 className="font-head text-lg tracking-tight">PROFİL DÜZENLE</h1>

                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Çıkış</span>
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* COVER & AVATAR HERO SECTION */}
                    <section className="relative">
                        {/* Cover */}
                        <div
                            className={cn(
                                "relative h-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-white/10",
                                "bg-gradient-to-br from-zinc-800 to-zinc-900 group cursor-pointer"
                            )}
                            onClick={() => coverInputRef.current?.click()}
                        >
                            {coverPreview ? (
                                <img
                                    src={coverPreview}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                                    <Camera className="w-10 h-10 mb-2" />
                                    <span className="text-sm font-medium">Kapak Fotoğrafı Ekle</span>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                                    <Camera className="w-4 h-4" />
                                    <span className="text-sm font-medium">Değiştir</span>
                                </div>
                            </div>
                            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
                        </div>

                        {/* Avatar - Overlapping */}
                        <div className="absolute -bottom-12 left-6">
                            <div
                                className={cn(
                                    "relative w-24 h-24 rounded-2xl border-4 border-black overflow-hidden",
                                    "bg-zinc-800 cursor-pointer group shadow-2xl"
                                )}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30">
                                        <UserIcon className="w-10 h-10" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                            </div>
                        </div>
                    </section>

                    {/* Spacer for avatar overlap */}
                    <div className="h-8" />

                    {/* TABS */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                        <button
                            type="button"
                            onClick={() => setActiveSection("info")}
                            className={cn(
                                "flex-1 py-2.5 rounded-lg font-medium text-sm transition-all",
                                activeSection === "info"
                                    ? "bg-white text-black shadow-lg"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            Bilgiler
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveSection("visuals")}
                            className={cn(
                                "flex-1 py-2.5 rounded-lg font-medium text-sm transition-all",
                                activeSection === "visuals"
                                    ? "bg-white text-black shadow-lg"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            Görünüm
                        </button>
                    </div>

                    {/* INFO SECTION */}
                    <AnimatePresence mode="wait">
                        {activeSection === "info" && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">İsim</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Adınız Soyadınız"
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl",
                                            "bg-white/5 border border-white/10",
                                            "text-white placeholder:text-white/30",
                                            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                            "transition-all"
                                        )}
                                    />
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Kullanıcı Adı</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="kullaniciadi"
                                            className={cn(
                                                "w-full h-12 pl-10 pr-4 rounded-xl",
                                                "bg-white/5 border border-white/10",
                                                "text-white placeholder:text-white/30",
                                                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                                "transition-all"
                                            )}
                                        />
                                    </div>
                                    <p className="text-[10px] text-amber-400/70 ml-1">⚠️ Sadece 1 kez değiştirilebilir</p>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/50">Biyografi</label>
                                        <span className={cn(
                                            "text-xs",
                                            bio.length > 140 ? "text-amber-400" : "text-white/30"
                                        )}>
                                            {bio.length}/160
                                        </span>
                                    </div>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value.slice(0, 160))}
                                        placeholder="Kendinden biraz bahset..."
                                        rows={4}
                                        className={cn(
                                            "w-full p-4 rounded-xl resize-none",
                                            "bg-white/5 border border-white/10",
                                            "text-white placeholder:text-white/30",
                                            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                            "transition-all leading-relaxed"
                                        )}
                                    />
                                </div>

                                {/* Website & Location Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/50">Website</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                type="url"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder="site.com"
                                                className={cn(
                                                    "w-full h-12 pl-10 pr-4 rounded-xl",
                                                    "bg-white/5 border border-white/10",
                                                    "text-white placeholder:text-white/30",
                                                    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                                    "transition-all"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/50">Konum</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="İstanbul"
                                                className={cn(
                                                    "w-full h-12 pl-10 pr-4 rounded-xl",
                                                    "bg-white/5 border border-white/10",
                                                    "text-white placeholder:text-white/30",
                                                    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                                                    "transition-all"
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === "visuals" && (
                            <motion.div
                                key="visuals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Theme Selection */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/50">Profil Teması</label>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">Yakında</span>
                                    </div>

                                    <div className="grid grid-cols-6 gap-3">
                                        {[
                                            { name: "Koyu", color: "#000000", active: true },
                                            { name: "Mor", color: "#7c3aed" },
                                            { name: "Mavi", color: "#2563eb" },
                                            { name: "Yeşil", color: "#059669" },
                                            { name: "Turuncu", color: "#ea580c" },
                                            { name: "Pembe", color: "#db2777" },
                                        ].map((theme) => (
                                            <button
                                                key={theme.name}
                                                type="button"
                                                onClick={() => toast.info("Tema değiştirme yakında!")}
                                                className={cn(
                                                    "aspect-square rounded-xl border-2 transition-all relative group",
                                                    theme.active
                                                        ? "border-white scale-105"
                                                        : "border-transparent hover:border-white/30 opacity-50"
                                                )}
                                                style={{ backgroundColor: theme.color }}
                                            >
                                                {theme.active && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Check className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Badge Display */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50">Öne Çıkan Rozet</label>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-white/40">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-sm">Rozet sistemi yakında aktif olacak</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* STICKY SAVE BUTTON */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
                        <div className="max-w-2xl mx-auto flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className={cn(
                                    "flex-1 h-12 rounded-xl font-medium",
                                    "bg-white/5 border border-white/10 text-white/70",
                                    "hover:bg-white/10 transition-all"
                                )}
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "flex-[2] h-12 rounded-xl font-bold",
                                    "bg-primary text-black",
                                    "hover:bg-primary/90 transition-all",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "flex items-center justify-center gap-2"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Kaydediliyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Kaydet</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Bottom padding for sticky button */}
                    <div className="h-24" />

                </form>
            </main>
        </div>
    );
}
