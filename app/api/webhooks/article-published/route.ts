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
    
    // Gmail dark mode hack: 1x1 transparent GIF prevents Gmail from inverting dark backgrounds
    const IMG_FIX = "url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')";
    
    // Makale kapak fotoğrafı - og-image (roket) hariç
    const coverImage = article.image_url && !article.image_url.includes('og-image') ? article.image_url : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <!--[if mso]>
        <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
        <![endif]-->
        <style>
          body, table, td, div, p, a, span, h1, h2, h3 {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
          }
          /* Gmail dark mode: target all backgrounds to prevent inversion */
          u + .body .gcard { background: #1a1a1a !important; }
          u + .body .gdark { background: #111111 !important; }
          [data-ogsc] .gcard { background: #1a1a1a !important; }
          [data-ogsc] .gdark { background: #111111 !important; }
        </style>
      </head>
      <body class="body" style="margin: 0; padding: 0; background: #111111 ${IMG_FIX}; -webkit-text-size-adjust: none;">
        <table class="gdark" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #111111 ${IMG_FIX}; padding: 24px 16px;" role="presentation">
          <tr>
            <td align="center">
              <!-- Card -->
              <table class="gcard" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background: #1a1a1a ${IMG_FIX}; border-radius: 14px; overflow: hidden;" role="presentation">
                
                <!-- Logo -->
                <tr>
                  <td align="center" style="padding: 36px 24px 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="font-size: 0; line-height: 0;">
                          <h1 style="margin: 0; font-size: 34px; font-weight: 900; font-style: italic; color: #FFD700; letter-spacing: -1.5px; line-height: 1; mso-line-height-rule: exactly;">FizikHub</h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 6px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="background: #FFD700 ${IMG_FIX}; padding: 3px 10px; border-radius: 3px;">
                                <span style="font-size: 8px; font-weight: 800; color: #000000; letter-spacing: 2.5px; text-transform: uppercase; line-height: 1;">BİLİM PLATFORMU</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${coverImage ? `
                <!-- Kapak Fotoğrafı -->
                <tr>
                  <td style="padding: 0 20px 4px;">
                    <div style="border-radius: 10px; overflow: hidden;">
                      <a href="${articleUrl}" style="text-decoration: none;">
                        <img src="${coverImage}" alt="${article.title}" width="500" style="display: block; width: 100%; height: auto; max-height: 220px; object-fit: cover; border: 0;" />
                      </a>
                    </div>
                  </td>
                </tr>
                ` : ''}

                <!-- İçerik -->
                <tr>
                  <td style="padding: ${coverImage ? '20px' : '8px'} 28px 32px;">
                    <!-- Etiket -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 18px;">
                      <tr>
                        <td style="background: #2a2200 ${IMG_FIX}; padding: 6px 14px; border-radius: 6px; border: 1px solid #3d3300;">
                          <span style="font-size: 11px; font-weight: 700; color: #fbbf24; letter-spacing: 1px; text-transform: uppercase;">YENİ MAKALE</span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Başlık -->
                    <h2 style="margin: 0 0 14px; font-size: 22px; font-weight: 800; color: #eeeeee; line-height: 1.3; letter-spacing: -0.3px;">
                      ${article.title}
                    </h2>

                    <!-- Açıklama -->
                    <p style="margin: 0 0 28px; font-size: 15px; color: #888888; line-height: 1.7;">
                      ${article.excerpt || 'Fizikhub\'da yepyeni bir makale yayınlandı. Hemen okumaya başla!'}
                    </p>

                    <!-- Buton -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="border-radius: 8px; background: #fbbf24 ${IMG_FIX};">
                          <a href="${articleUrl}" target="_blank" style="display: inline-block; padding: 13px 30px; font-size: 14px; font-weight: 700; color: #000000; text-decoration: none; letter-spacing: 0.3px;">Makaleyi Oku →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Alt Çizgi -->
                <tr>
                  <td style="padding: 0 28px;">
                    <div style="height: 1px; background: #252525 ${IMG_FIX};"></div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 18px 28px 22px; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 11px; color: #555555; line-height: 1.5;">Bu e-postayı Fizikhub bildirimleriniz açık olduğu için aldınız.</p>
                    <a href="https://www.fizikhub.com/profil" style="font-size: 11px; color: #fbbf24; text-decoration: none;">Bildirim ayarlarını değiştir</a>
                  </td>
                </tr>

              </table>
              
              <!-- Alt yazı (kart dışı) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px;" role="presentation">
                <tr>
                  <td align="center" style="padding: 20px 0 0;">
                    <a href="https://www.fizikhub.com" style="font-size: 11px; color: #444444; text-decoration: none;">fizikhub.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

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
