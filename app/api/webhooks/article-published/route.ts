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
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <style>
          /* Force dark theme for email clients */
          body, table, td, h1, h2, h3, p, a {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #09090b; color: #f4f4f5;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #09090b; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #18181b; border: 2px solid #3f3f46; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 40px 20px; background-color: #09090b; border-bottom: 2px solid #3f3f46;">
                    <img src="${logoUrl}" alt="Fizikhub" style="display: block; width: 220px; height: auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <div style="display: inline-block; background-color: #fbbf24; color: #000000; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                      Yeni Makale
                    </div>
                    <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 800; color: #ffffff; line-height: 1.4;">${article.title}</h2>
                    
                    ${article.image_url ? `
                    <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1px solid #3f3f46;">
                      <img src="${article.image_url}" alt="${article.title}" style="display: block; width: 100%; height: auto; max-height: 320px; object-fit: cover;" />
                    </div>
                    ` : ''}

                    <p style="margin: 0 0 32px; font-size: 16px; color: #a1a1aa; line-height: 1.6; font-weight: 400;">
                      ${article.excerpt || 'Fizikhub\'da yepyeni bir makale yayınlandı. Keşfetmek için hemen tıkla!'}
                    </p>

                    <div style="text-align: left;">
                      <a href="${articleUrl}" style="display: inline-block; background-color: #fbbf24; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Makaleyi İncele
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="left" style="padding: 24px 32px; background-color: #09090b; border-top: 1px solid #27272a;">
                    <p style="margin: 0; font-size: 13px; color: #71717a; font-weight: 400; line-height: 1.5;">
                      Bu e-postayı, Fizikhub bildirimleriniz açık olduğu için aldınız.<br/>
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
