'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  claimed: 'bg-amber-100 text-amber-700',
  submitted: 'bg-purple-100 text-purple-700',
  approved: 'bg-blue-100 text-blue-700',
  expired: 'bg-gray-100 text-gray-500',
};

export default function AssignmentsPage() {
  const { token, user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [reportId, setReportId] = useState('');
  const country = (user as any)?.country || 'NG';

  useEffect(() => { load(); }, [country]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.assignment.getFeed(country);
      setAssignments(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch { setAssignments([]); } finally { setLoading(false); }
  };

  const submit = async () => {
    if (!token || !submitId || !reportId.trim()) return;
    try {
      await api.assignment.submit(token, submitId, reportId.trim());
      setSubmitId(null); setReportId(''); load();
    } catch (e: any) { alert(e.message || 'Submission failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">📋 Assignment Desk</h1>
      <p className="text-sm text-gray-500 mb-6">Platform-posted assignments. Claim, report, get paid.</p>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading...</p>
      ) : assignments.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No open assignments right now.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a: any) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[a.status] || 'bg-gray-100 text-gray-500'}`}>
                  {a.status.toUpperCase()}
                </span>
                {a.certifiedOnly && <span className="text-xs font-semibold text-purple-600">🟣 Certified Only</span>}
              </div>
              <h2 className="font-semibold text-gray-900 mb-1">{a.title}</h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{a.brief}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-green-600">{a.rewardCurrency} {Number(a.rewardAmount).toLocaleString()}</p>
                  {a.deadline && <p className="text-xs text-gray-400">Due {new Date(a.deadline).toLocaleDateString()}</p>}
                </div>
                <div className="flex gap-2">
                  {a.status === 'open' && (
                    <button onClick={() => setSubmitId(a.id)}
                      className="bg-[#0F7B6C] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0a6358] transition">
                      Submit Report
                    </button>
                  )}
                  {a.status === 'claimed' && (
                    <button onClick={() => setSubmitId(a.id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
                      Submit Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit modal */}
      {submitId && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-2">Submit Report ID</h3>
            <p className="text-sm text-gray-500 mb-4">Paste the ID of the report you filed for this assignment.</p>
            <input value={reportId} onChange={(e) => setReportId(e.target.value)}
              placeholder="Report UUID"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
            <div className="flex gap-3">
              <button onClick={() => { setSubmitId(null); setReportId(''); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={submit}
                className="flex-1 py-2.5 bg-[#0F7B6C] text-white rounded-lg text-sm font-semibold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
