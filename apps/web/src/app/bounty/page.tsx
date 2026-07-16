'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  claimed: 'bg-amber-100 text-amber-700',
  expired: 'bg-gray-100 text-gray-500',
};

export default function BountyPage() {
  const { token, user } = useAuth();
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const country = (user as any)?.country || 'NG';

  useEffect(() => { load(); }, [country]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.bounty.getFeed(country);
      setBounties(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch { setBounties([]); } finally { setLoading(false); }
  };

  const claim = async (id: string) => {
    if (!token) { alert('Please log in to claim bounties'); return; }
    setClaiming(id);
    try { await api.bounty.claim(token, id); load(); }
    catch (e: any) { alert(e.message || 'Could not claim bounty'); }
    finally { setClaiming(null); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">🎯 Bounty Board</h1>
      <p className="text-sm text-gray-500 mb-6">Claim a bounty, file the report, earn the reward.</p>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading...</p>
      ) : bounties.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No open bounties in your country right now.</p>
      ) : (
        <div className="space-y-4">
          {bounties.map((b: any) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-500'}`}>
                  {b.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400 capitalize">{b.category}</span>
                {b.country && <span className="text-xs text-gray-400">{b.country}</span>}
              </div>
              <h2 className="font-semibold text-gray-900 mb-1">{b.title}</h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{b.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-600">{b.rewardCurrency} {Number(b.rewardAmount).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Expires {new Date(b.expiresAt).toLocaleDateString()}</p>
                </div>
                {b.status === 'open' && (
                  <button onClick={() => claim(b.id)} disabled={claiming === b.id}
                    className="bg-[#0F7B6C] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#0a6358] disabled:opacity-50 transition">
                    {claiming === b.id ? 'Claiming...' : 'Claim Bounty'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
