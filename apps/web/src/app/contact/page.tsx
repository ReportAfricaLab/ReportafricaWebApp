'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-8">Have questions, feedback, or need support? We&apos;d love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-semibold">Message sent!</p>
              <p className="text-green-600 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
              <input type="text" placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
              <textarea placeholder="Your Message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0F7B6C] resize-none" />
              <button type="submit" className="w-full py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition">
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
            <p className="text-gray-600 text-sm">support@reportafrica.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Social Media</h3>
            <div className="flex gap-4 text-sm text-[#0F7B6C]">
              <a href="https://twitter.com/reportafrica" target="_blank" rel="noopener noreferrer">Twitter/X</a>
              <a href="https://instagram.com/reportafrica" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com/company/reportafrica" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Office</h3>
            <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Response Time</h3>
            <p className="text-gray-600 text-sm">We typically respond within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
