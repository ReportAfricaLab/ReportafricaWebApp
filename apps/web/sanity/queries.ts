import { client } from './client';

export async function getAllArticles() {
  return client.fetch(`
    *[_type == "article" && is_approved_for_publication == true] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt,
      "category": category->{ title, slug },
      "author": author->{ name, image },
      mainImage
    }
  `);
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`
    *[_type == "article" && slug.current == $slug && is_approved_for_publication == true][0] {
      _id, title, slug, excerpt, body, publishedAt,
      "category": category->{ title, slug },
      "author": author->{ name, image, bio },
      mainImage, seoTitle, seoDescription, tags
    }
  `, { slug });
}

export async function getRelatedArticles(categorySlug: string, currentSlug: string) {
  return client.fetch(`
    *[_type == "article" && category->slug.current == $categorySlug && slug.current != $currentSlug && is_approved_for_publication == true] | order(publishedAt desc) [0..2] {
      _id, title, slug, excerpt, publishedAt, mainImage,
      "category": category->{ title, slug }
    }
  `, { categorySlug, currentSlug });
}

export async function getAllArticleSlugs() {
  return client.fetch(`*[_type == "article" && is_approved_for_publication == true]{ "slug": slug.current }`);
}
