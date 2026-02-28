import { createClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = [
    'barannnbozkurttb.b@gmail.com',
    'barannnnbozkurttb.b@gmail.com'
] as const;

/**
 * Centralized admin verification utility.
 * Checks both email AND database role for defense-in-depth.
 * Use this instead of hardcoded email checks throughout the codebase.
 */
export async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { isAdmin: false, user: null, supabase, error: "Giriş yapmalısınız." } as const;
    }

    const isEmailAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() as any);

    if (isEmailAdmin) {
        return { isAdmin: true, user, supabase, error: null } as const;
    }

    // Fallback to database role check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role === 'admin') {
        return { isAdmin: true, user, supabase, error: null } as const;
    }

    return { isAdmin: false, user, supabase, error: "Bu işlem için admin yetkisi gereklidir." } as const;
}

/**
 * Quick check if a user email is an admin email.
 * For use in places where you already have the user object.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase() as any);
}

export { ADMIN_EMAILS };
