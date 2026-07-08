import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../../../../sanity/client';

export default function RelatedArticles({ articles }: { articles: any[] }) {
  if (!articles?.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Related Insights</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article._id} href={`/insights/${article.slug.current}`} className="group block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition">
            {article.mainImage && (
              <div className="relative h-36 w-full bg-gray-100">
                <Image
                  src={urlFor(article.mainImage).width(400).height(250).url()}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0F7B6C] transition line-clamp-2">
                {article.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
