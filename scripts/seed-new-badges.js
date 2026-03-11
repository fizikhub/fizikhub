/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const badges = [
    { name: "Merhaba Dünya", description: "FizikHub'a hoş geldin! Bu alemdeki ilk izin.", icon: "zap", category: "milestone", requirement_type: "manual", requirement_value: 0 },
    { name: "Soru İşareti", description: "İlk sorusunu sorarak merakını evrene duyuranlara.", icon: "help-circle", category: "interaction", requirement_type: "question_count", requirement_value: 1 },
    { name: "Einstein'ın Mirası", description: "İlk makalesini yazarak bilime kalıcı bir iz bırakanlara.", icon: "book-open", category: "contribution", requirement_type: "article_count", requirement_value: 1 },
    { name: "Newton'un Elması", description: "İlk doğru (kabul edilen) cevabı verenlere.", icon: "check-circle", category: "interaction", requirement_type: "accepted_answer_count", requirement_value: 1 },
    { name: "Sorun Çözücü", description: "10 cevabı kabul edilerek ustalaşanlara.", icon: "check-square", category: "expertise", requirement_type: "accepted_answer_count", requirement_value: 10 },

    // HubPuan Klasman Rozetleri
    { name: "Gözlemci", description: "100 HubPuan'a ulaşarak uzayı izlemeye başlayanlara.", icon: "eye", category: "reputation", requirement_type: "reputation", requirement_value: 100 },
    { name: "Çırak", description: "500 HubPuan'a ulaşarak mekanizmaları çözenlere.", icon: "tool", category: "reputation", requirement_type: "reputation", requirement_value: 500 },
    { name: "Teorisyen", description: "1.000 HubPuan'a ulaşarak kendi teorilerini üretenlere.", icon: "edit-3", category: "reputation", requirement_type: "reputation", requirement_value: 1000 },
    { name: "Profesör", description: "2.500 HubPuan'a ulaşıp kürsü sahibi olanlara.", icon: "award", category: "reputation", requirement_type: "reputation", requirement_value: 2500 },
    { name: "Kozmolog", description: "5.000 HubPuan'a ulaşıp evrenin sınırlarını zorlayanlara.", icon: "globe", category: "reputation", requirement_type: "reputation", requirement_value: 5000 },
    { name: "Kuantum Mekaniği", description: "10.000 HubPuan efsanesi! Mikro alemlerin hakimi.", icon: "aperture", category: "reputation", requirement_type: "reputation", requirement_value: 10000 },

    // Etkileşim ve Sosyal
    { name: "Popüler", description: "İçeriklerinden biri 50+ beğeni alan parlayan yıldızlara.", icon: "heart", category: "social", requirement_type: "manual", requirement_value: 50 },
    { name: "Bilge Baykuş", description: "Gece gündüz demeden bilgelik dağıtan kütüphane muhafızlarına.", icon: "book", category: "expertise", requirement_type: "manual", requirement_value: 0 },
    { name: "Gece Kuşu", description: "Gece yarısı (00:00-05:00) içerik giren uykusuz fızikçilere.", icon: "moon", category: "special", requirement_type: "manual", requirement_value: 0 },
    { name: "Seri Okuyucu", description: "Kısa sürede 50 makale okuyup beyin hücrelerini yakanlara.", icon: "book-open", category: "interaction", requirement_type: "manual", requirement_value: 50 },
    { name: "Sosyal Kelebek", description: "5 farklı kişiyi takip eden, topluluk canavarlarına.", icon: "users", category: "social", requirement_type: "following_count", requirement_value: 5 },
    { name: "Fikir Önderi", description: "Fikirleriyle 50 takipçiye ulaşan topluluk liderlerine.", icon: "star", category: "social", requirement_type: "follower_count", requirement_value: 50 },
    { name: "Keskin Göz", description: "Sözlüğe ilk akademik terimini ekleyen dikkatli araştırmacılara.", icon: "search", category: "contribution", requirement_type: "manual", requirement_value: 1 },
    { name: "Tesla'nın Kıvılcımı", description: "Bir günde 5'ten fazla cevap veren enerji patlamalarına.", icon: "zap", category: "interaction", requirement_type: "manual", requirement_value: 0 },
    { name: "Karadelik", description: "Merakına karşı koyamayıp sitenin her köşesini yutanlara. (Gizli Başarım)", icon: "target", category: "secret", requirement_type: "manual", requirement_value: 0 }
];

async function seed() {
    console.log("Starting badge seeding...");

    for (const badge of badges) {
        // Gelişmiş UPSERT (Insert veya Var olanı Güncelle)
        const { error } = await supabase
            .from('badges')
            .upsert(
                {
                    name: badge.name,
                    description: badge.description,
                    icon: badge.icon,
                    category: badge.category,
                    requirement_type: badge.requirement_type,
                    requirement_value: badge.requirement_value
                },
                { onConflict: 'name' }
            );

        if (error) {
            console.error(`Error inserting badge ${badge.name}:`, error.message);
        } else {
            console.log(`Successfully added/updated badge: ${badge.name}`);
        }
    }
    console.log("Badges seeded successfully!");
}

seed();
