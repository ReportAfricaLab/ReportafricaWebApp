'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function EvidencePage() {
  const [results, setResults] = useState<any[]>([]);
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]?.country) setCountry(d[0].country); });
  }, []);

  useEffect(() => { loadEvidence(); }, [country]);

  const loadEvidence = () => {
    observerAPI.getResults(country, election).then(d => {
      const all = Array.isArray(d) ? d : [];
      setResults(all.filter((r: any) => r.media?.length > 0));
    }).catch(() => {});
  };

  const states = [...new Set(results.map(r => r.state).filter(Boolean))];
  const filtered = filterState ? results.filter(r => r.state === filterState) : results;

  return (
    <ObserverShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📸 Evidence Viewer</h1>
          <p className="text-gray-400 text-sm mt-1">All photos and videos of result sheets from polling units</p>
        </div>
        <select value={filterState} onChange={e => setFilterState(e.target.value)} className="px-3 py-2 text-sm bg-[#1E293B] border border-gray-600 rounded-lg text-white outline-none">
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No evidence uploaded yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r: any) => (
            <div key={r.id} className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden">
              <div className="relative aspect-[4/3] bg-gray-900">
                {r.media[0]?.type?.startsWith('video') ? (
                  <video src={r.media[0].url} controls className="w-full h-full object-contain" />
                ) : (
                  <a href={r.media[0]?.url} target="_blank"><img src={r.media[0]?.url} alt="" className="w-full h-full object-contain" /></a>
                )}
                {r.media.length > 1 && <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">+{r.media.length - 1} more</span>}
                {r.verificationStatus === 'citizen_verified' && <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded">✅ Verified</span>}
                {r.verificationStatus === 'disputed' && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded">⚠️ Disputed</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400">{r.state} · {r.lga || ''} · PU: {r.pollingUnit || 'N/A'}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ObserverShell>
  );
}
