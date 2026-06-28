'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');

  useEffect(() => {
    const obs = JSON.parse(localStorage.getItem('obs_country') || '""');
    if (obs) setCountry(obs);
    observerAPI.getMe().then(d => { if (d[0]?.country) { setCountry(d[0].country); localStorage.setItem('obs_country', JSON.stringify(d[0].country)); } });
  }, []);

  useEffect(() => { loadResults(); const i = setInterval(loadResults, 15000); return () => clearInterval(i); }, [country]);

  const loadResults = () => {
    observerAPI.getResults(country, election).then(d => setResults(Array.isArray(d) ? d : [])).catch(() => {});
  };

  return (
    <ObserverShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📊 Live Results</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time polling unit results as uploaded by citizens · Auto-refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No results yet for this election</div>
        ) : results.map((r: any) => (
          <div key={r.id} className="bg-[#1E293B] rounded-xl border border-gray-700 p-5">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="px-2 py-0.5 text-xs font-bold rounded text-white bg-emerald-600">RESULT</span>
              {r.state && <span className="text-xs text-gray-400">{r.state}</span>}
              {r.lga && <span className="text-xs text-gray-500">· {r.lga}</span>}
              {r.pollingUnit && <span className="text-xs text-gray-500">· PU: {r.pollingUnit}</span>}
              {r.verificationStatus === 'citizen_verified' && <span className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-400 rounded">✅ Multi-source verified</span>}
              {r.verificationStatus === 'disputed' && <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">⚠️ Disputed</span>}
              {r.overVotingFlag && <span className="text-xs px-2 py-0.5 bg-amber-900/50 text-amber-400 rounded">🚨 Over-voting</span>}
              {r.resultHash && <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded" title={r.resultHash}>🔒 Sealed</span>}
            </div>

            {r.results && Object.keys(r.results).length > 0 && (
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#0F172A] rounded-lg mb-3">
                {Object.entries(r.results).map(([party, votes]) => (
                  <div key={party} className="flex justify-between">
                    <span className="text-sm text-gray-300">{party}</span>
                    <span className="text-sm font-bold text-white">{String(votes)}</span>
                  </div>
                ))}
              </div>
            )}

            {r.media?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto mb-3">
                {r.media.map((m: any, i: number) => (
                  <a key={i} href={m.url} target="_blank" className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-gray-600 hover:border-emerald-400 transition">
                    {m.type?.startsWith('video') ? (
                      <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                    ) : (
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{r.user?.displayName || 'Anonymous'} · {new Date(r.createdAt).toLocaleString()}{r.isVerifiedObserver ? ' · ✓ Verified Observer' : ''}</span>
              {r.prevHash && <span className="text-gray-600" title={`prev: ${r.prevHash}`}>Chain: ...{r.prevHash.slice(-8)}</span>}
            </div>
          </div>
        ))}
      </div>
    </ObserverShell>
  );
}
