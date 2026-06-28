'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function TeamPage() {
  const [observer, setObserver] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    observerAPI.getMe().then(d => {
      if (d[0]) {
        setObserver(d[0]);
        observerAPI.getSeats(d[0].country).then(s => setSeats(Array.isArray(s) ? s : [])).catch(() => {});
      }
    });
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setLoading(true);
    // Note: In production, this would look up user by email. For now, using email as userId placeholder.
    const res = await observerAPI.inviteSeat(observer.country, inviteEmail);
    if (res.id) { setSeats([...seats, res]); setInviteEmail(''); }
    else alert(res.message || 'Failed to invite');
    setLoading(false);
  };

  const maxSeats = observer?.seats || 1;
  const usedSeats = seats.length + 1; // +1 for owner

  return (
    <ObserverShell>
      <h1 className="text-2xl font-bold text-white mb-2">👥 Team Management</h1>
      <p className="text-gray-400 text-sm mb-6">Manage observer seats for your organization</p>

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Seats used</p>
            <p className="text-2xl font-bold text-white">{usedSeats} / {maxSeats}</p>
          </div>
          <p className="text-xs text-gray-500 capitalize">Tier: {observer?.tier}</p>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full mt-3">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(usedSeats / maxSeats) * 100}%` }} />
        </div>
      </div>

      {maxSeats > 1 && (
        <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Invite Team Member</h3>
          <div className="flex gap-3">
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="User ID or email" className="flex-1 px-4 py-2.5 bg-[#0F172A] border border-gray-600 rounded-lg text-white text-sm outline-none" />
            <button onClick={handleInvite} disabled={loading || usedSeats >= maxSeats} className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition">
              {loading ? '...' : 'Invite'}
            </button>
          </div>
          {usedSeats >= maxSeats && <p className="text-xs text-red-400 mt-2">All seats are used. Upgrade to add more.</p>}
        </div>
      )}

      <div className="space-y-3">
        <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">You (Owner)</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <span className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-400 rounded">Owner</span>
        </div>
        {seats.map((s: any) => (
          <div key={s.id} className="bg-[#0F172A] rounded-lg p-4 border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">{s.userId}</p>
              <p className="text-xs text-gray-500 capitalize">{s.status}</p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded">Seat</span>
          </div>
        ))}
      </div>

      {maxSeats <= 1 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">Team management is available on Organization ($2,000) and Enterprise ($10,000) tiers.</p>
        </div>
      )}
    </ObserverShell>
  );
}
