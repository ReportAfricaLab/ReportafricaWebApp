'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { observerAPI } from '@/lib/api';

const NAV_ITEMS = [
  { href: '/overview', icon: '📡', label: 'Overview' },
  { href: '/results', icon: '📊', label: 'Live Results' },
  { href: '/parallel', icon: '🗳️', label: 'Parallel Count' },
  { href: '/alerts', icon: '🚨', label: 'Alerts' },
  { href: '/evidence', icon: '📸', label: 'Evidence' },
  { href: '/export', icon: '📥', label: 'Export' },
  { href: '/team', icon: '👥', label: 'Team' },
  { href: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function ObserverShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [observer, setObserver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('obs_token');
    if (!token) { window.location.href = '/'; return; }
    observerAPI.getMe().then(data => {
      if (Array.isArray(data) && data.length > 0 && data[0].status === 'observer_active') {
        setObserver(data[0]);
      } else {
        window.location.href = '/';
      }
      setLoading(false);
    }).catch(() => { window.location.href = '/'; });
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const daysLeft = observer?.expiresAt ? Math.max(0, Math.ceil((new Date(observer.expiresAt).getTime() - Date.now()) / 86400000)) : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1E293B] border-r border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-sm font-bold text-white">🗳️ ReportAfrica</h1>
          <p className="text-xs text-emerald-400 mt-0.5">Observer Dashboard</p>
        </div>

        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition ${pathname === item.href ? 'bg-emerald-600/10 text-emerald-400 border-r-2 border-emerald-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="bg-[#0F172A] rounded-lg p-3">
            <p className="text-xs text-gray-400">Country: <span className="text-white font-semibold">{observer?.country}</span></p>
            <p className="text-xs text-gray-400 mt-1">Tier: <span className="text-white font-semibold capitalize">{observer?.tier}</span></p>
            <p className="text-xs mt-1"><span className={daysLeft <= 7 ? 'text-red-400' : 'text-emerald-400'}>{daysLeft} days remaining</span></p>
          </div>
          <button onClick={() => { localStorage.removeItem('obs_token'); window.location.href = '/'; }}
            className="w-full mt-3 text-xs text-gray-500 hover:text-white transition">Log out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
