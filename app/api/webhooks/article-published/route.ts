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
    
    // Roket görselinin (og-image) mailde çıkmasını engelle
    const hasValidImage = article.image_url && !article.image_url.includes('og-image');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark only">
        <meta name="supported-color-schemes" content="dark only">
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          :root { color-scheme: dark only; }
          body, table, td, div, p, a, span, h1, h2, h3 {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
          }
          /* Prevent Gmail from overriding dark backgrounds */
          u + .body { background-color: transparent !important; }
          [data-ogsc] .dark-bg { background-color: #1a1a1a !important; }
          [data-ogsc] .card-bg { background-color: #242424 !important; }
        </style>
      </head>
      <body class="body" style="margin: 0; padding: 0; background-color: transparent; -webkit-text-size-adjust: none;">
        <!-- Outer wrapper: transparent so Gmail dark mode background shows through -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 32px 16px;" role="presentation">
          <tr>
            <td align="center">
              <!-- Main card -->
              <table class="card-bg" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #1e1e1e; border-radius: 16px; overflow: hidden;" role="presentation">
                
                <!-- Logo Header -->
                <tr>
                  <td align="center" style="padding: 36px 24px 28px;">
                    <!-- Text-based logo matching site's DankLogo style -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 900; font-style: italic; color: #FFD700; letter-spacing: -1px; line-height: 1;">
                            FizikHub
                          </h1>
                          <div style="margin-top: 4px; display: inline-block; background-color: #FFD700; padding: 2px 8px; border-radius: 2px;">
                            <span style="font-size: 9px; font-weight: 800; color: #000000; letter-spacing: 2px; text-transform: uppercase;">
                              BİLİM PLATFORMU
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background-color: #333333;"></div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px 32px 36px;">
                    <!-- Badge -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background-color: #332b00; padding: 5px 14px; border-radius: 20px;">
                          <span style="font-size: 12px; font-weight: 700; color: #fbbf24; letter-spacing: 0.5px;">
                            ✦ YENİ MAKALE
                          </span>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Title -->
                    <h2 style="margin: 20px 0 14px; font-size: 22px; font-weight: 700; color: #f5f5f5; line-height: 1.35;">
                      ${article.title}
                    </h2>
                    
                    ${hasValidImage ? `
                    <!-- Article Image -->
                    <div style="margin-bottom: 20px; border-radius: 10px; overflow: hidden;">
                      <img src="${article.image_url}" alt="${article.title}" style="display: block; width: 100%; height: auto; max-height: 240px; object-fit: cover;" />
                    </div>
                    ` : ''}

                    <!-- Excerpt -->
                    <p style="margin: 0 0 28px; font-size: 15px; color: #999999; line-height: 1.65;">
                      ${article.excerpt || 'Fizikhub\'da yepyeni bir makale yayınlandı. Hemen okumaya başla!'}
                    </p>

                    <!-- CTA Button -->
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" style="border-radius: 10px; background-color: #fbbf24;">
                          <a href="${articleUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-size: 15px; font-weight: 700; color: #000000; text-decoration: none; border-radius: 10px;">
                            Makaleyi Oku →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0 32px;">
                    <div style="height: 1px; background-color: #2a2a2a;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 32px 24px; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #666666; line-height: 1.5;">
                      Bu e-postayı Fizikhub bildirimleriniz açık olduğu için aldınız.
                    </p>
                    <p style="margin: 6px 0 0; font-size: 12px;">
                      <a href="https://www.fizikhub.com/profil" style="color: #fbbf24; text-decoration: none;">Bildirim ayarlarını değiştir</a>
                    </p>
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
