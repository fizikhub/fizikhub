# 🛠️ Fizikhub Teknik Altyapı ve Teknoloji Yığını

Biri size "Sitenin altyapısında ne kullandın?" diye sorarsa, verebileceğiniz en profesyonel ve havalı cevaplar burada!

## 🚀 Kısa Cevap (Asansör Konuşması)

> "Fizikhub, **Next.js (App Router)** üzerinde geliştirilmiş, **TypeScript** ile tip güvenliği sağlanan modern bir web uygulamasıdır. UI tarafında **Tailwind CSS** ve **Shadcn/UI**, animasyonlar için **Framer Motion** kullanıyorum. Backend ve veritabanı altyapısı için ise **Supabase (PostgreSQL)** tercih ettim. Sunucu tarafında ise **Server Actions** mimarisini kullanıyorum."

---

## 🏗️ Teknoloji Yığını (Tech Stack)

### 1. Frontend (Ön Yüz)
- **Framework:** [Next.js 15](https://nextjs.org) (En güncel React framework'ü, App Router mimarisi)
- **Dil:** [TypeScript](https://www.typescriptlang.org/) (Hata yakalama ve kod güvenliği için)
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
  - [Shadcn/UI](https://ui.shadcn.com/) (Erişilebilir, özelleştirilebilir bileşen kütüphanesi)
- **Animasyonlar:** [Framer Motion](https://www.framer.com/motion/) (Sayfa geçişleri ve mikro etkileşimler için)
- **İkonlar:** [Lucide React](https://lucide.dev/) (Modern ve tutarlı ikon seti)

### 2. Backend & Veritabanı (BaaS)
- **Platform:** [Supabase](https://supabase.com/) (Açık kaynaklı Firebase alternatifi)
- **Veritabanı:** **PostgreSQL** (Dünyanın en gelişmiş açık kaynak ilişkisel veritabanı)
- **Kimlik Doğrulama (Auth):** Supabase Auth (Google Login, Email/Password, RLS güvenliği)
- **Depolama (Storage):** Supabase Storage (Profil resimleri ve medya dosyaları için)
- **Gerçek Zamanlı (Realtime):** Supabase Realtime (Mesajlaşma ve bildirimler için)

### 3. Mimari & Performans
- **Rendering:** Server Side Rendering (SSR) ve Static Site Generation (SSG) hibrit yapısı. SEO için optimize edildi.
- **Veri İletişimi:** **Server Actions** (API route yazmadan doğrudan sunucu fonksiyonlarını çağırma).
- **Güvenlik:** RLS (Row Level Security) politikaları ile veritabanı seviyesinde güvenlik.

### 4. Hosting & Deployment
- **Platform:** [Vercel](https://vercel.com) (Next.js'in yaratıcılarından, global CDN ve Edge Network).

---

## ❓ Sık Sorulan Teknik Sorulara Cevaplar

**S: Neden Next.js kullandın?**
C: "Hem SEO performansı (sunucu taraflı render) hem de React'in interaktif yapısını bir arada sunduğu için. Ayrıca Vercel ile mükemmel entegrasyonu var."

**S: Backend için neden Node.js/Python yazmadın da Supabase kullandın?**
C: "Supabase, PostgreSQL'in gücünü sunarken authentication, realtime ve storage gibi özellikleri kutudan çıktığı gibi veriyor. Bu sayede tekerleği yeniden icat etmek yerine ürünü geliştirmeye odaklandım."

**S: Tasarımı nasıl yaptın?**
C: "Modern 'Brutalist' ve 'Glassmorphism' akımlarından esinlendim. Tailwind CSS ile hızlıca stillendirdim, Shadcn/ui ile de erişilebilir (accessible) komponentler kullandım."

**S: Mobil uyumlu mu?**
C: "Evet, tamamen responsive. Tailwind'in breakpoint sistemiyle tüm cihazlarda kusursuz görünüyor."
