'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-[#D92D20] text-white',
  high: 'bg-[#F97316] text-white',
  medium: 'bg-[#F4B400] text-gray-900',
  low: 'bg-[#2563EB] text-white',
};

function ReportContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { token } = useAuth();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.reports.getById(id).then(setReport).finally(() => setLoading(false));
  }, [id]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!token || !id) return;
    const updated = type === 'upvote'
      ? await api.reports.upvote(token, id)
      : await api.reports.downvote(token, id);
    setReport(updated);
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;
  if (!report) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Report not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2.5 py-1 text-xs font-bold rounded ${SEVERITY_COLORS[report.severity]}`}>
            {report.severity.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 capitalize">{report.category.replace('_', ' ')}</span>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded ${report.verificationLevel === 'unverified' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
            {report.verificationLevel.replace('_', ' ')}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{report.title}</h1>
        <p className="text-gray-600 leading-relaxed mb-6">{report.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 p-3 bg-gray-50 rounded-lg">
          <span>📍</span>
          <span>{report.city || report.state || `${Number(report.latitude).toFixed(4)}, ${Number(report.longitude).toFixed(4)}`}</span>
          <span className="ml-auto text-xs">{report.country}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-6">
          <div className="text-sm">
            <span className="text-gray-500">Reported by </span>
            <span className="font-medium text-gray-900">{report.author?.displayName || 'Anonymous'}</span>
          </div>
          <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => handleVote('upvote')}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium">
            ↑ Confirm ({report.upvotes})
          </button>
          <button onClick={() => handleVote('downvote')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium">
            ↓ Dispute ({report.downvotes})
          </button>
          <span className="ml-auto text-sm text-gray-400">👁️ {report.viewCount} views</span>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}
