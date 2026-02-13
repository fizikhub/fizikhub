"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/auth/actions";
import { DankLogo } from "@/components/brand/dank-logo";
import { createClient } from "@/lib/supabase";
import { StarBackground } from "@/components/background/star-background";
import { MultiStepOnboarding } from "@/components/onboarding/multi-step-onboarding";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        // Check if user already completed onboarding
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile?.onboarding_completed) {
                    router.push('/profil');
                }
            }
        };
        checkStatus();
    }, [router, supabase]);

    const handleComplete = async (formData: any) => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("avatarUrl", formData.avatarUrl);
            formDataToSend.append("bio", formData.bio);

            const result = await completeOnboarding(formDataToSend);

            if (result?.success) {
                toast.success("Profilin başarıyla oluşturuldu! Şimdi evrene fırlatılıyorsun...");
                router.push('/profil');
            } else {
                toast.error(result?.error || "Evrensel bir hata oluştu. Lütfen tekrar dene.");
            }
        } catch (error) {
            toast.error("İletişim kopukluğu! Karadelikler sinyali bozmuş olabilir.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020205] font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Universal Star Background */}
            <StarBackground />

            {/* Logo and Header positioning for the Tour */}
            <div className="fixed top-8 sm:top-12 left-0 right-0 flex flex-col items-center z-10">
                <div className="transform hover:scale-110 transition-transform duration-500 cursor-pointer">
                    <DankLogo />
                </div>
                <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
            </div>

            <MultiStepOnboarding onComplete={handleComplete} loading={loading} />

            {/* Visual Depth Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        </div>
    );
}
