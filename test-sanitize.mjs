import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'style'],
    }
  })
  .use(rehypeStringify);

async function main() {
  const html = `<div class="math math-display my-custom-class">Hello</div>`;
  const result = await processor.process(html);
  console.log('Result:', result.value);
}

main();
