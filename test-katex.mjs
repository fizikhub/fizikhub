import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      div: [...(defaultSchema.attributes?.div || []), 'className', 'math', 'math-display', 'class'],
      span: [...(defaultSchema.attributes?.span || []), 'className', 'math', 'math-inline', 'class'],
      math: ['xmlns', 'display'],
      semantics: [],
      annotation: ['encoding'],
      mrow: [], mi: [], mo: [], mn: [], msup: [], msub: [], mfrac: [], mspace: ['width'],
      mtext: [], menclose: ['notation'], mover: [], munder: [], msqrt: [], mroot: [],
      mtable: [], mtr: [], mtd: [],
    },
    tagNames: [
      ...(defaultSchema.tagNames || []),
      'math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac',
      'mspace', 'mtext', 'menclose', 'mover', 'munder', 'msqrt', 'mroot', 'mtable', 'mtr', 'mtd',
    ],
  })
  .use(rehypeKatex)
  .use(rehypeStringify);

const md = `$$R_s = \\frac{2GM}{c^2}$$`;

async function main() {
  const result = await processor.process(md);
  console.log(result.value);
}

main();
