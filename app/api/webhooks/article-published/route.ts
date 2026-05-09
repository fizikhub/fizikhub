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
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 4px solid #000000; border-radius: 16px; overflow: hidden; box-shadow: 4px 4px 0px #000000;">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 32px 20px 24px; background-color: #18181b; border-bottom: 4px solid #000000;">
                    <img src="${logoUrl}" alt="Fizikhub" style="display: block; width: 200px; height: auto;" />
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #000000; line-height: 1.3;">${article.title}</h2>
                    
                    ${article.image_url ? `
                    <div style="margin-bottom: 24px; border: 3px solid #000000; border-radius: 12px; overflow: hidden;">
                      <img src="${article.image_url}" alt="${article.title}" style="display: block; width: 100%; height: auto; max-height: 300px; object-fit: cover;" />
                    </div>
                    ` : ''}

                    <p style="margin: 0 0 32px; font-size: 16px; color: #3f3f46; line-height: 1.6; font-weight: 500;">
                      ${article.excerpt || 'Fizikhub\'da yeni bir makale yayınlandı. Hemen inceleyin ve öğrenmeye başlayın!'}
                    </p>

                    <div style="text-align: center;">
                      <a href="${articleUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; border: 2px solid #000000; text-transform: uppercase; letter-spacing: 0.5px;">
                        Makaleyi Oku
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 24px 32px; background-color: #fafafa; border-top: 3px solid #000000;">
                    <p style="margin: 0; font-size: 13px; color: #71717a; font-weight: 500;">
                      Bu e-postayı, Fizikhub profilinizde "Yeni Makale Bildirimleri" açık olduğu için aldınız.
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
