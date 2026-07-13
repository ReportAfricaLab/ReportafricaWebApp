import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 300;

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Insights — Citizen Journalism Reports & Guides',
  description: 'Data-driven insights, civic reports, and feature guides from the ReportAfrica platform.',
  alternates: { canonical: '/insights' },
};

async function getAllPosts() {
  try {
    const res = await fetch(`${API_URL}/insights/posts?status=published&limit=50`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.posts ?? []);
  } catch {
    return [];
  }
}

export default async function InsightsPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Insights</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Civic reports, platform guides, and data-driven stories from across Africa.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No articles published yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/insights/${post.slug}`} className="group block rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
                {post.cover_image_url && (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  {post.tags?.length > 0 && (
                    <span className="text-xs font-semibold text-[#0F7B6C] uppercase tracking-wide">
                      {post.tags[0]}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#0F7B6C] transition">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
