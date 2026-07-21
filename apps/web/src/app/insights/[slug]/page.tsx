'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { marked } from 'marked';
import Image from 'next/image';
import Link from 'next/link';
import AppCTA from './components/AppCTA';
import RelatedArticles from './components/RelatedArticles';

const API_URL = 'https://api.reportafrica.africa';
const BASE_URL = 'https://www.reportafrica.africa';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function load() {
      try {
        const [postRes, allRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/insights/posts/${slug}`),
          fetch(`${API_URL}/api/v1/insights/posts?status=published`),
        ]);

        if (!postRes.ok) { setNotFound(true); setLoading(false); return; }

        const postData = await postRes.json();
        const allPosts = allRes.ok ? await allRes.json() : [];

        setPost(postData);
        setRelated(allPosts.filter((p: any) => p.slug !== slug).slice(0, 3));
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen py-16 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
        <p className="text-gray-500 mb-6">This article may have been removed or the link is incorrect.</p>
        <Link href="/insights" className="px-6 py-3 bg-[#0F7B6C] text-white rounded-xl font-semibold hover:bg-[#0a6358] transition">
          Back to Insights
        </Link>
      </main>
    );
  }

  const imageUrl = post.cover_image_url || `${BASE_URL}/logo.png`;

  return (
    <main className="min-h-screen py-16 px-4">
      <article className="max-w-3xl mx-auto">
        {post.tags?.[0] && (
          <span className="text-xs font-semibold text-[#0F7B6C] uppercase tracking-wide">
            {post.tags[0]}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          {post.author && <span>By {post.author}</span>}
          <span>
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
        </div>

        {post.cover_image_url && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: marked.parse(post.body || '') as string }}
        />

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
