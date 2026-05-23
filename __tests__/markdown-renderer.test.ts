import { describe, expect, it } from 'vitest';
import { preprocessMarkdownContent } from '../components/markdown-renderer';

describe('preprocessMarkdownContent', () => {
    it('keeps markdown heading markers attached to their text', () => {
        const result = preprocessMarkdownContent([
            '# Ana Başlık',
            '## Alt Başlık',
            '### Üçüncü Başlık',
        ].join('\n'));

        expect(result).toContain('# Ana Başlık');
        expect(result).toContain('## Alt Başlık');
        expect(result).toContain('### Üçüncü Başlık');
        expect(result).not.toContain('##\n\nAlt Başlık');
    });

    it('does not rewrite heading-like lines inside fenced code blocks', () => {
        const result = preprocessMarkdownContent([
            '```md',
            '## Kod İçindeki Başlık',
            '```',
            '## Gerçek Başlık',
        ].join('\n'));

        expect(result).toContain('```md\n## Kod İçindeki Başlık\n```');
        expect(result).toContain('## Gerçek Başlık');
    });

    it('normalizes closing heading hashes', () => {
        const result = preprocessMarkdownContent('## Başlık ##');

        expect(result).toBe('## Başlık');
    });
});
