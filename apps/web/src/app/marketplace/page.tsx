'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type Tab = 'browse' | 'my-profile' | 'commissions';

const STATUS_COLOR: Record<string, string> = {
  pending_payment: 'bg-gray-100 text-gray-500',
  escrowed: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  submitted: 'bg-purple-100 text-purple-700',
  approved: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function MarketplacePage() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState<Tab>('browse');
  const [reporters, setReporters] = useState<any[]>([]);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [reporterCommissions, setReporterCommissions] = useState<any[]>([]);
  const [clientCommissions, setClientCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commissionTarget, setCommissionTarget] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [brief, setBrief] = useState('');
  const [budget, setBudget] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [beats, setBeats] = useState('');
  const [rate, setRate] = useState('');
  const country = (user as any)?.country || 'NG';

  useEffect(() => { loadAll(); }, [country, token]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const browseData = await api.marketplace.browse(country);
      setReporters(Array.isArray(browseData?.data) ? browseData.data : []);
      if (token && (user as any)?.id) {
        const [profData, rcData, ccData] = await Promise.all([
          api.marketplace.getProfile((user as any).id).catch(() => null),
          api.marketplace.myReporterCommissions(token).catch(() => null),
          api.marketplace.myClientCommissions(token).catch(() => null),
        ]);
        setMyProfile(profData);
        setReporterCommissions(Array.isArray(rcData?.data) ? rcData.data : []);
        setClientCommissions(Array.isArray(ccData?.data) ? ccData.data : []);
      }
    } catch {} finally { setLoading(false); }
  };

  const requestCommission = async () => {
    if (!token || !commissionTarget || !brief.trim() || !budget || !email.trim()) { alert('Fill in all fields'); return; }
    try {
      const res = await api.marketplace.requestCommission(token, commissionTarget.reporterId, {
        brief: brief.trim(), budget: Number(budget), currency: commissionTarget.rateCurrency, email: email.trim(),
      });
      if (res?.paymentUrl) window.open(res.paymentUrl, '_blank');
      setCommissionTarget(null); setBrief(''); setBudget(''); setEmail('');
      loadAll();
    } catch (e: any) { alert(e.message || 'Failed'); }
  };

  const saveProfile = async () => {
    if (!token || !bio.trim() || !rate) { alert('Bio and rate are required'); return; }
    try {
      await api.marketplace.upsertProfile(token, {
        bio: bio.trim(), beats: beats.split(',').map((b) => b.trim()).filter(Boolean),
        ratePerArticle: Number(rate), rateCurrency: 'NGN', available: true,
      });
      setShowProfileForm(false); loadAll();
    } catch (e: any) { alert(e.message || 'Failed'); }
  };

  const allCommissions = [...reporterCommissions, ...clientCommissions].filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">💼 Reporter Marketplace</h1>
      <p className="text-sm text-gray-500 mb-6">Commission reporters or offer your journalism skills.</p>

      <div className="flex border-b border-gray-200 mb-6">
        {(['browse', 'my-profile', 'commissions'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${tab === t ? 'border-[#0F7B6C] text-[#0F7B6C]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'browse' ? '🔍 Browse Reporters' : t === 'my-profile' ? '👤 My Profile' : `📄 Commissions (${allCommissions.length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
        <>
          {tab === 'browse' && (
            <div className="space-y-4">
              {reporters.length === 0 ? <p className="text-center text-gray-400 py-12">No reporters available yet.</p> :
                reporters.map((r: any) => (
                  <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0F7B6C] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {r.reporter?.displayName?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">{r.reporter?.displayName}</p>
                          <p className="text-sm font-bold text-green-600">{r.rateCurrency} {Number(r.ratePerArticle).toLocaleString()}/article</p>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{(r.beats || []).join(' · ')}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{r.bio}</p>
                        <button onClick={() => setCommissionTarget({ reporterId: r.reporterId, name: r.reporter?.displayName, rateCurrency: r.rateCurrency })}
                          className="bg-[#0F7B6C] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0a6358] transition">
                          Commission
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {tab === 'my-profile' && (
            <div>
              {myProfile && !showProfileForm ? (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                  <p className="font-semibold text-gray-900 mb-1">Your Marketplace Profile</p>
                  <p className="text-sm text-gray-600 mb-2">{myProfile.bio}</p>
                  <p className="text-xs text-gray-400 mb-1">Beats: {(myProfile.beats || []).join(', ')}</p>
                  <p className="text-sm font-bold text-green-600 mb-3">{myProfile.rateCurrency} {Number(myProfile.ratePerArticle).toLocaleString()}/article</p>
                  <button onClick={() => { setBio(myProfile.bio); setBeats((myProfile.beats || []).join(', ')); setRate(String(myProfile.ratePerArticle)); setShowProfileForm(true); }}
                    className="bg-[#0F7B6C] text-white px-4 py-2 rounded-lg text-sm font-semibold">Edit Profile</button>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold text-gray-900 mb-4">{myProfile ? 'Edit Profile' : 'Create Marketplace Profile'}</p>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-[#0F7B6C] h-24 resize-none" />
                  <input value={beats} onChange={(e) => setBeats(e.target.value)} placeholder="Beats (comma separated: politics, health)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
                  <input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Rate per article (NGN)" type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
                  <div className="flex gap-3">
                    {myProfile && <button onClick={() => setShowProfileForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Cancel</button>}
                    <button onClick={saveProfile} className="flex-1 py-2.5 bg-[#0F7B6C] text-white rounded-lg text-sm font-semibold">Save Profile</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'commissions' && (
            <div className="space-y-4">
              {allCommissions.length === 0 ? <p className="text-center text-gray-400 py-12">No commissions yet.</p> :
                allCommissions.map((c: any) => (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLOR[c.status] || 'bg-gray-100 text-gray-500'}`}>
                        {c.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <p className="text-sm font-bold text-green-600">{c.currency} {Number(c.budget).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{c.brief}</p>
                    <div className="flex gap-2">
                      {c.status === 'escrowed' && c.reporterId === (user as any)?.id && (
                        <button onClick={() => api.marketplace.acceptCommission(token!, c.id).then(loadAll)}
                          className="bg-[#0F7B6C] text-white px-4 py-2 rounded-lg text-sm font-semibold">Accept</button>
                      )}
                      {c.status === 'submitted' && c.clientId === (user as any)?.id && (
                        <button onClick={() => api.marketplace.approveWork(token!, c.id).then(loadAll)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Approve & Pay Reporter</button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {commissionTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-gray-900 mb-4">Commission {commissionTarget.name}</h3>
            <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe what you need..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-[#0F7B6C] h-24 resize-none" />
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder={`Budget (${commissionTarget.rateCurrency})`} type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email for payment" type="email"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:ring-2 focus:ring-[#0F7B6C]" />
            <div className="flex gap-3">
              <button onClick={() => setCommissionTarget(null)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={requestCommission} className="flex-1 py-2.5 bg-[#0F7B6C] text-white rounded-lg text-sm font-semibold">Pay & Commission</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
