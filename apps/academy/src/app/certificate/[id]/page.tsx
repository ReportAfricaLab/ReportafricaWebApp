'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';
const LOGO_URL = 'https://reportafrica-web.vercel.app/logo.png';
const ICON_URL = 'https://reportafrica-web.vercel.app/icon.png';

export default function CertificatePage() {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('academy_token');
    if (!token) { setLoading(false); return; }

    Promise.all([
      fetch(`${API_URL}/courses/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      id !== 'master' ? fetch(`${API_URL}/courses/${id}`).then(r => r.json()).catch(() => null) : Promise.resolve(null),
      fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
    ]).then(([enrollments, course, me]) => {
      const e = Array.isArray(enrollments) ? enrollments.find((en: any) => en.courseId === id) : null;
      setEnrollment(e);
      if (course?.title) setCourseTitle(course.title);
      if (me?.displayName) setDisplayName(me.displayName);
      else if (me?.username) setDisplayName(me.username);
      else if (me?.email) setDisplayName(me.email.split('@')[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;

  if (!enrollment?.completedAt) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Complete all lessons to earn your certificate.</div>;
  }

  const isMaster = id === 'master';
  const title = isMaster ? 'Certified Citizen Journalist — Complete Program' : courseTitle || 'Course';
  const certId = enrollment?.certificateId;
  const date = enrollment?.completedAt
    ? new Date(enrollment.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-6 flex gap-3 justify-center print:hidden">
        <button onClick={() => window.print()} className="px-4 py-2 bg-[#0F7B6C] text-white text-sm rounded-lg hover:bg-[#0B6E4F]">🖨️ Print / Save PDF</button>
        <a href={`/verify/${certId}`} className="px-4 py-2 bg-[#0B6E4F] text-white text-sm rounded-lg hover:bg-[#094d38]">🔗 Verification Link</a>
      </div>

      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl print:shadow-none" style={{ border: '6px solid #0F7B6C' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <img src={ICON_URL} alt="" className="w-[400px] h-[400px] object-contain" />
        </div>
        <div className="h-3 bg-gradient-to-r from-[#0F7B6C] via-[#0B6E4F] to-[#094d38]" />
        <div className="relative p-12 md:p-16 text-center">
          <img src={LOGO_URL} alt="ReportAfrica" className="h-12 mx-auto mb-6" />
          <p className="text-xs tracking-[0.3em] uppercase text-[#0F7B6C] font-semibold mb-2">Certificate of Completion</p>
          <div className="w-24 h-[2px] bg-[#0F7B6C] mx-auto mb-8" />
          <p className="text-gray-500 text-sm mb-2">This is to certify that</p>
          <p className="text-3xl font-bold text-[#0F7B6C] mb-6 capitalize">{displayName}</p>
          <p className="text-gray-500 text-sm mb-2">has successfully completed</p>
          <p className="text-xl font-bold text-gray-900 mb-2">{isMaster ? '👑 ' : ''}{title}</p>
          {isMaster && <p className="text-sm text-[#0F7B6C] font-medium mb-4">All courses in the ReportAfrica Academy Program</p>}
          <div className="w-24 h-[2px] bg-gray-200 mx-auto my-8" />
          <p className="text-sm text-gray-600 mb-1">Issued on <strong>{date}</strong></p>
          <p className="text-xs text-gray-400 font-mono mt-4">Certificate ID: {certId}</p>
          <p className="text-xs text-gray-400 mt-1">Verify at: academy.reportafrica.africa/verify/{certId}</p>
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <img src={ICON_URL} alt="" className="w-5 h-5 opacity-60" />
              <p className="text-xs text-gray-400">ReportAfrica — Africa&apos;s Citizen-Powered Reporting Platform</p>
            </div>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-r from-[#094d38] via-[#0B6E4F] to-[#0F7B6C]" />
      </div>
    </div>
  );
}
