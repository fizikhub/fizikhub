"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// Slot sembolleri ve ağırlıkları (bazıları daha nadir)
const SYMBOLS = ["🚀", "⚛️", "🔬", "🧪", "🌟"];
const SYMBOL_WEIGHTS = [25, 25, 25, 20, 5]; // 🌟 daha nadir

function getRandomSymbol(): string {
    const totalWeight = SYMBOL_WEIGHTS.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < SYMBOLS.length; i++) {
        random -= SYMBOL_WEIGHTS[i];
        if (random <= 0) return SYMBOLS[i];
    }
    return SYMBOLS[0];
}

function spinReels(): [string, string, string] {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
}

function calculateWinnings(reels: [string, string, string], bet: number): { multiplier: number; winnings: number; matchType: string } {
    const [a, b, c] = reels;

    // 3 aynı = jackpot
    if (a === b && b === c) {
        // 🌟 jackpot bonus
        const multiplier = a === "🌟" ? 25 : 10;
        return { multiplier, winnings: bet * multiplier, matchType: "jackpot" };
    }

    // 2 aynı = küçük kazanç
    if (a === b || b === c || a === c) {
        return { multiplier: 2, winnings: bet * 2, matchType: "match2" };
    }

    // Hiç eşleşme yok = kayıp
    return { multiplier: 0, winnings: 0, matchType: "lose" };
}

export async function getUserBalance() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { balance: 0, error: "Oturum açmanız gerekiyor" };

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("reputation")
        .eq("id", user.id)
        .single();

    if (error || !profile) return { balance: 0, error: "Profil bulunamadı" };

    return { balance: profile.reputation, error: null };
}

export async function playSlot(betAmount: number = 5) {
    const supabase = await createClient();

    // Kullanıcı kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Oturum açmanız gerekiyor" };
    }

    // Bakiye kontrolü
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("reputation")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
        return { success: false, error: "Profil bulunamadı" };
    }

    if (profile.reputation < betAmount) {
        return { success: false, error: `Yetersiz bakiye. En az ${betAmount} hubpuan gerekli.` };
    }

    // Slot çevir
    const reels = spinReels();
    const result = calculateWinnings(reels, betAmount);

    // Puan değişimi hesapla
    const netChange = result.matchType === "lose"
        ? -betAmount  // Kaybetti: bahis miktarı kadar düş
        : result.winnings - betAmount; // Kazandı: net kazanç (kazanç - bahis)

    // Puanı güncelle
    const { error: updateError } = await supabase.rpc("add_reputation", {
        p_user_id: user.id,
        p_points: netChange,
        p_reason: result.matchType === "lose" ? "slot_loss" : "slot_win",
        p_reference_type: "slot",
        p_reference_id: Date.now() // Unique reference for this spin
    });

    if (updateError) {
        console.error("Reputation update error:", updateError);
        return { success: false, error: "Puan güncellenirken hata oluştu" };
    }

    revalidatePath("/slot");
    revalidatePath("/profil");

    return {
        success: true,
        reels,
        result: {
            matchType: result.matchType,
            multiplier: result.multiplier,
            winnings: result.winnings,
            netChange,
            newBalance: profile.reputation + netChange
        }
    };
}
