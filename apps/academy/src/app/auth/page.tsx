'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';

function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) { router.push('/'); return; }

    fetch(`${API_URL}/auth/academy-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.token) { router.push('/'); return; }
        localStorage.setItem('academy_token', data.token);
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]));
          localStorage.setItem('academy_user', JSON.stringify({
            id: payload.sub,
            email: payload.email,
            country: payload.country || 'NG',
          }));
        } catch {}
        router.push('/');
      })
      .catch(() => router.push('/'));
  }, [searchParams, router]);

  return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-500">Signing you in...</div>;
}

export default function AuthPage() {
  return <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}><AuthHandler /></Suspense>;
}
