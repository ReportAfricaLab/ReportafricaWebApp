import { MetadataRoute } from 'next';
import { getAllArticleSlugs } from '../../sanity/queries';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';
const BASE_URL = 'https://www.reportafrica.africa';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/feed`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${BASE_URL}/live`, lastModified: new Date(), changeFrequency: 'always', priority: 0.8 },
    { url: `${BASE_URL}/elections`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/donations`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/guidelines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/security`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/media-licensing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/bounty`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/assignments`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  // Dynamic report pages
  let reportPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/reports/feed?page=1&limit=100`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const reports = Array.isArray(data) ? data : data?.data || [];
    reportPages = reports.map((r: any) => ({
      url: `${BASE_URL}/report?id=${r.id}`,
      lastModified: new Date(r.updatedAt || r.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch {}

  // Dynamic donation campaign pages
  let campaignPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/donations/campaigns/feed?page=1&limit=50`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const campaigns = Array.isArray(data) ? data : data?.data || [];
    campaignPages = campaigns.map((c: any) => ({
      url: `${BASE_URL}/donations/campaign?id=${c.id}`,
      lastModified: new Date(c.updatedAt || c.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));
  } catch {}

  // Dynamic insights/blog pages
  let insightPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllArticleSlugs();
    insightPages = slugs.map((s: any) => ({
      url: `${BASE_URL}/insights/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticPages, ...reportPages, ...campaignPages, ...insightPages];
}
