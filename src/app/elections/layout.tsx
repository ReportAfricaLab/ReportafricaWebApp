import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Election Monitor — Real-Time Citizen Election Reporting',
  description: 'Track elections across Africa in real time. Citizen-submitted results, incident reports, live streams, and parallel vote tabulation.',
  openGraph: {
    title: 'Election Monitor | ReportAfrica',
    description: 'Real-time citizen election reporting across Africa — results, incidents, live streams, and parallel vote tabulation.',
    url: 'https://www.reportafrica.africa/elections',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'ReportAfrica Election Monitor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Election Monitor | ReportAfrica',
    description: 'Real-time citizen election reporting across Africa.',
    images: ['/logo.png'],
  },
};

export default function ElectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
