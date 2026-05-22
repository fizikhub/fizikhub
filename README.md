# FizikHub

FizikHub, Türkçe fizik ve bilim içerikleri için geliştirilmiş bir Next.js uygulamasıdır. Projede makale yayını, forum, sözlük, profil/rozet sistemi, yazar paneli, admin akışları, mesajlaşma, PWA desteği, SEO çıktıları ve Supabase tabanlı veri katmanı bulunur.

## Teknoloji yığını

- Next.js App Router 16, React 19 ve TypeScript
- Tailwind CSS, shadcn/ui tabanlı yerel UI bileşenleri ve lucide-react ikonları
- Supabase Auth, Postgres, Realtime ve Storage
- Vitest + Testing Library ile birim/aksiyon testleri
- Vercel Analytics, PWA ve dinamik sitemap/feed/OG rotaları
- Gemini tabanlı içerik inceleme, copilot ve embedding yardımcıları

## Geliştirme

Yerel geliştirme için Node bağımlılıkları kurulu olmalıdır.

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` üzerinde çalışır.

## Kalite komutları

```bash
npm run typecheck
npm run lint
npm run test:run
npm run verify
```

`npm run verify`, tip kontrolü, lint ve testleri tek seferde çalıştırır. Geniş çaplı değişikliklerden önce ve sonra bu komutu çalıştırmak iyi varsayılandır.

## Ortam değişkenleri

Projede kullanılan başlıca değişkenler:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `GEMINI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_AI_API_KEY`
- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `SUPABASE_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Gizli değerleri `.env.local` içinde tutun; `.env*` dosyaları git dışında bırakılır.

## Faydalı yollar

- `app/`: App Router sayfaları, route handler'lar ve server actions
- `components/`: UI, forum, makale, profil, simülasyon ve yazar bileşenleri
- `lib/`: Supabase istemcileri, SEO, güvenlik, AI ve veri yardımcıları
- `hooks/`: Client tarafı React hook'ları
- `supabase/`: Migration ve performans/güvenlik SQL dosyaları
- `scripts/`: Operasyonel bakım, SEO ve Supabase yardımcı scriptleri
- `__tests__/`: Vitest testleri

## Notlar

- `@ducanh2912/next-pwa`, production build sırasında `public/sw.js`, `public/workbox-*.js` ve `public/fallback-*.js` üretir. Bunlar build çıktısı olarak git dışında tutulur.
- Kök dizindeki bazı bakım scriptleri doğrudan Node ile çalıştırıldığı için CommonJS kullanır; uygulama kodu TypeScript/ESM tarafında kalır.
