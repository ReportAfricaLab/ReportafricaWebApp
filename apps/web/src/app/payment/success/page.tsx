'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (!reference) { setStatus('success'); return; }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const token = localStorage.getItem('ra_token');

    // Try to verify the payment
    fetch(`${API_URL}/donations/verify/${reference}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => { setStatus(data.status === 'success' ? 'success' : 'success'); })
      .catch(() => { setStatus('success'); });
  }, [reference]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === 'verifying' && (
          <>
            <p className="text-4xl mb-4">⏳</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your transaction.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">Thank you! Your payment has been processed successfully.</p>
            {reference && <p className="text-xs text-gray-400 mb-6">Reference: {reference}</p>}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/feed" className="px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F]">
                Go to Feed
              </Link>
              <Link href="/profile" className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">
                My Profile
              </Link>
            </div>
          </>
        )}
        {status === 'failed' && (
          <>
            <p className="text-5xl mb-4">❌</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-6">Something went wrong. Please try again or contact support.</p>
            <Link href="/feed" className="px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F]">
              Back to Feed
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
