'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://34-242-14-140.nip.io/api/v1';

function LearnContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonIndex = Number(searchParams.get('lesson') || 0);
  const [course, setCourse] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const enrollments = JSON.parse(localStorage.getItem('academy_enrollments') || '[]');
    if (enrollments.includes(id) || enrollments.includes('bundle')) setEnrolled(true);
    else { router.push(`/course/${id}`); return; }
    fetch(`${API_URL}/courses/${id}`).then(r => r.json()).then(setCourse).catch(() => {});
  }, [id, router]);

  if (!enrolled || !course) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const lessons = course.lessons?.sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];
  const currentLesson = lessons[lessonIndex];
  if (!currentLesson) return <div className="text-center py-20 text-gray-400">Lesson not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.push(`/course/${id}`)} className="text-sm text-[#0F7B6C] mb-4 hover:underline">← Back to course</button>

      <div className="bg-black rounded-xl aspect-video flex items-center justify-center mb-6">
        {currentLesson.videoUrl ? (
          <iframe src={currentLesson.videoUrl} className="w-full h-full rounded-xl" allowFullScreen />
        ) : (
          <div className="text-center text-white">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-sm opacity-70">Video coming soon</p>
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Lesson {lessonIndex + 1}: {currentLesson.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{currentLesson.duration}</p>

      <div className="flex gap-3">
        {lessonIndex > 0 && <button onClick={() => router.push(`/learn/${id}?lesson=${lessonIndex - 1}`)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">← Previous</button>}
        {lessonIndex < lessons.length - 1 && <button onClick={() => router.push(`/learn/${id}?lesson=${lessonIndex + 1}`)} className="px-4 py-2 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium">Next Lesson →</button>}
        {lessonIndex === lessons.length - 1 && <a href={`/certificate/${id}`} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">🏆 Get Certificate</a>}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">All Lessons</h3>
        <div className="space-y-2">
          {lessons.map((l: any, i: number) => (
            <button key={l.id} onClick={() => router.push(`/learn/${id}?lesson=${i}`)}
              className={`w-full text-left p-3 rounded-lg text-sm ${i === lessonIndex ? 'bg-[#0F7B6C] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              {i + 1}. {l.title} <span className="opacity-60">({l.duration})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}><LearnContent /></Suspense>;
}
