"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadAvatar, uploadCover, updateProfile, updateUsername } from "@/app/profil/actions";
import { Camera, Loader2, ArrowRight, AtSign, User as UserIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

    return (
        <div className="min-h-screen font-sans bg-[#0a0a0a] relative selection:bg-orange-500/30">
            {/* NOISE TEXTURE */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="container max-w-2xl mx-auto px-4 relative z-10 pt-12 pb-20">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                        PROFİLİNİ TAMAMLA
                    </h1>
                    <p className="text-zinc-500 font-bold text-sm">
                        Evrene adım atmadan önce sana nasıl sesleneceğimizi seç.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* MAIN CARD */}
                    <div className="bg-[#27272a] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] rounded-xl overflow-hidden relative">

                        {/* COVER PHOTO AREA */}
                        <div className="relative h-48 sm:h-60 bg-zinc-900 border-b-[3px] border-black group cursor-pointer overflow-hidden"
                            onClick={() => coverInputRef.current?.click()}>

                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-purple-500/10 to-blue-500/20" />
                            )}

                            {/* Overlay Pattern */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                                    <Camera className="w-5 h-5" />
                                    <span>Kapak Fotoğrafı Ekle</span>
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
                                        <AvatarFallback className="text-3xl font-black bg-orange-500 text-black">
                                            {fullName?.[0] || "?"}
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

                            {/* FORM FIELDS */}
                            <div className="space-y-6 mt-6">

                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500 ml-1">İsim Soyisim</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            required
                                            className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:border-orange-500 focus:shadow-[4px_4px_0px_0px_#ea580c] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500">Kullanıcı Adı</label>
                                    </div>
                                    <div className="relative group">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
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
                                            className="w-full bg-zinc-900 text-white font-bold border-2 border-black h-12 pl-12 pr-4 rounded-lg focus:outline-none focus:border-orange-500 focus:shadow-[4px_4px_0px_0px_#ea580c] focus:-translate-y-1 transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-black uppercase tracking-wider text-zinc-500">Biyografi (İsteğe Bağlı)</label>
                                        <span className="text-[10px] font-bold text-zinc-500">
                                            {bio.length}/160
                                        </span>
                                    </div>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value.slice(0, 160))}
                                        placeholder="Kısaca kendinden bahset... (Laboratuvardaki ilk gününmüş gibi)"
                                        rows={3}
                                        className="w-full bg-zinc-900 text-white font-medium border-2 border-black p-4 rounded-lg focus:outline-none focus:border-orange-500 focus:shadow-[4px_4px_0px_0px_#ea580c] focus:-translate-y-1 transition-all placeholder:text-zinc-600 resize-none"
                                    />
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-orange-600 text-white font-black uppercase tracking-widest text-sm h-14 rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#000] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                KAYDEDİLİYOR...
                                            </>
                                        ) : (
                                            <>
                                                BAŞLA
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
