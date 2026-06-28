'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function ParallelCountPage() {
  const [data, setData] = useState<any>(null);
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]?.country) setCountry(d[0].country); });
  }, []);

  useEffect(() => { loadData(); const i = setInterval(loadData, 30000); return () => clearInterval(i); }, [country]);

  const loadData = () => {
    observerAPI.getParallelCount(country, election).then(setData).catch(() => {});
  };

  const allParties = data?.stateResults ? [...new Set(Object.values(data.stateResults).flatMap((s: any) => Object.keys(s.parties)))] : [];
  const grandTotal: Record<string, number> = {};
  if (data?.stateResults) {
    Object.values(data.stateResults).forEach((s: any) => {
      Object.entries(s.parties).forEach(([p, v]) => { grandTotal[p] = (grandTotal[p] || 0) + Number(v); });
    });
  }

  return (
    <ObserverShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🗳️ Parallel Vote Tabulation</h1>
          <p className="text-gray-400 text-sm mt-1">Citizen-uploaded results aggregated by state · Auto-refreshes every 30s</p>
        </div>
        {data && <span className="text-xs text-gray-500">Total PUs: {data.totalPUs}</span>}
      </div>

      {!data?.stateResults || Object.keys(data.stateResults).length === 0 ? (
        <div className="text-center py-16 text-gray-500">No results uploaded yet</div>
      ) : (
        <>
          {/* Grand totals */}
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-xl p-5 mb-6">
            <p className="text-xs text-emerald-400 font-semibold mb-3">NATIONAL TOTALS (citizen-reported)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(grandTotal).sort((a, b) => b[1] - a[1]).map(([party, votes]) => (
                <div key={party}>
                  <p className="text-xs text-gray-400">{party}</p>
                  <p className="text-xl font-bold text-white">{votes.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* State breakdown table */}
          <div className="bg-[#1E293B] rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0F172A] border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">State</th>
                  {allParties.map(p => <th key={p} className="px-3 py-3 text-right text-xs font-semibold text-gray-400">{p}</th>)}
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-400">PUs</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {Object.entries(data.stateResults).sort((a: any, b: any) => b[1].puCount - a[1].puCount).map(([state, info]: [string, any]) => (
                  <tr key={state} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-white">{state}</td>
                    {allParties.map(p => <td key={p} className="px-3 py-3 text-right font-bold text-gray-200">{(info.parties[p] || 0).toLocaleString()}</td>)}
                    <td className="px-3 py-3 text-right text-gray-400">{info.puCount}</td>
                    <td className="px-3 py-3 text-right">
                      {info.verified > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/50 text-emerald-400 rounded mr-1">✓{info.verified}</span>}
                      {info.disputed > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-red-900/50 text-red-400 rounded">⚠️{info.disputed}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ObserverShell>
  );
}
