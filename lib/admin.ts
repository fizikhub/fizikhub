import { createClient } from '@/lib/supabase-server';
import { ADMIN_EMAILS, isAdminEmail } from './admin-shared';

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

    const isEmailAdmin = isAdminEmail(user.email);

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

export { ADMIN_EMAILS, isAdminEmail };
