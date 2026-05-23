import { describe, it, expect } from 'vitest';
import { checkContent } from '../lib/moderation';

describe('checkContent — Moderation System', () => {
    // Clean content
    it('should pass clean content', async () => {
        const result = await checkContent('Bu bir fizik makalesidir. E=mc² formülünü inceleyelim.');
        expect(result.isClean).toBe(true);
        expect(result.isFlagged).toBe(false);
    });

    it('should pass empty content', async () => {
        const result = await checkContent('');
        expect(result.isClean).toBe(true);
        expect(result.isFlagged).toBe(false);
    });

    // Keyword detection
    it('should flag forbidden keyword: porno', async () => {
        const result = await checkContent('Bu içerikte porno var');
        expect(result.isClean).toBe(false);
        expect(result.isFlagged).toBe(true);
    });

    it('should flag forbidden keyword: kumar', async () => {
        const result = await checkContent('Online kumar siteleri');
        expect(result.isClean).toBe(false);
        expect(result.isFlagged).toBe(true);
    });

    it('should flag forbidden keyword: bahis', async () => {
        const result = await checkContent('Bahis oynayın kazanın');
        expect(result.isClean).toBe(false);
        expect(result.isFlagged).toBe(true);
    });

    // Obfuscation detection
    it('should detect obfuscated "p0rn0" with number substitution', async () => {
        const result = await checkContent('p0rn0 sitesi');
        expect(result.isFlagged).toBe(true);
    });

    it('should detect obfuscated "b.o.m.b.a" with dots', async () => {
        const result = await checkContent('b.o.m.b.a yapımı');
        expect(result.isFlagged).toBe(true);
    });

    // Suspicious URL patterns
    it('should flag suspicious TLD (.ru)', async () => {
        const result = await checkContent('Linke tıklayın: http://malware.ru/virus');
        expect(result.isFlagged).toBe(true);
    });

    it('should flag suspicious TLD (.tk)', async () => {
        const result = await checkContent('http://scam.tk/free');
        expect(result.isFlagged).toBe(true);
    });

    // Safe URLs should pass
    it('should pass safe URLs', async () => {
        const result = await checkContent('Kaynak: https://arxiv.org/abs/2301.12345');
        expect(result.isClean).toBe(true);
    });

    // Spam patterns
    it('should flag spam phrases', async () => {
        const result = await checkContent('Bedava iphone kazandınız!');
        expect(result.isFlagged).toBe(true);
    });

    // Scientific content that might look suspicious but should pass
    it('should pass scientific content about explosions/reactions', async () => {
        const result = await checkContent('Nükleer fisyon reaksiyonunda enerji açığa çıkar');
        expect(result.isClean).toBe(true);
    });
});
