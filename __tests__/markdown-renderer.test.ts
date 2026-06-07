import { describe, expect, it } from 'vitest';
import { preprocessMarkdownContent } from '../components/markdown-renderer';
import { markdownToHtml } from '../components/server-markdown-renderer';

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

describe('server markdown safety', () => {
    it('neutralizes unsafe markdown links and raw HTML handlers', () => {
        const html = markdownToHtml([
            '[zararlı](javascript:alert(1))',
            '<img src="javascript:alert(1)" onerror="alert(2)">',
            '<script>alert(3)</script>',
        ].join('\n\n'));

        expect(html).not.toContain('javascript:');
        expect(html).not.toContain('onerror');
        expect(html).not.toContain('<script>');
        expect(html).toContain('href="#"');
        expect(html).toContain('src="#"');
    });

    it('keeps allowed embeds while dropping unknown iframes', () => {
        const html = markdownToHtml([
            '<iframe src="https://www.youtube.com/embed/abc123xyz" title="Ders videosu" srcdoc="<script>alert(1)</script>" onload="alert(2)"></iframe>',
            '<iframe src="https://example.com/embed"></iframe>',
        ].join('\n\n'));

        expect(html).toContain('https://www.youtube.com/embed/abc123xyz');
        expect(html).toContain('title="Ders videosu"');
        expect(html).toContain('sandbox="allow-scripts allow-same-origin allow-popups"');
        expect(html).not.toContain('srcdoc');
        expect(html).not.toContain('onload');
        expect(html).not.toContain('https://example.com/embed');
    });
});
