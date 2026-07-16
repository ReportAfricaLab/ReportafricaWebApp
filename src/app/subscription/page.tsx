'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function SubscriptionPage() {
  const { token, user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [mySub, setMySub] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/subscription/plans?country=${user?.country || 'NG'}`).then(r => r.json()).then(setPlans).catch(() => {});
    if (token) fetch(`${API_URL}/subscription/my`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setMySub).catch(() => {});
  }, [token]);

  const handleSubscribe = async (tier: string) => {
    if (!token || !user?.email) return;
    try {
      const res = await fetch(`${API_URL}/subscription/subscribe`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ tier, email: user.email }) });
      const data = await res.json();
      if (data.paymentUrl) window.location.href = data.paymentUrl;
    } catch {}
  };

  const tierColors: Record<string, string> = { pro: 'border-blue-500 ring-blue-100', elite: 'border-purple-500 ring-purple-100', legend: 'border-amber-500 ring-amber-100' };
  const tierIcons: Record<string, string> = { pro: '🔵', elite: '💜', legend: '👑' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">⭐ Premium Reporter</h1>
      <p className="text-gray-500 text-sm mb-6">Upgrade for verification badge, priority ranking, and pro tools.</p>

      {mySub && mySub.active && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-semibold text-green-800">✓ Active: {mySub.tier.toUpperCase()} plan</p>
          <p className="text-xs text-green-600 mt-1">Expires: {new Date(mySub.expires).toLocaleDateString()}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((p: any) => (
          <div key={p.tier} className={`bg-white border-2 rounded-xl p-6 text-center ${tierColors[p.tier] || 'border-gray-200'} ${p.tier === 'elite' ? 'ring-2' : ''}`}>
            <p className="text-2xl mb-1">{tierIcons[p.tier]}</p>
            <h3 className="text-lg font-bold text-gray-900">{p.label}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{p.currency} {p.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="text-xs text-gray-600 mt-4 space-y-1.5 text-left">
              {p.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
            </ul>
            {isAuthenticated && (
              <button onClick={() => handleSubscribe(p.tier)} disabled={mySub?.tier === p.tier && mySub?.active}
                className="mt-4 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
                {mySub?.tier === p.tier && mySub?.active ? 'Current Plan' : 'Subscribe'}
              </button>
            )}
          </div>
        ))}
      </div>

      {!isAuthenticated && <p className="text-center text-sm text-gray-400 mt-6">Please <a href="/login" className="text-[#0F7B6C] underline">log in</a> to subscribe.</p>}
    </div>
  );
}
