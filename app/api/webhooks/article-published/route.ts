import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the webhook request
    const authHeader = req.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized', detail: 'Secret mismatch' }, { status: 401 });
    }

    // 2. Parse payload
    const payload = await req.json();

    if (!payload.record) {
      return NextResponse.json({ message: 'No record in payload' });
    }

    const article = payload.record;

    // Only send email when article becomes published
    const isPublished = article.published === true || article.status === 'published';
    if (!isPublished) {
      return NextResponse.json({ message: 'Article not published yet' });
    }

    // For UPDATE events, skip if already published before
    if (payload.type === 'UPDATE' && payload.old_record) {
      const wasPublished = payload.old_record.published === true || payload.old_record.status === 'published';
      if (wasPublished) {
        return NextResponse.json({ message: 'Already published, skipping' });
      }
    }

    // 3. Initialize Resend & Supabase Admin
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
    }
    const resend = new Resend(apiKey);
    
    // Admin yetkisi ile aboneleri çekiyoruz (RLS bypass)
    const supabaseAdmin = createAdminClient();
    
    const { data: subscribers, error: subsError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('wants_email_notifications', true)
      .not('email', 'is', null);
      
    if (subsError) {
      console.error('Failed to fetch subscribers:', subsError);
      return NextResponse.json({ error: 'Failed to fetch subscribers', detail: subsError.message }, { status: 500 });
    }
    
    const toAddresses = subscribers?.map(s => s.email).filter(Boolean) as string[];
    
    // Eğer abone yoksa işlemi bitir
    if (!toAddresses || toAddresses.length === 0) {
      return NextResponse.json({ message: 'No subscribers to notify' });
    }

    // 4. Prepare HTML email
    const articleUrl = `https://www.fizikhub.com/makale/${article.slug}`;
    
    // Hosted koyu PNG'ler — Gmail data URI'leri bloklar ama hosted image'ları ASLA değiştirmez
    const BG_BODY = 'https://www.fizikhub.com/email/body-bg.png'; // #111111
    const BG_CARD = 'https://www.fizikhub.com/email/card-bg.png'; // #1a1a1a
    
    // Makale kapak fotoğrafı (og-image roket hariç)
    const coverImage = article.image_url && !article.image_url.includes('og-image') ? article.image_url : '';

    const htmlContent = `<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body,table,td,div,p,a,span,h1,h2,h3{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif}
  
  /* Temel Sınıflar (Aydınlık / Karanlık fark etmeksizin her zaman bu renkler olmalı) */
  .bg-body { background-color: #111111 !important; }
  .bg-card { background-color: #1a1a1a !important; }
  .bg-yellow { background-color: #fbbf24 !important; }
  .bg-divider { background-color: #252525 !important; }
  
  .text-white { color: #f0f0f0 !important; }
  .text-gray { color: #8a8a8a !important; }
  .text-black { color: #000000 !important; }
  .text-yellow { color: #FFD700 !important; }

  .border-black { border: 2px solid #000000 !important; }
  .border-gray { border: 2px solid #2a2a2a !important; }
  
  /* GMAIL MOBILE DARK MODE BYPASS (The Nuclear Option) */
  /* 1. Arka planları linear-gradient ile sabitle (Gmail gradient'i invert edemez) */
  u + .body .bg-body, [data-ogsc] .bg-body { background-image: linear-gradient(#111111, #111111) !important; }
  u + .body .bg-card, [data-ogsc] .bg-card { background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
  u + .body .bg-yellow, [data-ogsc] .bg-yellow { background-image: linear-gradient(#fbbf24, #fbbf24) !important; }
  u + .body .bg-divider, [data-ogsc] .bg-divider { background-image: linear-gradient(#252525, #252525) !important; }
  
  /* 2. Metin renklerini gradient + webkit-background-clip ile sabitle (Gmail metin gradientini invert edemez) */
  u + .body .text-white, [data-ogsc] .text-white {
    background-image: linear-gradient(#f0f0f0, #f0f0f0) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
  }
  u + .body .text-gray, [data-ogsc] .text-gray {
    background-image: linear-gradient(#8a8a8a, #8a8a8a) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
  }
  u + .body .text-black, [data-ogsc] .text-black {
    background-image: linear-gradient(#000000, #000000) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
  }
  u + .body .text-yellow, [data-ogsc] .text-yellow {
    background-image: linear-gradient(#FFD700, #FFD700) !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    color: transparent !important;
  }
  
  /* Apple Mail & Genel Dark Mode İstemcileri */
  @media (prefers-color-scheme: dark) {
    .bg-body { background-color: #111111 !important; background-image: linear-gradient(#111111, #111111) !important; }
    .bg-card { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
    .bg-yellow { background-color: #fbbf24 !important; background-image: linear-gradient(#fbbf24, #fbbf24) !important; }
    .bg-divider { background-color: #252525 !important; background-image: linear-gradient(#252525, #252525) !important; }
    
    .text-white { color: #f0f0f0 !important; -webkit-text-fill-color: #f0f0f0 !important; }
    .text-gray { color: #8a8a8a !important; -webkit-text-fill-color: #8a8a8a !important; }
    .text-black { color: #000000 !important; -webkit-text-fill-color: #000000 !important; }
    .text-yellow { color: #FFD700 !important; -webkit-text-fill-color: #FFD700 !important; }
  }
</style>
</head>
<body class="body bg-body" style="margin:0;padding:0;background-color:#111111;-webkit-text-size-adjust:none;">

<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-body" style="background-color:#111111;padding:28px 16px;" role="presentation">
<tr>
<td align="center" class="bg-body" style="background-color:#111111;">

<!-- KART -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-card border-gray" style="max-width:540px;background-color:#1a1a1a;border-radius:12px;border:2px solid #2a2a2a;overflow:hidden;" role="presentation">

<!-- LOGO -->
<tr>
<td align="center" class="bg-card" style="padding:34px 24px 22px;background-color:#1a1a1a;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center">
<h1 class="text-yellow" style="margin:0;font-size:36px;font-weight:900;font-style:italic;color:#FFD700;letter-spacing:-1.5px;line-height:1;">FizikHub</h1>
</td></tr>
<tr><td align="center" style="padding-top:7px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr><td class="bg-yellow" style="background-color:#FFD700;padding:3px 11px;border-radius:3px;">
<span class="text-black" style="font-size:8px;font-weight:800;color:#000000;letter-spacing:2.5px;text-transform:uppercase;line-height:1;">BİLİM PLATFORMU</span>
</td></tr>
</table>
</td></tr>
</table>
</td>
</tr>

${coverImage ? `
<!-- KAPAK FOTOĞRAFI -->
<tr>
<td class="bg-card" style="padding:0 18px 6px;background-color:#1a1a1a;">
<div class="border-gray" style="border-radius:8px;overflow:hidden;border:2px solid #2a2a2a;">
<a href="${articleUrl}" style="text-decoration:none;">
<img src="${coverImage}" alt="${article.title}" width="500" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;border:0;" />
</a>
</div>
</td>
</tr>
` : ''}

<!-- İÇERİK -->
<tr>
<td class="bg-card" style="padding:${coverImage ? '20px' : '6px'} 26px 30px;background-color:#1a1a1a;">

<!-- YENİ MAKALE ETİKETİ -->
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:18px;">
<tr>
<td class="bg-yellow border-black" style="background-color:#fbbf24;padding:6px 16px;border-radius:4px;border:2px solid #000000;">
<span class="text-black" style="font-size:11px;font-weight:800;color:#000000;letter-spacing:1.2px;text-transform:uppercase;">YENİ MAKALE</span>
</td>
</tr>
</table>

<!-- BAŞLIK -->
<h2 class="text-white" style="margin:0 0 12px;font-size:23px;font-weight:800;color:#f0f0f0;line-height:1.3;letter-spacing:-0.3px;">
${article.title}
</h2>

<!-- AÇIKLAMA -->
<p class="text-gray" style="margin:0 0 26px;font-size:15px;color:#8a8a8a;line-height:1.7;">
${article.excerpt || 'Fizikhub\'da yepyeni bir makale yayınlandı. Hemen okumaya başla!'}
</p>

<!-- BUTON -->
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="bg-yellow border-black" style="border-radius:6px;background-color:#fbbf24;border:2px solid #000000;">
<a href="${articleUrl}" target="_blank" class="text-black" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:800;color:#000000;text-decoration:none;letter-spacing:0.3px;text-transform:uppercase;">Makaleyi Oku →</a>
</td>
</tr>
</table>

</td>
</tr>

<!-- ÇİZGİ -->
<tr>
<td class="bg-card" style="padding:0 26px;background-color:#1a1a1a;">
<div class="bg-divider" style="height:2px;background-color:#252525;"></div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td class="bg-card" style="padding:16px 26px 20px;text-align:center;background-color:#1a1a1a;">
<p class="text-gray" style="margin:0 0 4px;font-size:11px;color:#555555;line-height:1.5;">Bu e-postayı Fizikhub bildirimleriniz açık olduğu için aldınız.</p>
<a href="https://www.fizikhub.com/profil" class="text-yellow" style="font-size:11px;color:#fbbf24;text-decoration:none;font-weight:600;">Bildirim ayarlarını değiştir</a>
</td>
</tr>

</table>

<!-- KART DIŞI -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:540px;" role="presentation">
<tr>
<td align="center" class="bg-body" style="padding:18px 0 0;background-color:#111111;">
<a href="https://www.fizikhub.com" class="text-gray" style="font-size:11px;color:#555555;text-decoration:none;">fizikhub.com</a>
</td>
</tr>
</table>

</td>
</tr>
</table>
</body>
</html>`;

    // 5. Send emails in batches using Resend Batch API
    // (Resend supports up to 100 emails per batch request)
    const FROM_EMAIL = 'Fizikhub <bildirim@fizikhub.com>';
    
    const emailObjects = toAddresses.map(email => ({
      from: FROM_EMAIL,
      to: email,
      subject: `Yeni Makale: ${article.title}`,
      html: htmlContent,
    }));
    
    // Chunking to handle potential large lists (e.g. over 100)
    const CHUNK_SIZE = 100;
    const batchResponses = [];
    let hasError = false;
    
    for (let i = 0; i < emailObjects.length; i += CHUNK_SIZE) {
      const chunk = emailObjects.slice(i, i + CHUNK_SIZE);
      const { data, error } = await resend.batch.send(chunk);
      
      if (error) {
        console.error('Batch send error:', error);
        hasError = true;
      }
      if (data) batchResponses.push(data);
    }

    if (hasError) {
      return NextResponse.json({ error: 'Some emails failed to send', detail: batchResponses }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Emails sent successfully', 
      recipientsCount: toAddresses.length 
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', detail: error?.message }, { status: 500 });
  }
}
