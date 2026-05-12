"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { Camera, Loader2, ArrowRight, AtSign, User as UserIcon, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DankLogo } from "@/components/brand/dank-logo";
import dynamic from "next/dynamic";
const StarBackground = dynamic(() => import("@/components/background/star-background").then(mod => mod.StarBackground), { ssr: false });

interface OnboardingProfileSetupProps {
    user: any;
    profile: any;
}

export function OnboardingProfileSetup({ user, profile }: OnboardingProfileSetupProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [username, setUsername] = useState(profile?.username || "");
    const [bio, setBio] = useState(profile?.bio || "");

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

        if (username.length < 3) {
            toast.error("Kullanıcı adı en az 3 karakter olmalıdır.");
            return;
        }

        if (!fullName.trim()) {
            toast.error("İsim alanı boş bırakılamaz.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Profilin oluşturuluyor...");

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
                onboarding_completed: true // Finish the onboarding
            });

            if (!updateRes.success) throw new Error(updateRes.error);

            if (username !== profile?.username) {
                const usernameRes = await updateUsername(username);
                if (!usernameRes.success) throw new Error(usernameRes.error);
            }

            toast.success("Profilin hazır! Yönlendiriliyorsun...", { id: toastId });
            router.refresh();
            setTimeout(() => {
                router.push('/');
            }, 1000);

        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls = "w-full h-11 bg-white/[0.05] border-2 border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-neo-yellow/70 focus:bg-white/[0.07] focus:ring-0 rounded-xl transition-all font-mono font-bold text-sm pl-10 pr-4";

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 bg-transparent font-sans relative overflow-hidden selection:bg-neo-yellow/30 selection:text-neo-yellow">
            <StarBackground />

            <div className="w-full max-w-[480px] relative z-10 pt-10 pb-20">
                {/* HEADER */}
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center transform hover:-translate-y-0.5 transition-transform duration-200 scale-[1.3] mb-5">
                        <DankLogo />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
                        PROFİLİNİ TAMAMLA
                    </h1>
                    <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest">
                        Evrene adım atmadan önce sana nasıl sesleneceğimizi seç.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* THE CARD */}
                    <div className="bg-[#292929] border-2 border-white/[0.12] shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] rounded-2xl relative overflow-hidden">
                        
                        {/* COVER PHOTO AREA */}
                        <div 
                            className="relative h-40 sm:h-48 bg-zinc-900 border-b-2 border-white/[0.12] group cursor-pointer overflow-hidden"
                            onClick={() => coverInputRef.current?.click()}
                        >
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                            ) : (
                                <div className="absolute inset-0 bg-white/[0.02]" />
                            )}

                            {/* Default Graphic if no cover */}
                            {!coverPreview && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                    <ImageIcon className="w-12 h-12 text-zinc-600" />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                                <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-white/20 text-xs uppercase tracking-widest">
                                    <Camera className="w-4 h-4" />
                                    <span>Kapak Ekle</span>
                                </div>
                            </div>
                            <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
                        </div>

                        {/* CONTENT AREA */}
                        <div className="px-6 pb-8 sm:px-8 relative pt-14">

                            {/* AVATAR - Overlapping */}
                            <div className="absolute -top-14 left-6 sm:left-8 cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white/[0.12] bg-[#292929] p-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.6)] relative overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1">
                                    <Avatar className="w-full h-full rounded-xl">
                                        <AvatarImage src={avatarPreview} className="object-cover" />
                                        <AvatarFallback className="text-2xl font-black bg-white/[0.05] text-zinc-400">
                                            {fullName?.[0]?.toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Edit Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl m-1 z-20">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                {/* Badge */}
                                <div className="absolute -bottom-1 -right-1 bg-neo-yellow text-black p-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.6)] z-30">
                                    <Upload className="w-3.5 h-3.5 stroke-[3px]" />
                                </div>
                                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                            </div>

                            {/* FORM FIELDS */}
                            <div className="space-y-4">
                                {/* Full Name */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">İsim Soyisim</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            required
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Kullanıcı Adı</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => {
                                                let value = e.target.value.toLowerCase();
                                                value = value.replace(/[^a-z0-9_.-]/g, '');
                                                setUsername(value);
                                            }}
                                            placeholder="kullaniciadi"
                                            required
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-1 mb-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Biyografi</label>
                                        <span className="text-[10px] font-bold text-zinc-600">
                                            {bio.length}/160
                                        </span>
                                    </div>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value.slice(0, 160))}
                                        placeholder="Kısaca kendinden bahset..."
                                        rows={3}
                                        className="w-full bg-white/[0.05] text-white font-mono font-bold text-sm border-2 border-white/[0.08] p-3 rounded-xl focus:outline-none focus:border-neo-yellow/70 focus:bg-white/[0.07] transition-all placeholder:text-zinc-600 resize-none"
                                    />
                                </div>

                                {/* ACTION BUTTON */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-[52px] bg-neo-yellow hover:bg-yellow-300 text-black font-black uppercase tracking-widest text-[13px] rounded-xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                KAYDEDİLİYOR...
                                            </>
                                        ) : (
                                            <>
                                                PROFİLİ TAMAMLA
                                                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                                            </>
                                        )}
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
