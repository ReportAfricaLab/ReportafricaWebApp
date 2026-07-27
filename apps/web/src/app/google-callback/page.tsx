'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.reportafrica.africa/api/v1';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) { setError('No response from Google'); return; }

    const params = new URLSearchParams(hash.substring(1));
    const idToken = params.get('id_token');
    const rawState = params.get('state');

    let stateObj: any = {};
    try { if (rawState) stateObj = JSON.parse(atob(rawState)); } catch {}

    if (!idToken) { setError('No token received from Google'); return; }

    api.auth.oauth('google', idToken)
      .then(async (data) => {
        login(data.user, data.token, data.refreshToken);
        if (stateObj.redirect === 'academy') {
          const codeRes = await fetch(`${API_URL}/auth/academy-code`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${data.token}` },
          });
          const { code } = await codeRes.json();
          const returnCourse = stateObj.returnCourse || '';
          window.location.href = `https://academy.reportafrica.africa/auth?code=${code}${returnCourse ? `&returnCourse=${encodeURIComponent(returnCourse)}` : ''}`;
        } else {
          router.push(stateObj.returnTo || '/feed');
        }
      })
      .catch((err) => {
        setError(err.message || 'Google sign-in failed');
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/login" className="text-[#0F7B6C] font-semibold hover:underline">Back to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <p className="text-gray-500">Signing in with Google...</p>
    </div>
  );
}
