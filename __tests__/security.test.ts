import { describe, it, expect } from 'vitest';
import { validatePasswordStrength, sanitizeSearchQuery, validateImageFile } from '../lib/security';

describe('validatePasswordStrength', () => {
    it('should reject empty password', () => {
        expect(validatePasswordStrength('')).toBe('Şifre boş olamaz.');
    });

    it('should reject short password (< 8 chars)', () => {
        expect(validatePasswordStrength('Ab1!')).toContain('8 karakter');
    });

    it('should reject too long password (> 128 chars)', () => {
        const longPass = 'Aa1!' + 'x'.repeat(130);
        expect(validatePasswordStrength(longPass)).toContain('128 karakter');
    });

    it('should reject password without lowercase', () => {
        expect(validatePasswordStrength('ABCDEFG1!')).toContain('küçük harf');
    });

    it('should reject password without uppercase', () => {
        expect(validatePasswordStrength('abcdefg1!')).toContain('büyük harf');
    });

    it('should reject password without digit', () => {
        expect(validatePasswordStrength('Abcdefgh!')).toContain('rakam');
    });

    it('should reject password without special character', () => {
        expect(validatePasswordStrength('Abcdefg1')).toContain('özel karakter');
    });

    it('should accept strong password', () => {
        expect(validatePasswordStrength('MyStr0ng!Pass')).toBeNull();
    });

    it('should accept password with various special chars', () => {
        expect(validatePasswordStrength('Test123$%^')).toBeNull();
    });
});

describe('sanitizeSearchQuery', () => {
    it('should escape backslash', () => {
        expect(sanitizeSearchQuery('test\\query')).toBe('test\\\\query');
    });

    it('should escape percent sign', () => {
        expect(sanitizeSearchQuery('100%')).toBe('100\\%');
    });

    it('should escape underscore', () => {
        expect(sanitizeSearchQuery('hello_world')).toBe('hello\\_world');
    });

    it('should escape multiple special chars', () => {
        expect(sanitizeSearchQuery('test%_\\')).toBe('test\\%\\_\\\\');
    });

    it('should leave normal text unchanged', () => {
        expect(sanitizeSearchQuery('fizik dersi')).toBe('fizik dersi');
    });

    it('should handle empty string', () => {
        expect(sanitizeSearchQuery('')).toBe('');
    });
});

describe('validateImageFile', () => {
    function createMockFile(name: string, size: number, type: string): File {
        const buffer = new ArrayBuffer(size);
        return new File([buffer], name, { type });
    }

    it('should accept valid JPEG file', () => {
        const file = createMockFile('photo.jpg', 1024 * 1024, 'image/jpeg');
        expect(validateImageFile(file)).toBeNull();
    });

    it('should accept valid PNG file', () => {
        const file = createMockFile('image.png', 2 * 1024 * 1024, 'image/png');
        expect(validateImageFile(file)).toBeNull();
    });

    it('should accept valid WebP file', () => {
        const file = createMockFile('photo.webp', 500 * 1024, 'image/webp');
        expect(validateImageFile(file)).toBeNull();
    });

    it('should reject file exceeding 5MB', () => {
        const file = createMockFile('large.jpg', 6 * 1024 * 1024, 'image/jpeg');
        const result = validateImageFile(file);
        expect(result).toContain('boyutu');
    });

    it('should reject invalid MIME type', () => {
        const file = createMockFile('script.js', 1024, 'application/javascript');
        const result = validateImageFile(file);
        expect(result).toContain('Geçersiz dosya tipi');
    });

    it('should reject invalid extension', () => {
        const file = createMockFile('image.exe', 1024, 'image/jpeg');
        const result = validateImageFile(file);
        expect(result).toContain('uzantısı');
    });
});
