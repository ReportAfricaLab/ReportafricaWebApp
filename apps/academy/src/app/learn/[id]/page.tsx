'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';

function isEmbedUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

function LearnContent() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonIndex = Number(searchParams.get('lesson') || 0);

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [quiz, setQuiz] = useState<any>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Load course + enrollment once
  useEffect(() => {
    const token = localStorage.getItem('academy_token');
    if (!token) { router.push(`/course/${id}`); return; }
    fetch(`${API_URL}/courses/${id}`).then(r => r.json()).then(setCourse).catch(() => {});
    fetch(`${API_URL}/courses/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => {
        const e = Array.isArray(data) ? data.find((en: any) => en.courseId === id || en.courseId === 'bundle') : null;
        if (e) setEnrollment(e);
        else router.push(`/course/${id}`);
      }).catch(() => {});
  }, [id, router]);

  // Restore quiz state whenever lesson changes
  useEffect(() => {
    setQuiz(null);
    setQuizPassed(false);
    setQuizAnswers([]);
    setQuizResult(null);
    setError('');

    if (!course || !enrollment) return;
    const lessons = course.lessons?.sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];
    const currentLesson = lessons[lessonIndex];
    if (!currentLesson) return;

    const completedLessons = enrollment.completedLessons || [];
    if (!completedLessons.includes(currentLesson.id)) return;

    // Lesson is already complete — restore quiz state from API
    const token = localStorage.getItem('academy_token');
    fetch(`${API_URL}/quizzes/lesson/${currentLesson.id}`)
      .then(r => r.json())
      .then(async (q) => {
        if (!q || !q.id) return; // no quiz for this lesson
        setQuiz(q);
        setQuizAnswers(new Array(q.questions.length).fill(-1));
        // Check if already passed
        const passedRes = await fetch(`${API_URL}/quizzes/lesson/${currentLesson.id}/passed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const passedData = await passedRes.json();
        setQuizPassed(passedData?.passed === true || passedData === true);
      })
      .catch(() => {});
  }, [lessonIndex, course, enrollment]);

  if (!course || !enrollment) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const lessons = course.lessons?.sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];
  const currentLesson = lessons[lessonIndex];
  if (!currentLesson) return <div className="text-center py-20 text-gray-400">Lesson not found</div>;

  const completedLessons = enrollment.completedLessons || [];
  const isLessonComplete = completedLessons.includes(currentLesson.id);
  const progress = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const allDone = completedLessons.length >= lessons.length;

  // Next is blocked if lesson has a quiz that hasn't been passed
  const nextBlocked = isLessonComplete && quiz && !quizPassed && !quizResult?.passed;

  const markComplete = async () => {
    setCompleting(true);
    setError('');
    const token = localStorage.getItem('academy_token');
    try {
      const res = await fetch(`${API_URL}/courses/${id}/lessons/${currentLesson.id}/complete`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Could not complete lesson. Please try again.'); setCompleting(false); return; }
      setEnrollment(data);
      // Fetch quiz for this lesson
      const quizRes = await fetch(`${API_URL}/quizzes/lesson/${currentLesson.id}`);
      const quizData = await quizRes.json();
      if (quizData && quizData.id) {
        setQuiz(quizData);
        setQuizAnswers(new Array(quizData.questions.length).fill(-1));
      }
    } catch { setError('Something went wrong. Please try again.'); }
    setCompleting(false);
  };

  const submitQuiz = async () => {
    if (quizAnswers.some(a => a === -1)) { setError('Please answer all questions before submitting.'); return; }
    setQuizSubmitting(true);
    setError('');
    const token = localStorage.getItem('academy_token');
    try {
      const res = await fetch(`${API_URL}/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: quizAnswers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Quiz submission failed. Please try again.'); setQuizSubmitting(false); return; }
      setQuizResult(data);
      if (data.passed) setQuizPassed(true);
    } catch { setError('Something went wrong submitting the quiz. Please try again.'); }
    setQuizSubmitting(false);
  };

  const retryQuiz = () => { setQuizAnswers(new Array(quiz.questions.length).fill(-1)); setQuizResult(null); setError(''); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.push(`/course/${id}`)} className="text-sm text-[#0F7B6C] mb-4 hover:underline">← Back to course</button>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{completedLessons.length}/{lessons.length} lessons</span>
          <span>{progress}% complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-[#0F7B6C] rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Video Player — smart: iframe for YouTube/Vimeo, <video> for everything else */}
      <div className="bg-black rounded-xl aspect-video flex items-center justify-center mb-4 overflow-hidden">
        {currentLesson.videoUrl ? (
          isEmbedUrl(currentLesson.videoUrl) ? (
            <iframe src={currentLesson.videoUrl} className="w-full h-full" allowFullScreen />
          ) : (
            <video src={currentLesson.videoUrl} controls className="w-full h-full" />
          )
        ) : (
          <div className="text-center text-white">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-sm opacity-70">Video coming soon</p>
          </div>
        )}
      </div>

      {/* Lesson Info + Complete Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lesson {lessonIndex + 1}: {currentLesson.title}</h1>
          <p className="text-sm text-gray-500">{currentLesson.duration}</p>
        </div>
        {isLessonComplete ? (
          <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">✓ Completed</span>
        ) : (
          <button onClick={markComplete} disabled={completing}
            className="px-4 py-2 bg-[#0F7B6C] text-white text-sm font-medium rounded-lg hover:bg-[#0B6E4F] disabled:opacity-50">
            {completing ? '...' : '✓ Mark Complete'}
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Quiz Section */}
      {isLessonComplete && quiz && (
        <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">📝 {quiz.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Passing score: {quiz.passingScore}% · {quiz.maxAttempts} attempts allowed</p>
          </div>

          {quizPassed && !quizResult ? (
            <div className="p-5">
              <div className="rounded-lg p-4 bg-green-50 border border-green-200 text-center">
                <p className="text-green-700 font-semibold">✅ You already passed this quiz</p>
                <p className="text-xs text-green-600 mt-1">Next lesson is unlocked ✓</p>
              </div>
            </div>
          ) : quizResult ? (
            <div className="p-5">
              <div className={`rounded-lg p-4 mb-4 text-center ${quizResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-2xl font-bold ${quizResult.passed ? 'text-green-700' : 'text-red-700'}`}>
                  {quizResult.passed ? '🎉 Passed!' : '❌ Not passed'}
                </p>
                <p className={`text-sm mt-1 ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                  Score: {quizResult.score}% · {quizResult.correctAnswers}/{quizResult.totalQuestions} correct
                </p>
                {quizResult.passed
                  ? <p className="text-xs text-green-600 mt-1">Next lesson is now unlocked ✓</p>
                  : <p className="text-xs text-red-600 mt-1">Attempts used: {quizResult.attemptsUsed}/{quizResult.maxAttempts}</p>
                }
              </div>
              <div className="space-y-3 mb-4">
                {quizResult.results.map((r: any, i: number) => (
                  <div key={r.questionId} className={`p-3 rounded-lg text-sm ${r.isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    <p className="font-medium text-gray-800 mb-1">Q{i + 1}: {quiz.questions[i]?.questionText}</p>
                    <p className={r.isCorrect ? 'text-green-700' : 'text-red-700'}>
                      Your answer: {quiz.questions[i]?.options[r.selectedOption]}
                      {!r.isCorrect && <span className="text-green-700 ml-2">· Correct: {quiz.questions[i]?.options[r.correctOption]}</span>}
                    </p>
                  </div>
                ))}
              </div>
              {!quizResult.passed && quizResult.attemptsUsed < quizResult.maxAttempts && (
                <button onClick={retryQuiz} className="w-full py-2 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium hover:bg-[#0B6E4F]">Try Again</button>
              )}
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {quiz.questions.map((q: any, qi: number) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-gray-900 mb-2">Q{qi + 1}: {q.questionText}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: string, oi: number) => (
                      <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition
                        ${quizAnswers[qi] === oi ? 'border-[#0F7B6C] bg-[#0F7B6C]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name={`q-${qi}`} checked={quizAnswers[qi] === oi}
                          onChange={() => setQuizAnswers(prev => { const a = [...prev]; a[qi] = oi; return a; })}
                          className="accent-[#0F7B6C]" />
                        <span className="text-sm text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} disabled={quizSubmitting || quizAnswers.some(a => a === -1)}
                className="w-full py-3 bg-[#0F7B6C] text-white rounded-lg text-sm font-semibold hover:bg-[#0B6E4F] disabled:opacity-50 mt-2">
                {quizSubmitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lesson complete, no quiz */}
      {isLessonComplete && !quiz && lessonIndex < lessons.length - 1 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ Lesson complete! Continue to the next lesson.
        </div>
      )}

      {/* Certificate Unlock */}
      {allDone && enrollment.certificateId && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-lg font-bold text-amber-800">🏆 Congratulations!</p>
          <p className="text-sm text-amber-700 mt-1">You completed all lessons. Your certificate is ready!</p>
          <p className="text-xs text-amber-600 mt-1 font-mono">ID: {enrollment.certificateId}</p>
          <a href={`/certificate/${id}`} className="inline-block mt-3 px-6 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Download Certificate</a>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {lessonIndex > 0 && (
          <button onClick={() => router.push(`/learn/${id}?lesson=${lessonIndex - 1}`)}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">← Previous</button>
        )}
        {lessonIndex < lessons.length - 1 && (
          <button onClick={() => router.push(`/learn/${id}?lesson=${lessonIndex + 1}`)}
            disabled={!!nextBlocked}
            className="px-4 py-2 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium hover:bg-[#0B6E4F] disabled:opacity-40 disabled:cursor-not-allowed">
            Next Lesson →
          </button>
        )}
      </div>

      {/* Lesson List */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3">All Lessons</h3>
        <div className="space-y-2">
          {lessons.map((l: any, i: number) => (
            <button key={l.id} onClick={() => router.push(`/learn/${id}?lesson=${i}`)}
              className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 ${i === lessonIndex ? 'bg-[#0F7B6C] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              {completedLessons.includes(l.id) ? <span>✅</span> : <span className="opacity-40">○</span>}
              <span className="flex-1">{i + 1}. {l.title}</span>
              <span className="opacity-60 text-xs">{l.duration}</span>
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
