'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function ExportPage() {
  const [results, setResults] = useState<any[]>([]);
  const [country, setCountry] = useState('NG');
  const [election] = useState('2027 General Election');

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]?.country) setCountry(d[0].country); });
  }, []);

  useEffect(() => {
    observerAPI.getResults(country, election).then(d => setResults(Array.isArray(d) ? d : [])).catch(() => {});
  }, [country]);

  const exportCSV = () => {
    if (results.length === 0) { alert('No data to export'); return; }
    const allParties = [...new Set(results.flatMap(r => Object.keys(r.results || {})))];
    const headers = ['State', 'LGA', 'Ward', 'Polling Unit', ...allParties, 'Verification', 'Over-voting', 'Hash', 'Reporter', 'Timestamp'];
    const rows = results.map(r => [
      r.state || '', r.lga || '', r.ward || '', r.pollingUnit || '',
      ...allParties.map(p => r.results?.[p] || 0),
      r.verificationStatus || 'unverified', r.overVotingFlag ? 'YES' : 'NO', r.resultHash || '',
      r.user?.displayName || 'Anonymous', r.createdAt,
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `election-results-${country}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <ObserverShell>
      <h1 className="text-2xl font-bold text-white mb-2">📥 Export Data</h1>
      <p className="text-gray-400 text-sm mb-6">Download all election results for your jurisdiction</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6">
          <p className="text-3xl mb-3">📄</p>
          <h3 className="text-lg font-bold text-white">CSV Export</h3>
          <p className="text-sm text-gray-400 mt-2">All PU results with party votes, verification status, hash chain, and reporter info. Compatible with Excel, Google Sheets.</p>
          <p className="text-xs text-gray-500 mt-2">{results.length} results available</p>
          <button onClick={exportCSV} className="mt-4 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition">Download CSV</button>
        </div>

        <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6">
          <p className="text-3xl mb-3">🖨️</p>
          <h3 className="text-lg font-bold text-white">PDF / Print</h3>
          <p className="text-sm text-gray-400 mt-2">Print-optimized view of all results. Use browser print (Ctrl+P) to save as PDF or send to printer.</p>
          <button onClick={exportPDF} className="mt-4 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition">Print / Save PDF</button>
        </div>
      </div>
    </ObserverShell>
  );
}
