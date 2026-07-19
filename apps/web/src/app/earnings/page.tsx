'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const SOURCE_ICONS: Record<string, string> = {
  tip: '💰', media_license: '📄', breaking_news: '🔴', referral: '🎁',
  ad_revenue: '📊', assignment_desk: '📋', trust_bonus: '🏆', bounty: '🎯',
  sponsorship: '🏷️', fan_subscription: '⭐', stream_ticket: '🎟️', commission: '💼',
};

export default function EarningsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`${API_URL}/earnings/stats`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch(`${API_URL}/earnings`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ]).then(([s, e]) => {
      setStats(s);
      setEarnings(Array.isArray(e?.data) ? e.data : Array.isArray(e) ? e : []);
    }).finally(() => setLoading(false));
  }, [token]);

  if (!token) return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Please log in</div>;
  if (loading) return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">💰 My Earnings</h1>
      <p className="text-sm text-gray-500 mb-6">All earnings are paid directly to your bank account via KoraPay.</p>

      {earnings.some((e: any) => e.status === 'pending') && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <p className="text-sm font-medium text-amber-800">⚠️ You have pending earnings!</p>
          <p className="text-xs text-amber-600 mt-1">Add your bank details in <a href="/profile" className="underline font-medium">Profile Settings</a> to receive your earnings.</p>
        </div>
      )}

      {stats?.earnings?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.earnings.map((s: any) => (
            <div key={s.currency} className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-xl font-bold text-green-700">{s.currency} {Number(s.total).toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{s.transactions} transactions</p>
            </div>
          ))}
        </div>
      )}

      {earnings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">No earnings yet.</p>
          <p className="text-xs text-gray-400">Tips, bounties, breaking news bonuses, ad revenue, sponsorships, fan subscriptions, stream tickets, commissions and referral rewards all appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {earnings.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {SOURCE_ICONS[item.source] || '💵'} {(item.source || 'earning').replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description || 'Payment received'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-lg font-bold text-green-600">+{item.currency} {Number(item.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
