'use client';
import { useState, useEffect } from 'react';
import ObserverShell from '../ObserverShell';
import { observerAPI } from '@/lib/api';

export default function SettingsPage() {
  const [observer, setObserver] = useState<any>(null);

  useEffect(() => {
    observerAPI.getMe().then(d => { if (d[0]) setObserver(d[0]); });
  }, []);

  if (!observer) return <ObserverShell><div className="text-gray-400">Loading...</div></ObserverShell>;

  const daysLeft = observer.expiresAt ? Math.max(0, Math.ceil((new Date(observer.expiresAt).getTime() - Date.now()) / 86400000)) : 0;

  return (
    <ObserverShell>
      <h1 className="text-2xl font-bold text-white mb-6">⚙️ Settings</h1>

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Subscription</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="text-sm font-semibold text-emerald-400 capitalize">{observer.status.replace('observer_', '')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tier</p>
            <p className="text-sm font-semibold text-white capitalize">{observer.tier}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Country</p>
            <p className="text-sm font-semibold text-white">{observer.country}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Days Remaining</p>
            <p className={`text-sm font-semibold ${daysLeft <= 7 ? 'text-red-400' : 'text-white'}`}>{daysLeft} days</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Activated</p>
            <p className="text-sm text-white">{observer.paidAt ? new Date(observer.paidAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Expires</p>
            <p className="text-sm text-white">{observer.expiresAt ? new Date(observer.expiresAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Organization</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Organization</p>
            <p className="text-sm text-white">{observer.orgName || 'Individual'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Seats</p>
            <p className="text-sm text-white">{observer.seats}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] rounded-xl border border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Support</h3>
        <p className="text-sm text-gray-300">Need help? Contact <a href="mailto:support@reportafrica.africa" className="text-emerald-400 hover:underline">support@reportafrica.africa</a></p>
      </div>
    </ObserverShell>
  );
}
