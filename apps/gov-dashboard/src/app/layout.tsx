import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReportAfrica - Government Intelligence Dashboard',
  description: 'Real-time civic intelligence for government agencies',
};

export default function GovLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0F172A] text-gray-100 min-h-screen">
        <div className="flex">
          <aside className="w-60 min-h-screen bg-[#0B1120] border-r border-gray-800 p-6 fixed">
            <h1 className="text-lg font-bold text-blue-400 mb-8">🏛️ Gov Intel</h1>
            <nav className="space-y-1 text-sm">
              <a href="/" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Overview</a>
              <a href="/incidents" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Incidents</a>
              <a href="/hotspots" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Hotspots</a>
              <a href="/emergencies" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Emergencies</a>
              <a href="/trends" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Trends</a>
            </nav>
          </aside>
          <main className="flex-1 ml-60 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
