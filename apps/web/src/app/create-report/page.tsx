'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const CATEGORIES = [
  { key: 'traffic', label: '🚗 Traffic' },
  { key: 'police_security', label: '🚨 Police & Security' },
  { key: 'government', label: '🏛️ Government' },
  { key: 'construction', label: '🏗️ Construction' },
  { key: 'election', label: '🗳️ Election' },
  { key: 'emergency', label: '🚨 Emergency' },
  { key: 'environmental', label: '🌍 Environmental' },
  { key: 'market_consumer', label: '🛒 Market & Consumer' },
];

export default function CreateReportPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', category: '', severity: 'medium', isAnonymous: false });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => setError('Location access needed to tag your report')
    );
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { setError('Please select a category'); return; }
    if (!location) { setError('Location is required'); return; }
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      await api.reports.create(token, { ...form, ...location });
      router.push('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Report</h1>
      <p className="text-gray-500 mb-8">Report what&apos;s happening around you</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat.key} type="button" onClick={() => update('category', cat.key)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition ${form.category === cat.key ? 'bg-[#0F7B6C] text-white border-[#0F7B6C]' : 'border-gray-200 text-gray-600 hover:border-[#0F7B6C]'}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required maxLength={200}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7B6C] focus:border-transparent outline-none"
            placeholder="Brief title of the incident" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} required maxLength={5000} rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7B6C] focus:border-transparent outline-none resize-none"
            placeholder="Describe what is happening in detail..." />
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high', 'critical'].map((s) => (
              <button key={s} type="button" onClick={() => update('severity', s)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${form.severity === s ? 'bg-[#0F7B6C] text-white border-[#0F7B6C]' : 'border-gray-200 text-gray-500 hover:border-[#0F7B6C]'}`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
          📍 {location ? `Location detected (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})` : 'Detecting location...'}
        </div>

        {/* Anonymous */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isAnonymous} onChange={(e) => update('isAnonymous', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#0F7B6C] focus:ring-[#0F7B6C]" />
          <span className="text-sm text-gray-700">Report anonymously</span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
