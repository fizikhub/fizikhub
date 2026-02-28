/**
 * Security utility functions for input sanitization
 */

/**
 * Sanitize search query by escaping SQL LIKE/ILIKE wildcard characters.
 * Prevents wildcard injection in search queries.
 */
export function sanitizeSearchQuery(query: string): string {
    return query
        .replace(/\\/g, '\\\\') // escape backslash first
        .replace(/%/g, '\\%')   // escape percent
        .replace(/_/g, '\\_');  // escape underscore
}

/**
 * Allowed image MIME types for file uploads
 */
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
] as const;

/**
 * Allowed file extensions for image uploads
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'] as const;

/**
 * Maximum file size for uploads (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate an uploaded file for security
 * @returns null if valid, error message if invalid
 */
export function validateImageFile(file: File): string | null {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return `Dosya boyutu çok büyük. Maksimum ${MAX_FILE_SIZE / (1024 * 1024)}MB olabilir.`;
    }

    // Check MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
        return `Geçersiz dosya tipi: ${file.type}. Sadece JPEG, PNG, GIF, WebP ve AVIF desteklenir.`;
    }

    // Check extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext as any)) {
        return `Geçersiz dosya uzantısı. Sadece ${ALLOWED_IMAGE_EXTENSIONS.join(', ')} desteklenir.`;
    }

    return null; // Valid
}

/**
 * Validate password strength
 * @returns null if valid, error message if invalid
 */
export function validatePasswordStrength(password: string): string | null {
    if (!password) {
        return "Şifre boş olamaz.";
    }
    if (password.length < 8) {
        return "Şifre en az 8 karakter olmalıdır.";
    }
    if (password.length > 128) {
        return "Şifre 128 karakterden uzun olamaz.";
    }
    if (!/[a-z]/.test(password)) {
        return "Şifre en az bir küçük harf içermelidir.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Şifre en az bir büyük harf içermelidir.";
    }
    if (!/[0-9]/.test(password)) {
        return "Şifre en az bir rakam içermelidir.";
    }
    return null; // Valid
}
