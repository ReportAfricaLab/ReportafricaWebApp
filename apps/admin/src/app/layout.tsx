import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReportAfrica Admin',
  description: 'Internal admin portal for ReportAfrica platform management',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <div className="flex">
          <aside className="w-64 min-h-screen bg-gray-950 border-r border-gray-800 p-6 fixed">
            <h1 className="text-lg font-bold text-emerald-400 mb-8">🛡️ RA Admin</h1>
            <nav className="space-y-1 text-sm">
              <a href="/" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Dashboard</a>
              <a href="/users" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Users</a>
              <a href="/reports" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Reports</a>
              <a href="/campaigns" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Campaigns</a>
              <a href="/revenue" className="block px-3 py-2 rounded hover:bg-gray-800 text-gray-300">Revenue</a>
            </nav>
          </aside>
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
