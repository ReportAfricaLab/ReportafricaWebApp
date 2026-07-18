'use client';
import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('academy_token'));
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="font-bold text-gray-900">ReportAfrica <span className="text-[#0F7B6C]">Academy</span></span>
            </a>
            <div className="flex items-center gap-4">
              {!loggedIn && (
                <a href="https://reportafrica.africa/login?redirect=academy"
                  className="text-xs px-3 py-1.5 bg-[#0F7B6C] text-white rounded-lg font-medium hover:bg-[#0B6E4F] transition">
                  Sign In
                </a>
              )}
              <a href="https://www.reportafrica.africa/feed" className="text-xs text-gray-500 hover:text-[#0F7B6C]">← Back to ReportAfrica</a>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

