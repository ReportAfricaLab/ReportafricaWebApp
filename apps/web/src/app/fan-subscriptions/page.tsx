'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type Tab = 'subscriptions' | 'subscribers';

export default function FanSubscriptionsPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([api.fanSub.mySubscriptions(token), api.fanSub.mySubscribers(token)])
      .then(([subData, srData]) => {
        setSubscriptions(Array.isArray(subData?.data) ? subData.data : []);
        setSubscribers(Array.isArray(srData?.data) ? srData.data : []);
      }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const cancel = async (reporterId: string) => {
    if (!token || !confirm('Cancel this subscription?')) return;
    setCancelling(reporterId);
    try {
      await api.fanSub.cancel(token, reporterId);
      setSubscriptions((prev) => prev.filter((s) => s.reporterId !== reporterId));
    } catch (e: any) { alert(e.message || 'Failed'); }
    finally { setCancelling(null); }
  };

  if (!token) return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Please log in</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">⭐ Fan Subscriptions</h1>
      <p className="text-sm text-gray-500 mb-6">Support reporters you love. Earn from your fans.</p>

      <div className="flex border-b border-gray-200 mb-6">
        {(['subscriptions', 'subscribers'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${tab === t ? 'border-[#0F7B6C] text-[#0F7B6C]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'subscriptions' ? `📺 I Subscribe To (${subscriptions.length})` : `👥 My Subscribers (${subscribers.length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
        <div className="space-y-3">
          {(tab === 'subscriptions' ? subscriptions : subscribers).length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              {tab === 'subscriptions' ? "You haven't subscribed to any reporters yet." : 'No subscribers yet.'}
            </p>
          ) : (tab === 'subscriptions' ? subscriptions : subscribers).map((item: any) => (
            <div key={item.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F7B6C] flex items-center justify-center text-white font-bold">
                  {(tab === 'subscriptions' ? item.reporter?.displayName : item.fan?.displayName)?.[0] || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {tab === 'subscriptions' ? item.reporter?.displayName : item.fan?.displayName}
                  </p>
                  <p className="text-xs text-amber-600">⭐ {item.tier} · {item.currency} {Number(item.amount).toLocaleString()}/mo</p>
                  {item.currentPeriodEnd && (
                    <p className="text-xs text-gray-400">Renews {new Date(item.currentPeriodEnd).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              {tab === 'subscriptions' && (
                <button onClick={() => cancel(item.reporterId)} disabled={cancelling === item.reporterId}
                  className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 transition">
                  {cancelling === item.reporterId ? '...' : 'Cancel'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
