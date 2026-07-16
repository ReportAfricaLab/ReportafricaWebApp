export const articleSchema = {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (R: any) => R.required().max(60) },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (R: any) => R.required() },
    { name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'mainImage', title: 'Main Image', type: 'image', options: { hotspot: true } },
    { name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, validation: (R: any) => R.required().max(160) },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
    { name: 'is_approved_for_publication', title: 'Approved for Publication', type: 'boolean', initialValue: false },
    { name: 'seoTitle', title: 'SEO Title', type: 'string', validation: (R: any) => R.max(60) },
    { name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, validation: (R: any) => R.max(155) },
  ],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'mainImage' },
    prepare({ title, author, media }: any) {
      return { title, subtitle: author ? `by ${author}` : '', media };
    },
  },
};
