'use client';
import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [lessonForm, setLessonForm] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '📚', usdPrice: 13, thumbnailUrl: '', isPublished: false, sortOrder: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const data = await adminAPI.getCourses(); setCourses(data); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editing?.id) { await adminAPI.updateCourse(editing.id, form); }
      else { await adminAPI.createCourse(form); }
      setEditing(null); setForm({ title: '', description: '', icon: '📚', usdPrice: 13, thumbnailUrl: '', isPublished: false, sortOrder: 0 });
      load();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course and all its lessons?')) return;
    await adminAPI.deleteCourse(id); load();
  };

  const handleAddLesson = async (courseId: string) => {
    if (!lessonForm?.title) return;
    await adminAPI.addLesson(courseId, lessonForm);
    setLessonForm(null); load();
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Delete this lesson?')) return;
    await adminAPI.deleteLesson(id); load();
  };

  const handleUpdateLesson = async (id: string, data: any) => {
    await adminAPI.updateLesson(id, data); load();
  };

  if (loading) return <div className="p-8 text-gray-400">Loading courses...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🎓 Academy Courses</h1>
        <button onClick={() => { setEditing({}); setForm({ title: '', description: '', icon: '📚', usdPrice: 13, thumbnailUrl: '', isPublished: false, sortOrder: 0 }); }}
          className="px-4 py-2 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium">+ Add Course</button>
      </div>

      {/* Course Form Modal */}
      {editing && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">{editing.id ? 'Edit Course' : 'New Course'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Course Title" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Icon (emoji)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" value={form.usdPrice} onChange={e => setForm({ ...form, usdPrice: Number(e.target.value) })} placeholder="USD Price" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input value={form.thumbnailUrl} onChange={e => setForm({ ...form, thumbnailUrl: e.target.value })} placeholder="Thumbnail URL (optional)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
              Published
            </label>
            <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} placeholder="Sort Order" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-[#0F7B6C] text-white rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Cancel</button>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{course.title}</h3>
                  <p className="text-xs text-gray-500">USD ${course.usdPrice} · {course.lessons?.length || 0} lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
                <button onClick={() => { setEditing(course); setForm({ title: course.title, description: course.description, icon: course.icon, usdPrice: course.usdPrice, thumbnailUrl: course.thumbnailUrl || '', isPublished: course.isPublished, sortOrder: course.sortOrder }); }}
                  className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded font-medium">Edit</button>
                <button onClick={() => handleDelete(course.id)} className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded font-medium">Delete</button>
              </div>
            </div>

            {/* Lessons */}
            <div className="ml-8 space-y-2">
              {course.lessons?.sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((lesson: any, i: number) => (
                <div key={lesson.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                  <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                  <span className="text-xs text-gray-400">{lesson.duration}</span>
                  <span className="text-xs text-gray-400">{lesson.videoUrl ? '🎬' : '⏳'}</span>
                  <button onClick={() => {
                    const url = prompt('Video URL (YouTube embed):', lesson.videoUrl);
                    if (url !== null) handleUpdateLesson(lesson.id, { videoUrl: url });
                  }} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded">URL</button>
                  <button onClick={() => handleDeleteLesson(lesson.id)} className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded">×</button>
                </div>
              ))}

              {/* Add Lesson */}
              {lessonForm?.courseId === course.id ? (
                <div className="flex gap-2 p-2 bg-yellow-50 rounded-lg">
                  <input value={lessonForm.title || ''} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Lesson title" className="flex-1 text-sm border border-gray-200 rounded px-2 py-1" />
                  <input value={lessonForm.duration || ''} onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })} placeholder="Duration" className="w-20 text-sm border border-gray-200 rounded px-2 py-1" />
                  <button onClick={() => handleAddLesson(course.id)} className="text-xs px-3 py-1 bg-[#0F7B6C] text-white rounded font-medium">Add</button>
                  <button onClick={() => setLessonForm(null)} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded">×</button>
                </div>
              ) : (
                <button onClick={() => setLessonForm({ courseId: course.id, title: '', duration: '', videoUrl: '' })}
                  className="text-xs text-[#0F7B6C] font-medium hover:underline">+ Add Lesson</button>
              )}
            </div>
          </div>
        ))}

        {courses.length === 0 && <p className="text-center text-gray-400 py-8">No courses yet. Click "Add Course" to create one.</p>}
      </div>
    </div>
  );
}
