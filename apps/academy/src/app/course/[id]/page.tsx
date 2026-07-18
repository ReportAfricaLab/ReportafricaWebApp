'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getLocalPrice } from '@/lib/courses';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';

function CourseDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const isBundle = id === 'bundle';
  const reference = searchParams.get('reference');

  useEffect(() => {
    const stored = localStorage.getItem('academy_user');
    const u = stored ? JSON.parse(stored) : null;
    if (u) setUser(u);

    const token = localStorage.getItem('academy_token');

    // Handle Paystack redirect back with ?reference=
    if (reference && token) {
      setVerifying(true);
      fetch(`${API_URL}/courses/enroll/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => {
          if (data.enrolled) {
            setEnrolled(true);
            setSuccessMsg('Payment confirmed! You now have access to this course.');
          } else {
            setError('Payment could not be verified. Contact support if you were charged.');
          }
        })
        .catch(() => setError('Could not verify payment. Please try again.'))
        .finally(() => setVerifying(false));
    }

    // Fetch course(s)
    if (isBundle) {
      fetch(`${API_URL}/courses`).then(r => r.json()).then(data => {
        if (Array.isArray(data)) setAllCourses(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      fetch(`${API_URL}/courses/${id}`).then(r => r.json()).then(data => {
        setCourse(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }

    // Check enrollment from API (not localStorage)
    if (token && !reference) {
      fetch(`${API_URL}/courses/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (!Array.isArray(data)) return;
          if (isBundle) {
            setEnrolled(data.length > 0 && data.some((e: any) => e.courseId === 'bundle'));
          } else {
            setEnrolled(data.some((e: any) => e.courseId === id || e.courseId === 'bundle'));
          }
        }).catch(() => {});
    }
  }, [id, isBundle, reference]);

  const handlePurchase = async (courseId: string, courseEmail?: string) => {
    if (!user || !localStorage.getItem('academy_token')) { window.location.href = 'https://reportafrica.africa/login?redirect=academy'; return; }
    const token = localStorage.getItem('academy_token');
    const country = user?.country || 'NG';
    setError('');
    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: courseEmail || user.email, country }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.enrolled) {
        setEnrolled(true);
        setSuccessMsg('Enrollment successful! You now have access.');
      } else {
        setError(data.message || 'Enrollment failed. Try again.');
      }
    } catch {
      setError('Payment initialization failed. Please try again.');
    }
  };

  if (loading || verifying) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">
      {verifying ? 'Verifying payment...' : 'Loading...'}
    </div>
  );

  // === BUNDLE PAGE ===
  if (isBundle) {
    const country = user?.country || 'NG';
    const bundleUsd = 40;
    const { price, currency } = getLocalPrice(bundleUsd, country);
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
              <button onClick={() => handlePurchase('bundle')} className="mt-4 px-8 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition">
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

  // === SINGLE COURSE PAGE ===
  if (!course) return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Course not found</div>;

  const country = user?.country || 'NG';
  const { price, currency } = getLocalPrice(Number(course.usdPrice), country);
  const lessons = course.lessons?.sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => router.push('/')} className="text-sm text-[#0F7B6C] mb-6 hover:underline">← All Courses</button>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.icon} {course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>

        {successMsg && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{successMsg}</div>}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        {!enrolled ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
            <p className="text-3xl font-bold text-gray-900">{currency} {price.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">One-time payment • Lifetime access</p>
            <button onClick={() => handlePurchase(id as string)} className="mt-4 px-8 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition">
              Enroll Now
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-800">✓ You are enrolled! Start learning below.</p>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 mb-4">📚 Lessons ({lessons.length})</h2>
        <div className="space-y-3">
          {lessons.map((lesson: any, i: number) => (
            <div key={lesson.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${enrolled ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100' : 'border-gray-100 bg-gray-50'}`}
              onClick={() => enrolled && router.push(`/learn/${id}?lesson=${i}`)}>
              <span className="w-7 h-7 rounded-full bg-gray-200 text-xs font-bold flex items-center justify-center text-gray-600">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                <p className="text-xs text-gray-500">{lesson.duration}</p>
              </div>
              {enrolled ? <span className="text-xs text-green-600">▶ Play</span> : <span className="text-xs text-gray-400">🔒</span>}
            </div>
          ))}
        </div>

        {enrolled && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
            <p className="text-sm font-semibold text-amber-800">🏆 Complete all lessons to earn your certificate</p>
            <a href={`/certificate/${id}`} className="text-xs text-amber-600 underline mt-1 inline-block">View Certificate</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  return <Suspense fallback={<div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}><CourseDetailContent /></Suspense>;
}
