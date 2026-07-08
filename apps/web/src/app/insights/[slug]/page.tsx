import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from '../../../../sanity/queries';
import { urlFor } from '../../../../sanity/client';
import AppCTA from './components/AppCTA';
import RelatedArticles from './components/RelatedArticles';

export const revalidate = 3600;

const BASE_URL = 'https://www.reportafrica.africa';

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((s: any) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : `${BASE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: { canonical: `/insights/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/insights/${params.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author?.name],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = article.category
    ? await getRelatedArticles(article.category.slug.current, params.slug)
    : [];

  const imageUrl = article.mainImage ? urlFor(article.mainImage).width(1200).height(630).url() : `${BASE_URL}/logo.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author?.name || 'ReportAfrica' },
    publisher: {
      '@type': 'Organization',
      name: 'ReportAfrica',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/insights/${params.slug}` },
  };

  return (
    <main className="min-h-screen py-16 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-3xl mx-auto">
        {article.category && (
          <span className="text-xs font-semibold text-[#0F7B6C] uppercase tracking-wide">
            {article.category.title}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{article.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          {article.author?.name && <span>By {article.author.name}</span>}
          {article.publishedAt && (
            <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        {article.mainImage && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image src={imageUrl} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
          {article.body && <PortableText value={article.body} />}
        </div>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {article.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        <AppCTA />
        <RelatedArticles articles={related} />
      </article>
    </main>
  );
}
