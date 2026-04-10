export const ADMIN_EMAILS = [
    'barannnbozkurttb.b@gmail.com',
    'barannnnbozkurttb.b@gmail.com'
] as const;

/**
 * Quick check if a user email is an admin email.
 * For use in places where you already have the user object.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
}
