import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!url || !key) {
        console.error("Supabase credentials missing! Check .env.local");
        return createBrowserClient('https://placeholder.supabase.co', 'placeholder');
    }

    return createBrowserClient(url, key);
}
