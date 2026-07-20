import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works — ReportAfrica',
  description: 'Learn how ReportAfrica works — from reporting your first incident to earning money as a certified journalist across Africa.',
  alternates: { canonical: '/how-it-works' },
};

const REPORTING_STEPS = [
  { num: '1', title: 'Sign Up Free', desc: 'Create your account in seconds. Choose your country, set up your reporter profile, and you are ready to report.' },
  { num: '2', title: 'Report an Incident', desc: 'See something happening? Tap "Report", add a title, description, photos or video. Your location is captured automatically for nearby alerts.' },
  { num: '3', title: 'AI Moderation', desc: 'Your report is instantly reviewed by our AI system which checks for misinformation, harmful content, and assigns an initial credibility score.' },
  { num: '4', title: 'Community Verification', desc: 'Nearby citizens can confirm or dispute your report. Each confirmation strengthens its credibility and boosts its position in the feed.' },
  { num: '5', title: 'Build Your Trust Score', desc: 'Accurate, verified reports earn you trust points. Your trust level (New → Community → Trusted → Elite → Investigative) unlocks more features and higher earning rates.' },
  { num: '6', title: 'Earn from Your Reporting', desc: 'Readers tip you, media houses license your content, you claim bounties, earn from ad revenue pools, and more. All paid directly to your bank account.' },
];

const EARNING_HIGHLIGHTS = [
  { icon: '💸', label: 'Tips', desc: 'Readers tip you on reports. Keep 55–80%.' },
  { icon: '🏹', label: 'Bounties', desc: 'Claim paid story requests. Earn up to ×3 reward.' },
  { icon: '📋', label: 'Assignments', desc: 'Direct editorial assignments with fixed pay.' },
  { icon: '📄', label: 'Media Licensing', desc: 'License your content to news agencies. Earn 50–70%.' },
  { icon: '📊', label: 'Ad Revenue Pool', desc: 'Top reporters share weekly ad revenue.' },
  { icon: '⭐', label: 'Fan Subscriptions', desc: 'Monthly income from your subscribers.' },
  { icon: '💼', label: 'Marketplace', desc: 'Take commissioned journalism work. Earn 80–85%.' },
  { icon: '🎟️', label: 'Ticketed Streams', desc: 'Charge viewers to watch your live streams.' },
];

const VERIFICATION_LEVELS = [
  { label: 'Unverified', color: 'bg-gray-200 text-gray-600' },
  { label: 'Community Verified', color: 'bg-blue-100 text-blue-700' },
  { label: 'AI Verified', color: 'bg-purple-100 text-purple-700' },
  { label: 'Trusted Reporter Verified', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Officially Verified', color: 'bg-amber-100 text-amber-700' },
];

const FEATURES = [
  { icon: '🔴', title: 'Go Live', desc: 'Broadcast directly from the scene. Viewers watch in real time and interact via chat. Charge a ticket price to earn from every viewer.' },
  { icon: '🗺️', title: 'Live Map', desc: 'All reports are plotted on a live map. See what is happening near you or anywhere across Africa in real time.' },
  { icon: '📍', title: 'Watchlist Alerts', desc: 'Set up geo-fenced zones — your neighbourhood, your city, a border crossing. Get instant alerts when a report is filed inside your zone.' },
  { icon: '🚨', title: 'SOS Emergency', desc: 'Tap SOS to send an emergency alert with your exact location. Nearby users and relevant authorities are notified immediately.' },
  { icon: '🗳️', title: 'Election Monitoring', desc: 'Report election incidents, track results, and monitor polling stations in real time. Accredited observers get a dedicated dashboard.' },
  { icon: '🤝', title: 'Community Helping Hands', desc: 'Create fundraising campaigns for emergencies and community causes. Donors contribute via Paystack and funds are disbursed after verification.' },
  { icon: '🏢', title: 'For Businesses', desc: 'Register your business, respond to reports about your area, run promo challenges, and sponsor report categories to reach your audience.' },
  { icon: '🏛️', title: 'For Government', desc: 'Government agencies get a dedicated dashboard to monitor reports, track SOS alerts, view election data, and export CSV reports.' },
  { icon: '🎓', title: 'Journalist Academy', desc: 'Three professional courses — Mobile Journalism, Safety Reporting, Investigative Journalism. Complete all three to become a Certified reporter and unlock the highest earning rates.' },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ReportAfrica is Africa&apos;s citizen-powered live reporting platform. Report incidents, build credibility, and earn money from your journalism — all from your phone.
          </p>
        </div>

        {/* Core reporting flow */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Getting Started</h2>
        <div className="space-y-4 mb-14">
          {REPORTING_STEPS.map((step) => (
            <div key={step.num} className="flex gap-4 items-start bg-white rounded-xl border border-gray-100 p-5">
              <div className="w-10 h-10 rounded-full bg-[#0F7B6C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verification levels */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-14">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Levels</h2>
          <p className="text-sm text-gray-600 mb-5">
            Reports gain verification over time. For live and breaking news, post immediately — verification catches up after the fact. Higher verification = higher feed ranking and higher earnings.
          </p>
          <div className="flex flex-wrap gap-2">
            {VERIFICATION_LEVELS.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.color}`}>{v.label}</span>
                {i < VERIFICATION_LEVELS.length - 1 && <span className="text-gray-300 text-sm">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Earning section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">How Earning Works</h2>
            <Link href="/how-to-earn"
              className="text-sm font-semibold text-[#0F7B6C] hover:underline">
              Full earnings breakdown →
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            ReportAfrica has 14 income streams. All earnings are paid directly to your bank account via KoraPay. The more you report and the higher your Academy tier, the more you earn.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {EARNING_HIGHLIGHTS.map((e) => (
              <div key={e.label} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
                <span className="text-2xl shrink-0">{e.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{e.label}</p>
                  <p className="text-xs text-gray-500">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/how-to-earn"
              className="inline-block px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-xl hover:bg-[#0a6358] transition text-sm">
              See All 14 Income Streams with Full Rates →
            </Link>
          </div>
        </div>

        {/* Academy */}
        <div className="bg-[#0F7B6C]/5 border border-[#0F7B6C]/20 rounded-xl p-6 mb-14">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🎓</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Journalist Academy</h2>
              <p className="text-sm text-gray-600 mb-3">
                Complete three professional courses to become a Certified reporter. Certification unlocks the highest earning rates across all income streams — up to 3× on bounties, 85% on marketplace commissions, and the monthly Trust Bonus.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Mobile Journalism Basics', 'Safety & Field Reporting', 'Investigative Journalism'].map((c) => (
                  <span key={c} className="text-xs bg-[#0F7B6C]/10 text-[#0F7B6C] font-medium px-3 py-1 rounded-full">{c}</span>
                ))}
              </div>
              <a href="https://academy.reportafrica.africa" target="_blank" rel="noreferrer"
                className="inline-block text-sm font-semibold text-[#0F7B6C] hover:underline">
                Visit the Academy →
              </a>
            </div>
          </div>
        </div>

        {/* Platform features grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Features</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start?</h2>
          <p className="text-gray-600 text-sm mb-6">Join thousands of reporters across 32+ African countries.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register"
              className="px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-xl hover:bg-[#0a6358] transition">
              Create Free Account
            </Link>
            <Link href="/how-to-earn"
              className="px-6 py-3 border border-[#0F7B6C] text-[#0F7B6C] font-semibold rounded-xl hover:bg-[#0F7B6C]/5 transition">
              💰 How to Earn
            </Link>
            <Link href="/faq"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
              FAQ
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
