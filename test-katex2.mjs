import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';

import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      div: [...(defaultSchema.attributes?.div || []), ['className', 'math', 'math-display'], 'style'],
      span: [...(defaultSchema.attributes?.span || []), ['className', 'math', 'math-inline'], 'style', 'data-type', 'data-latex'],
    }
  })
  .use(rehypeKatex)
  .use(rehypeStringify);

const md = `$$R_s = \\frac{2GM}{c^2}$$`;

async function main() {
  const result = await processor.process(md);
  console.log(result.value);
}

main();
