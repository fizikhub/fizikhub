"use server";

import { createAdminClient } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

// Helper to verify admin (same as in actions.ts)
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { isAdmin: false, error: "Giriş yapmalısınız." };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = profile?.role === 'admin' || isAdminEmail(user.email);

    if (!isAdmin) {
        return { isAdmin: false, error: "Bu işlem için admin yetkisi gereklidir." };
    }

    return { isAdmin: true, supabase };
}

function buildArticleEmailHtml(article: { title: string; slug: string; excerpt?: string | null; image_url?: string | null }) {
    const articleUrl = "https://www.fizikhub.com/makale/" + article.slug;
    const coverImage = article.image_url && !article.image_url.includes('og-image') ? article.image_url : '';

    let coverSection = '';
    if (coverImage) {
        coverSection = [
            '<!-- KAPAK FOTOĞRAFI -->',
            '<tr>',
            '<td class="bg-card" style="padding:0 18px 6px;background-color:#1a1a1a;">',
            '<div class="border-gray" style="border-radius:8px;overflow:hidden;border:2px solid #2a2a2a;">',
            '<a href="' + articleUrl + '" style="text-decoration:none;">',
            '<img src="' + coverImage + '" alt="' + article.title + '" width="500" style="display:block;width:100%;height:auto;max-height:220px;object-fit:cover;border:0;" />',
            '</a>',
            '</div>',
            '</td>',
            '</tr>'
        ].join('\n');
    }

    const contentPadding = coverImage ? '20px' : '6px';
    const excerptText = article.excerpt || "Fizikhub'da yepyeni bir makale yayınlandı. Hemen okumaya başla!";

    const parts = [
        '<!DOCTYPE html>',
        '<html lang="tr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<meta name="x-apple-disable-message-reformatting">',
        '<meta name="color-scheme" content="light dark">',
        '<meta name="supported-color-schemes" content="light dark">',
        '<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->',
        '<style>',
        "  body,table,td,div,p,a,span,h1,h2,h3{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif}",
        '  .bg-body { background-color: #111111 !important; }',
        '  .bg-card { background-color: #1a1a1a !important; }',
        '  .bg-yellow { background-color: #fbbf24 !important; }',
        '  .bg-divider { background-color: #252525 !important; }',
        '  .text-white { color: #f0f0f0 !important; }',
        '  .text-gray { color: #8a8a8a !important; }',
        '  .text-black { color: #000000 !important; }',
        '  .text-yellow { color: #FFD700 !important; }',
        '  .border-black { border: 2px solid #000000 !important; }',
        '  .border-gray { border: 2px solid #2a2a2a !important; }',
        '  u + .body .bg-body, [data-ogsc] .bg-body { background-image: linear-gradient(#111111, #111111) !important; }',
        '  u + .body .bg-card, [data-ogsc] .bg-card { background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }',
        '  u + .body .bg-yellow, [data-ogsc] .bg-yellow { background-image: linear-gradient(#fbbf24, #fbbf24) !important; }',
        '  u + .body .bg-divider, [data-ogsc] .bg-divider { background-image: linear-gradient(#252525, #252525) !important; }',
        '  u + .body .text-white, [data-ogsc] .text-white {',
        '    background-image: linear-gradient(#f0f0f0, #f0f0f0) !important;',
        '    -webkit-background-clip: text !important; background-clip: text !important;',
        '    -webkit-text-fill-color: transparent !important; color: transparent !important;',
        '  }',
        '  u + .body .text-gray, [data-ogsc] .text-gray {',
        '    background-image: linear-gradient(#8a8a8a, #8a8a8a) !important;',
        '    -webkit-background-clip: text !important; background-clip: text !important;',
        '    -webkit-text-fill-color: transparent !important; color: transparent !important;',
        '  }',
        '  u + .body .text-black, [data-ogsc] .text-black {',
        '    background-image: linear-gradient(#000000, #000000) !important;',
        '    -webkit-background-clip: text !important; background-clip: text !important;',
        '    -webkit-text-fill-color: transparent !important; color: transparent !important;',
        '  }',
        '  u + .body .text-yellow, [data-ogsc] .text-yellow {',
        '    background-image: linear-gradient(#FFD700, #FFD700) !important;',
        '    -webkit-background-clip: text !important; background-clip: text !important;',
        '    -webkit-text-fill-color: transparent !important; color: transparent !important;',
        '  }',
        '  @media (prefers-color-scheme: dark) {',
        '    .bg-body { background-color: #111111 !important; background-image: linear-gradient(#111111, #111111) !important; }',
        '    .bg-card { background-color: #1a1a1a !important; background-image: linear-gradient(#1a1a1a, #1a1a1a) !important; }',
        '    .bg-yellow { background-color: #fbbf24 !important; background-image: linear-gradient(#fbbf24, #fbbf24) !important; }',
        '    .bg-divider { background-color: #252525 !important; background-image: linear-gradient(#252525, #252525) !important; }',
        '    .text-white { color: #f0f0f0 !important; -webkit-text-fill-color: #f0f0f0 !important; }',
        '    .text-gray { color: #8a8a8a !important; -webkit-text-fill-color: #8a8a8a !important; }',
        '    .text-black { color: #000000 !important; -webkit-text-fill-color: #000000 !important; }',
        '    .text-yellow { color: #FFD700 !important; -webkit-text-fill-color: #FFD700 !important; }',
        '  }',
        '</style>',
        '</head>',
        '<body class="body bg-body" style="margin:0;padding:0;background-color:#111111;-webkit-text-size-adjust:none;">',
        '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-body" style="background-color:#111111;padding:28px 16px;" role="presentation">',
        '<tr>',
        '<td align="center" class="bg-body" style="background-color:#111111;">',
        '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-card border-gray" style="max-width:540px;background-color:#1a1a1a;border-radius:12px;border:2px solid #2a2a2a;overflow:hidden;" role="presentation">',
        '<tr>',
        '<td align="center" class="bg-card" style="padding:34px 24px 22px;background-color:#1a1a1a;">',
        '<table border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tr><td align="center">',
        '<h1 class="text-yellow" style="margin:0;font-size:36px;font-weight:900;font-style:italic;color:#FFD700;letter-spacing:-1.5px;line-height:1;">FizikHub</h1>',
        '</td></tr>',
        '<tr><td align="center" style="padding-top:7px;">',
        '<table border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tr><td class="bg-yellow" style="background-color:#FFD700;padding:3px 11px;border-radius:3px;">',
        '<span class="text-black" style="font-size:8px;font-weight:800;color:#000000;letter-spacing:2.5px;text-transform:uppercase;line-height:1;">BİLİM PLATFORMU</span>',
        '</td></tr>',
        '</table>',
        '</td></tr>',
        '</table>',
        '</td>',
        '</tr>',
        coverSection,
        '<tr>',
        '<td class="bg-card" style="padding:' + contentPadding + ' 26px 30px;background-color:#1a1a1a;">',
        '<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:18px;">',
        '<tr>',
        '<td class="bg-yellow border-black" style="background-color:#fbbf24;padding:6px 16px;border-radius:4px;border:2px solid #000000;">',
        '<span class="text-black" style="font-size:11px;font-weight:800;color:#000000;letter-spacing:1.2px;text-transform:uppercase;">YENİ MAKALE</span>',
        '</td>',
        '</tr>',
        '</table>',
        '<h2 class="text-white" style="margin:0 0 12px;font-size:23px;font-weight:800;color:#f0f0f0;line-height:1.3;letter-spacing:-0.3px;">',
        article.title,
        '</h2>',
        '<p class="text-gray" style="margin:0 0 26px;font-size:15px;color:#8a8a8a;line-height:1.7;">',
        excerptText,
        '</p>',
        '<table border="0" cellpadding="0" cellspacing="0" role="presentation">',
        '<tr>',
        '<td class="bg-yellow border-black" style="border-radius:6px;background-color:#fbbf24;border:2px solid #000000;">',
        '<a href="' + articleUrl + '" target="_blank" class="text-black" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:800;color:#000000;text-decoration:none;letter-spacing:0.3px;text-transform:uppercase;">Makaleyi Oku →</a>',
        '</td>',
        '</tr>',
        '</table>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td class="bg-card" style="padding:0 26px;background-color:#1a1a1a;">',
        '<div class="bg-divider" style="height:2px;background-color:#252525;"></div>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td class="bg-card" style="padding:16px 26px 20px;text-align:center;background-color:#1a1a1a;">',
        '<p class="text-gray" style="margin:0 0 4px;font-size:11px;color:#555555;line-height:1.5;">Bu e-postayı Fizikhub bildirimleriniz açık olduğu için aldınız.</p>',
        '<a href="https://www.fizikhub.com/profil" class="text-yellow" style="font-size:11px;color:#fbbf24;text-decoration:none;font-weight:600;">Bildirim ayarlarını değiştir</a>',
        '</td>',
        '</tr>',
        '</table>',
        '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:540px;" role="presentation">',
        '<tr>',
        '<td align="center" class="bg-body" style="padding:18px 0 0;background-color:#111111;">',
        '<a href="https://www.fizikhub.com" class="text-gray" style="font-size:11px;color:#555555;text-decoration:none;">fizikhub.com</a>',
        '</td>',
        '</tr>',
        '</table>',
        '</td>',
        '</tr>',
        '</table>',
        '</body>',
        '</html>'
    ];

    return parts.join('\n');
}

