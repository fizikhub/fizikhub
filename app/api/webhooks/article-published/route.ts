import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // 3. Initialize Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    // 4. Prepare HTML email
    const articleUrl = `https://www.fizikhub.com/makale/${article.slug}`;
    
    // Hosted koyu PNG'ler — Gmail data URI'leri bloklar ama hosted image'ları ASLA değiştirmez
    // HTML background attribute + CSS background-image = Gmail dark mode proof
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
  
  /* Temel Stiller */
  .bg-body { background-color: #111111 !important; }
  .bg-card { background-color: #1a1a1a !important; }
  .text-white { color: #f0f0f0 !important; }
  .text-gray { color: #8a8a8a !important; }
  
  /* Gmail Dark Mode Hack: Gradient kullanarak arka planı zorlama */
  u + .body .bg-body { background-image: linear-gradient(#111111, #111111) !important; }
  u + .body .bg-card { background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
  u + .body .text-white { color: #f0f0f0 !important; }
  
  /* Outlook.com / OWA Dark Mode Hack */
  [data-ogsc] .bg-body { background-image: linear-gradient(#111111, #111111) !important; }
  [data-ogsc] .bg-card { background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
  
  /* Apple Mail & Diğer Dark Mode Destekleyen İstemciler */
  @media (prefers-color-scheme: dark) {
    .bg-body { background-color: #111111 !important; background-image: linear-gradient(#111111, #111111) !important; }
    .bg-card { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }
    .text-white { color: #f0f0f0 !important; }
    .text-gray { color: #8a8a8a !important; }
  }
</style>
</head>
<body class="body bg-body" style="margin:0;padding:0;background-color:#111111;-webkit-text-size-adjust:none;">

<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-body" style="background-color:#111111;padding:28px 16px;" role="presentation">
<tr>
<td align="center" class="bg-body" style="background-color:#111111;">

<!-- KART -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-card" style="max-width:540px;background-color:#1a1a1a;border-radius:12px;border:2px solid #2a2a2a;overflow:hidden;" role="presentation">

<!-- LOGO -->
<tr>
<td align="center" class="bg-card" style="padding:34px 24px 22px;background-color:#1a1a1a;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr><td align="center">
<h1 style="margin:0;font-size:36px;font-weight:900;font-style:italic;color:#FFD700;letter-spacing:-1.5px;line-height:1;">FizikHub</h1>
</td></tr>
<tr><td align="center" style="padding-top:7px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="background-color:#FFD700;padding:3px 11px;border-radius:3px;">
<span style="font-size:8px;font-weight:800;color:#000000;letter-spacing:2.5px;text-transform:uppercase;line-height:1;">BİLİM PLATFORMU</span>
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
<div style="border-radius:8px;overflow:hidden;border:2px solid #2a2a2a;">
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
<td style="background-color:#fbbf24;padding:6px 16px;border-radius:4px;border:2px solid #000000;">
<span style="font-size:11px;font-weight:800;color:#000000;letter-spacing:1.2px;text-transform:uppercase;">YENİ MAKALE</span>
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
<td style="border-radius:6px;background-color:#fbbf24;border:2px solid #000000;">
<a href="${articleUrl}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:800;color:#000000;text-decoration:none;letter-spacing:0.3px;text-transform:uppercase;">Makaleyi Oku →</a>
</td>
</tr>
</table>

</td>
</tr>

<!-- ÇİZGİ -->
<tr>
<td class="bg-card" style="padding:0 26px;background-color:#1a1a1a;">
<div style="height:2px;background-color:#252525;"></div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td class="bg-card" style="padding:16px 26px 20px;text-align:center;background-color:#1a1a1a;">
<p class="text-gray" style="margin:0 0 4px;font-size:11px;color:#555555;line-height:1.5;">Bu e-postayı Fizikhub bildirimleriniz açık olduğu için aldınız.</p>
<a href="https://www.fizikhub.com/profil" style="font-size:11px;color:#fbbf24;text-decoration:none;font-weight:600;">Bildirim ayarlarını değiştir</a>
</td>
</tr>

</table>

<!-- KART DIŞI -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:540px;" role="presentation">
<tr>
<td align="center" class="bg-body" style="padding:18px 0 0;background-color:#111111;">
<a href="https://www.fizikhub.com" style="font-size:11px;color:#555555;text-decoration:none;">fizikhub.com</a>
</td>
</tr>
</table>

</td>
</tr>
</table>
</body>
</html>`;

    // 5. Send email - TEST: only to this address
    const { data, error } = await resend.emails.send({
      from: 'Fizikhub <onboarding@resend.dev>',
      to: 'barannnbozkurttb.b@gmail.com',
      subject: `Yeni Makale: ${article.title}`,
      html: htmlContent,
    });

    if (error) {
      return NextResponse.json({ error: 'Resend error', detail: error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', emailId: data?.id });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', detail: error?.message }, { status: 500 });
  }
}
