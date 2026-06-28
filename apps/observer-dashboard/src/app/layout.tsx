import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReportAfrica — Election Observers',
  description: 'Real-time election intelligence for accredited observers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