export async function sendArticleNotificationEmail(articleId: number) {
    const adminCheck = await verifyAdmin();
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'RESEND_API_KEY ayarlanmamış.' };
    }
    const resend = new Resend(apiKey);
    const supabaseAdmin = createAdminClient();

    // 1. Fetch the article
    const { data: article, error: articleError } = await supabaseAdmin
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

    if (articleError || !article) {
        return { success: false, error: 'Makale bulunamadı.' };
    }

    if (article.status !== 'published') {
        return { success: false, error: 'Sadece yayında olan makaleler için bildirim gönderilebilir.' };
    }

    if (article.email_sent) {
        return { success: false, error: 'Bu makale için zaten e-posta gönderilmiş.' };
    }

    // 2. Fetch subscribers
    const { data: subscribers, error: subsError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('wants_email_notifications', true)
        .not('email', 'is', null);

    if (subsError) {
        console.error('Failed to fetch subscribers:', subsError);
        return { success: false, error: 'Aboneler getirilemedi.' };
    }

    const toAddresses = subscribers?.map(s => s.email).filter(Boolean) as string[];

    if (!toAddresses || toAddresses.length === 0) {
        return { success: false, error: 'Bildirim gönderilecek abone bulunamadı.' };
    }

    // 3. Build email HTML
    const htmlContent = buildArticleEmailHtml(article);

    // 4. Send emails in batches using Resend Batch API
    const FROM_EMAIL = 'Fizikhub <bildirim@fizikhub.com>';

    const emailObjects = toAddresses.map(email => ({
        from: FROM_EMAIL,
        to: email,
        subject: 'Yeni Makale: ' + article.title,
        html: htmlContent,
    }));

    const CHUNK_SIZE = 100;
    let hasError = false;

    for (let i = 0; i < emailObjects.length; i += CHUNK_SIZE) {
        const chunk = emailObjects.slice(i, i + CHUNK_SIZE);
        const { error } = await resend.batch.send(chunk);

        if (error) {
            console.error('Batch send error:', error);
            hasError = true;
        }
    }

    if (hasError) {
        return { success: false, error: 'Bazı e-postalar gönderilemedi.' };
    }

    // 5. Update article to mark email as sent
    const { error: updateError } = await supabaseAdmin
        .from('articles')
        .update({ email_sent: true })
        .eq('id', articleId);

    if (updateError) {
        console.error('Error updating article email_sent status:', updateError);
    }

    revalidatePath('/admin/articles');
    return { success: true, count: toAddresses.length };
}
