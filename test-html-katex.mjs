import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      div: [...(defaultSchema.attributes?.div || []), ['className', 'math', 'math-display']],
      span: [...(defaultSchema.attributes?.span || []), ['className', 'math', 'math-inline']],
    }
  })
  .use(rehypeKatex)
  .use(rehypeStringify);

async function main() {
  const html = `<p><span class="math math-inline">R_s = \\frac{2GM}{c^2}</span></p>`;
  const result = await processor.process(html);
  console.log('Result:', result.value);
}

main();
