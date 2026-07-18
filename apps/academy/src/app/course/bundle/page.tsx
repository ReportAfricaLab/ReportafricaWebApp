'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getLocalPrice } from '@/lib/courses';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
}

function BundlePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const [user, setUser] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('academy_user');
    const u = stored ? JSON.parse(stored) : null;
    if (u) setUser(u);

    const token = localStorage.getItem('academy_token');

    if (reference && token) {
      setVerifying(true);
      fetch(`${API_URL}/courses/enroll/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => {
          if (data.enrolled) { setEnrolled(true); setSuccessMsg('Payment confirmed! You now have access to all courses.'); }
          else setError('Payment could not be verified. Contact support if you were charged.');
        })
        .catch(() => setError('Could not verify payment. Please try again.'))
        .finally(() => setVerifying(false));
    }

    fetch(`${API_URL}/courses`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAllCourses(data);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (token && !reference) {
      fetch(`${API_URL}/courses/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setEnrolled(data.some((e: any) => e.courseId === 'bundle'));
        }).catch(() => {});
    }
  }, [reference]);

  const handlePurchase = async () => {
    const token = localStorage.getItem('academy_token');
    if (!user || !token || isTokenExpired(token)) {
      localStorage.removeItem('academy_token');
      localStorage.removeItem('academy_user');
      window.location.href = 'https://reportafrica.africa/login?redirect=academy';
      return;
    }
    setError('');
    try {
      const res = await fetch(`${API_URL}/courses/bundle/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user.email, country: user.country || 'NG' }),
      });
      const data = await res.json();
      if (data.paymentUrl) window.location.href = data.paymentUrl;
      else if (data.enrolled) { setEnrolled(true); setSuccessMsg('Enrollment successful! You now have access to all courses.'); }
      else setError(data.message || 'Enrollment failed. Try again.');
    } catch {
      setError('Payment initialization failed. Please try again.');
    }
  };

  if (loading || verifying) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">
      {verifying ? 'Verifying payment...' : 'Loading...'}
    </div>
  );

  const country = user?.country || 'NG';
  const { price, currency } = getLocalPrice(40, country);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => router.push('/')} className="text-sm text-[#0F7B6C] mb-6 hover:underline">← All Courses</button>
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🎓 Full Bundle — All {allCourses.length} Courses</h1>
        <p className="text-gray-600 mb-6">Get lifetime access to every course in the ReportAfrica Academy. Save 40% compared to buying individually.</p>
        {successMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{successMsg}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
          <p className="text-3xl font-bold text-gray-900">{currency} {price.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">One-time payment • Lifetime access to all courses</p>
          {!enrolled ? (
            <button onClick={handlePurchase} className="mt-4 px-8 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition">
              Get Full Bundle
            </button>
          ) : (
            <div className="mt-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg inline-block">✓ You own the full bundle</div>
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Included Courses</h2>
        <div className="space-y-3">
          {allCourses.map((c: any) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{c.title}</p>
                <p className="text-xs text-gray-500">{c.lessons?.length || 0} lessons</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BundlePage() {
  return <Suspense fallback={<div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}><BundlePageContent /></Suspense>;
}
