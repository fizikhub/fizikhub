import { NextResponse } from 'next/server';
import { isValidBearerToken } from '@/lib/security';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the webhook request
    const authHeader = req.headers.get('Authorization');
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    if (!isValidBearerToken(authHeader, webhookSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This webhook used to send emails automatically.
    // Email sending has been decoupled and is now triggered manually via the Admin UI.
    return NextResponse.json({ message: 'Auto-email disabled. Emails are now sent manually via Admin UI.' });
    
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
