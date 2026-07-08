import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '../../../sanity/queries';
import { urlFor } from '../../../sanity/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Insights — Citizen Journalism Reports & Guides',
  description: 'Data-driven insights, civic reports, and feature guides from the ReportAfrica platform.',
  alternates: { canonical: '/insights' },
};

export default async function InsightsPage() {
  const articles = await getAllArticles();

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Insights</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Civic reports, platform guides, and data-driven stories from across Africa.
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500">No articles published yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link key={article._id} href={`/insights/${article.slug.current}`} className="group block rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
                {article.mainImage && (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image
                      src={urlFor(article.mainImage).width(600).height(400).url()}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  {article.category && (
                    <span className="text-xs font-semibold text-[#0F7B6C] uppercase tracking-wide">
                      {article.category.title}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-[#0F7B6C] transition">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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
