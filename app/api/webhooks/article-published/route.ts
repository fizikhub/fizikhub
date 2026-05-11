import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the webhook request
    const authHeader = req.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized', detail: 'Secret mismatch' }, { status: 401 });
    }

    // This webhook used to send emails automatically.
    // Email sending has been decoupled and is now triggered manually via the Admin UI.
    return NextResponse.json({ message: 'Auto-email disabled. Emails are now sent manually via Admin UI.' });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', detail: error?.message }, { status: 500 });
  }
}
