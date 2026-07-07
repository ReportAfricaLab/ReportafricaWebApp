import { Metadata } from 'next';
import ReportPage from './ReportClient';
import Script from 'next/script';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/[.\\/]+$/, '');
const BASE_URL = 'https://www.reportafrica.africa';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const { id } = await searchParams;
  if (!id) return { title: 'Report | ReportAfrica' };

  try {
    const res = await fetch(`${API_URL}/reports/${id}`, { next: { revalidate: 60 } });
    const report = await res.json();
    if (!report?.title) return { title: 'Report | ReportAfrica' };

    const ogImage = report.media?.[0]?.url || `${BASE_URL}/logo.png`;
    const description = (report.aiHeadline || report.description)?.substring(0, 200) || 'View this report on ReportAfrica';
    const url = `${BASE_URL}/report?id=${id}`;

    return {
      title: `${report.aiHeadline || report.title} | ReportAfrica`,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: report.aiHeadline || report.title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: report.title }],
        url,
        type: 'article',
        siteName: 'ReportAfrica',
        publishedTime: report.createdAt,
        modifiedTime: report.updatedAt,
        authors: [report.author?.displayName || 'ReportAfrica Contributor'],
        tags: [report.category, report.country, 'Africa', 'citizen journalism'],
      },
      twitter: {
        card: 'summary_large_image',
        title: report.aiHeadline || report.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Report | ReportAfrica' };
  }
}

async function getReport(id: string) {
  try {
    const res = await fetch(`${API_URL}/reports/${id}`, { next: { revalidate: 60 } });
    return res.json();
  } catch {
    return null;
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const report = id ? await getReport(id) : null;

  const jsonLd = report ? {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: report.aiHeadline || report.title,
    description: report.description?.substring(0, 200),
    image: report.media?.[0]?.url ? [report.media[0].url] : [`${BASE_URL}/logo.png`],
    datePublished: report.createdAt,
    dateModified: report.updatedAt || report.createdAt,
    author: {
      '@type': 'Person',
      name: report.author?.displayName || 'ReportAfrica Contributor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ReportAfrica',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/report?id=${id}` },
    articleSection: report.category?.replace('_', ' '),
    keywords: [report.category, report.country, 'Africa', 'citizen journalism', 'breaking news'].join(', '),
    locationCreated: {
      '@type': 'Place',
      name: report.city || report.state || report.country,
      address: { '@type': 'PostalAddress', addressCountry: report.country },
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <Script
          id="report-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ReportPage />
    </>
  );
}
