'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function AlertsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]?.country) setCountry(d[0].country); });
  }, []);

  useEffect(() => { loadAlerts(); const i = setInterval(loadAlerts, 20000); return () => clearInterval(i); }, [country]);

  const loadAlerts = () => {
    observerAPI.getResults(country, election).then(d => {
      const all = Array.isArray(d) ? d : [];
      // Filter to only flagged items
      setResults(all.filter((r: any) => r.overVotingFlag || r.verificationStatus === 'disputed'));
    }).catch(() => {});
  };

  return (
    <ObserverShell>
      <h1 className="text-2xl font-bold text-white mb-2">🚨 Integrity Alerts</h1>
      <p className="text-gray-400 text-sm mb-6">Flagged results: over-voting, disputes, and verification conflicts · Auto-refreshes</p>

      {results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-400">No integrity alerts — all results clean</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((r: any) => (
            <div key={r.id} className="bg-[#1E293B] rounded-xl border border-red-800/50 p-5">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {r.overVotingFlag && <span className="text-xs px-2 py-1 bg-amber-900/50 text-amber-400 rounded font-semibold">🚨 OVER-VOTING ({Object.values(r.results || {}).reduce((a: number, b: any) => a + Number(b), 0)} total votes)</span>}
                {r.verificationStatus === 'disputed' && <span className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded font-semibold">⚠️ DISPUTED — Conflicting uploads for same PU</span>}
                {r.state && <span className="text-xs text-gray-400 ml-auto">{r.state} · {r.lga || ''} · PU: {r.pollingUnit || 'N/A'}</span>}
              </div>
              {r.results && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#0F172A] rounded-lg mb-3">
                  {Object.entries(r.results).map(([party, votes]) => (
                    <div key={party} className="flex justify-between">
                      <span className="text-xs text-gray-400">{party}</span>
                      <span className="text-xs font-bold text-white">{String(votes)}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">{r.user?.displayName || 'Anonymous'} · {new Date(r.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </ObserverShell>
  );
}
