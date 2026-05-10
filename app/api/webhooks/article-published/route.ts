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
    const logoUrl = 'https://www.fizikhub.com/logo-no-bg.svg';
    
    // Roket görselinin (og-image) mailde çıkmasını engelle
    const hasValidImage = article.image_url && !article.image_url.includes('og-image');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <style>
          body, table, td, h1, h2, h3, p, a {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #121212; color: #ffffff;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #1c1c1e; border: 1px solid #333333; border-radius: 12px; overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 32px 20px; border-bottom: 1px solid #2c2c2e;">
                    <img src="${logoUrl}" alt="Fizikhub Bilim Platformu" style="display: block; width: 180px; height: auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <div style="margin-bottom: 16px;">
                      <span style="display: inline-block; background-color: rgba(251, 191, 36, 0.1); color: #fbbf24; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px;">
                        YENİ MAKALE
                      </span>
                    </div>
                    
                    <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                      ${article.title}
                    </h2>
                    
                    ${hasValidImage ? `
                    <div style="margin-bottom: 24px; border-radius: 8px; overflow: hidden;">
                      <img src="${article.image_url}" alt="${article.title}" style="display: block; width: 100%; height: auto; max-height: 250px; object-fit: cover;" />
                    </div>
                    ` : ''}

                    <p style="margin: 0 0 32px; font-size: 16px; color: #a1a1aa; line-height: 1.6;">
                      ${article.excerpt || 'Fizikhub\'da yepyeni bir makale yayınlandı. Okumak ve incelemek için aşağıdaki butona tıklayın.'}
                    </p>

                    <div>
                      <a href="${articleUrl}" style="display: inline-block; background-color: #fbbf24; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; text-align: center;">
                        Makaleyi Oku
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px; background-color: #121212; border-top: 1px solid #2c2c2e; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #71717a; line-height: 1.5;">
                      Bu e-postayı, Fizikhub profilinizde "Yeni Makale Bildirimleri" açık olduğu için aldınız.<br/>
                      <a href="https://www.fizikhub.com/profil" style="color: #fbbf24; text-decoration: none;">Bildirim Ayarlarını Değiştir</a>
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
