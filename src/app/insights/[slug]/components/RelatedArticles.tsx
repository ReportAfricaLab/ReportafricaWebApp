import Link from 'next/link';
import Image from 'next/image';

export default function RelatedArticles({ articles }: { articles: any[] }) {
  if (!articles?.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Related Insights</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((post) => (
          <Link key={post.id} href={`/insights/${post.slug}`} className="group block rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition">
            {post.cover_image_url && (
              <div className="relative h-36 w-full bg-gray-100">
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#0F7B6C] transition line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
