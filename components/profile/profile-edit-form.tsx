"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { signOut } from "@/app/auth/actions";
import { Camera, Loader2, X, MapPin, Link as LinkIcon, AtSign, User as UserIcon, ArrowLeft, Save, LogOut, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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

            toast.success("Profil başarıyla güncellendi!");
            router.refresh();
            router.push('/profil');

        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 pb-20">
            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="container max-w-2xl mx-auto px-4 relative z-10 pt-8">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 group"
                    >
                        <div className="bg-white text-black p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_#000] transition-all">
                            <ArrowLeft className="w-5 h-5 stroke-[3px]" />
                        </div>
                        <span className="font-black text-lg hidden sm:block">Geri Dön</span>
                    </button>

                    <h1 className="text-2xl font-black bg-zinc-900 text-white px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_#000] -rotate-1">
                        PROFİLİ DÜZENLE
                    </h1>

                    <div className="w-[42px] sm:w-[100px]" /> {/* Spacer for balance */}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* MAIN CARD */}
                    <div className="bg-[#27272a] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] rounded-xl overflow-hidden relative">

                        {/* COVER PHOTO AREA */}
                        <div className="relative h-48 sm:h-60 bg-zinc-900 border-b-[3px] border-black group cursor-pointer overflow-hidden"
                            onClick={() => coverInputRef.current?.click()}>

                            {coverPreview ? (
                                <Image src={coverPreview} alt="Cover" fill priority sizes="(max-width: 640px) 100vw, 672px" className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC800]/20 via-purple-500/10 to-blue-500/20" />
                            )}

                            {/* Overlay Pattern */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                                    <Camera className="w-5 h-5" />
                                    <span>Kapak Değiştir</span>
                                </div>
                            </div>
                            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
                        </div>

                        {/* CONTENT AREA */}
                        <div className="px-6 pb-8 pt-16 relative">

                            {/* AVATAR - Overlapping */}
                            <div className="absolute -top-16 left-6 cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-[3px] border-black bg-[#27272a] p-1 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
                                    <Avatar className="w-full h-full rounded-xl border border-black/10">
                                        <AvatarImage src={avatarPreview} className="object-cover" />
                                        <AvatarFallback className="text-3xl font-black bg-[#FFC800] text-black">
                                            {profile?.full_name?.[0] || "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                {/* Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] z-30">
                                    <Upload className="w-4 h-4 stroke-[3px]" />
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                            </div>

                            {/* UPDATE USERNAME HINT */}
                            <div className="absolute top-4 right-6 hidden sm:block">
                                <span className="bg-[#FFC800] text-black text-xs font-black px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                                    DÜZENLEME MODU
                                </span>
                            </div>

                            {/* FORM FIELDS */}
                            <div className="space-y-5 mt-4">

                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">İsim Soyisim</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#FFC800] transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#FFC800] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500">Kullanıcı Adı</label>
                                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Dikkatli değiştir</span>
                                    </div>
                                    <div className="relative group">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#23A9FA] transition-colors" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="kullaniciadi"
                                            className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#23A9FA] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500">Biyografi</label>
                                        <span className={cn("text-[10px] font-bold", bio.length > 150 ? "text-red-500" : "text-zinc-500")}>
                                            {bio.length}/160
                                        </span>
                                    </div>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Kendinden bahset..."
                                        rows={3}
                                        className="w-full bg-zinc-900 text-white font-medium border-2 border-black p-4 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#10B981] focus:-translate-y-1 transition-all placeholder:text-zinc-600 resize-none"
                                    />
                                </div>

                                {/* Website & Location */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">Website</label>
                                        <div className="relative group">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#F472B6] transition-colors" />
                                            <input
                                                type="url"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#F472B6] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">Konum</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-[#A78BFA] transition-colors" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="İstanbul, TR"
                                                className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_#A78BFA] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="flex-1 bg-zinc-800 text-white font-black h-12 rounded-lg border-2 border-black hover:bg-zinc-700 active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] bg-[#23A9FA] text-white font-black h-12 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>KAYDEDİLİYOR...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 stroke-[2.5px]" />
                                                <span>KAYDET</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Delete Account / SignOut */}
                                <div className="pt-8 border-t border-dashed border-zinc-700 flex justify-center">
                                    <button
                                        onClick={async () => await signOut()}
                                        type="button"
                                        className="text-red-500 text-sm font-bold hover:underline flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Hesaptan Çıkış Yap
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
