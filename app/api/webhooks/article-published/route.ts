import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import NewArticleEmail from '@/components/emails/NewArticleEmail';
import * as React from 'react';

export async function POST(req: Request) {
  try {
    // Initialize Resend inside the handler to prevent build errors
    const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

    // 1. Authenticate the webhook request
    // Verify a custom header or query param secret to ensure it's from Supabase
    const authHeader = req.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // Ensure this is an INSERT operation and we have a new record
    if (payload.type !== 'INSERT' || !payload.record) {
      return NextResponse.json({ message: 'Ignoring non-insert events' });
    }

    const article = payload.record;

    // Only send if the article is actually published
    if (!article.published) {
      return NextResponse.json({ message: 'Article not published yet' });
    }

    // 2. Fetch users who want email notifications
    const supabase = createAdminClient();
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('email, full_name, username')
      .eq('wants_email_notifications', true)
      .not('email', 'is', null);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // TEST İÇİN SADECE BU KULLANICIYA GÖNDERİLİR
    const testUsers = [{ email: 'barannnbozkurttb.b@gmail.com', full_name: 'Test', username: 'test' }];

    if (!testUsers || testUsers.length === 0) {
      return NextResponse.json({ message: 'No users to notify' });
    }

    // 3. Prepare email content
    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fizikhub.com'}/makale/${article.slug}`;
    const htmlContent = await render(
      React.createElement(NewArticleEmail, {
        title: article.title,
        excerpt: article.excerpt || 'Fizikhub\'da yeni bir makale yayınlandı.',
        articleUrl: articleUrl,
        imageUrl: article.image_url,
      })
    );

    // 4. Prepare batch payload for Resend
    // Resend Batch API allows up to 100 emails per request. We slice the array if necessary.
    // However, the standard Resend Node.js SDK batch method accepts an array of email objects.
    const CHUNK_SIZE = 100;
    const emailBatches = [];

    for (let i = 0; i < testUsers.length; i += CHUNK_SIZE) {
      const chunk = testUsers.slice(i, i + CHUNK_SIZE);
      const batchPayload = chunk.map((user) => ({
        from: 'Fizikhub <onboarding@resend.dev>', // Test için Resend'in izin verdiği domain
        to: user.email!,
        subject: `Yeni Makale: ${article.title}`,
        html: htmlContent,
      }));
      emailBatches.push(batchPayload);
    }

    // 5. Send emails
    for (const batch of emailBatches) {
      const { error } = await resend.batch.send(batch);
      if (error) {
        console.error('Error sending batch via Resend:', error);
        // We might want to continue to the next batch even if one fails
      }
    }

    return NextResponse.json({ message: 'Emails queued for sending', count: users.length });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
