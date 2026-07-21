import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import AppCTA from './components/AppCTA';
import RelatedArticles from './components/RelatedArticles';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa';
const BASE_URL = 'https://www.reportafrica.africa';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/insights/posts/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelated(excludeSlug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/insights/posts?status=published`, { cache: 'no-store' });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.filter((p: any) => p.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const imageUrl = post.cover_image_url || `${BASE_URL}/logo.png`;

  return {
    title,
    description,
    alternates: { canonical: `/insights/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/insights/${params.slug}`,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [post, related] = await Promise.all([getPost(params.slug), getRelated(params.slug)]);
  if (!post) notFound();

  const imageUrl = post.cover_image_url || `${BASE_URL}/logo.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.published_at,
    author: { '@type': 'Person', name: post.author || 'ReportAfrica' },
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
        {post.tags?.[0] && (
          <span className="text-xs font-semibold text-[#0F7B6C] uppercase tracking-wide">
            {post.tags[0]}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          {post.author && <span>By {post.author}</span>}
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        {post.cover_image_url && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag: string) => (
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
