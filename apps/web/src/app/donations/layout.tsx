import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Helping Hands — Support Fellow Africans',
  description: 'Donate to verified humanitarian campaigns across Africa. Support medical emergencies, disaster relief, education, and community causes.',
  openGraph: {
    title: 'Community Helping Hands | ReportAfrica',
    description: 'Donate to verified humanitarian campaigns across Africa — medical, disaster, education, and community causes.',
    url: 'https://www.reportafrica.africa/donations',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'ReportAfrica Community Helping Hands' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Helping Hands | ReportAfrica',
    description: 'Support verified humanitarian campaigns across Africa.',
    images: ['/logo.png'],
  },
};

export default function DonationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
