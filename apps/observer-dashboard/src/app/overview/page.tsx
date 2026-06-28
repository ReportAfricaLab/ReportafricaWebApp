'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function OverviewPage() {
  const [stats, setStats] = useState({ total: 0, verified: 0, disputed: 0, overVoting: 0, states: 0, parties: 0 });
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]?.country) setCountry(d[0].country); });
  }, []);

  useEffect(() => { loadStats(); const i = setInterval(loadStats, 20000); return () => clearInterval(i); }, [country]);

  const loadStats = async () => {
    const [results, parallel] = await Promise.all([
      observerAPI.getResults(country, election),
      observerAPI.getParallelCount(country, election),
    ]);
    const all = Array.isArray(results) ? results : [];
    const verified = all.filter((r: any) => r.verificationStatus === 'citizen_verified').length;
    const disputed = all.filter((r: any) => r.verificationStatus === 'disputed').length;
    const overVoting = all.filter((r: any) => r.overVotingFlag).length;
    const stateSet = new Set(all.map((r: any) => r.state).filter(Boolean));
    const partySet = new Set(all.flatMap((r: any) => Object.keys(r.results || {})));

    setStats({ total: all.length, verified, disputed, overVoting, states: stateSet.size, parties: partySet.size });
    setRecentAlerts(all.filter((r: any) => r.overVotingFlag || r.verificationStatus === 'disputed').slice(0, 5));
  };

  const verifiedPct = stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0;

  return (
    <ObserverShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📡 Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Election intelligence summary · Auto-refreshes every 20s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">LIVE</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="PU Results" value={stats.total} icon="📊" />
        <StatCard label="Verified" value={`${verifiedPct}%`} icon="✅" color="emerald" />
        <StatCard label="Disputed" value={stats.disputed} icon="⚠️" color="red" />
        <StatCard label="Over-voting" value={stats.overVoting} icon="🚨" color="amber" />
        <StatCard label="States" value={stats.states} icon="🗺️" />
        <StatCard label="Parties" value={stats.parties} icon="🏛️" />
      </div>

      {/* Recent alerts */}
      <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4">Recent Integrity Alerts</h2>
        {recentAlerts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">✅ No alerts — all results clean</p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((r: any) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg border border-gray-700">
                <span className="text-lg">{r.overVotingFlag ? '🚨' : '⚠️'}</span>
                <div className="flex-1">
                  <p className="text-sm text-white">{r.overVotingFlag ? 'Over-voting detected' : 'Disputed result'} — {r.state || 'Unknown'}, PU: {r.pollingUnit || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ObserverShell>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color?: string }) {
  const colorMap: Record<string, string> = { emerald: 'text-emerald-400', red: 'text-red-400', amber: 'text-amber-400' };
  return (
    <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-4">
      <p className="text-lg mb-1">{icon}</p>
      <p className={`text-2xl font-bold ${colorMap[color || ''] || 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
