import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Earn on ReportAfrica — 14 Income Streams for Reporters',
  description: 'Full breakdown of every way to earn money on ReportAfrica — tips, bounties, ad revenue, media licensing, fan subscriptions, marketplace commissions and more.',
  alternates: { canonical: '/how-to-earn' },
};

const STREAMS = [
  {
    icon: '💸',
    title: 'Tips from Readers',
    desc: 'Readers tip you directly on any report you publish. You keep 55–80% of every tip depending on your Academy tier.',
    rates: [
      { tier: 'Starter (no Academy)', cut: '55%' },
      { tier: 'Trained (Course 1 + 2)', cut: '70%' },
      { tier: 'Certified (All 3 courses)', cut: '80%' },
    ],
    note: 'Paid directly to your bank account via KoraPay.',
  },
  {
    icon: '📊',
    title: 'Weekly Ad Revenue Pool',
    desc: 'Every week ReportAfrica distributes a share of platform ad revenue to the top reporters in each country. The more quality reports you publish, the higher your share.',
    rates: [{ tier: 'Top 10 reporters per country', cut: 'Rank-weighted share' }],
    note: 'Distributed every Monday at 09:00 UTC.',
  },
  {
    icon: '🔴',
    title: 'Breaking News Bonus',
    desc: 'When your report is marked as Breaking News, you instantly receive a cash bonus from the Breaking News pool.',
    rates: [
      { tier: 'Starter', cut: '×1 base bonus' },
      { tier: 'Trained', cut: '×2 base bonus' },
      { tier: 'Certified', cut: '×3 base bonus' },
    ],
    note: 'Paid instantly when your report is marked breaking.',
  },
  {
    icon: '🏹',
    title: 'Bounty Board',
    desc: 'ReportAfrica posts paid bounties for specific stories we need covered. Claim a bounty, submit your report, and get paid on approval.',
    rates: [
      { tier: 'Starter', cut: '×1 reward' },
      { tier: 'Trained', cut: '×2 reward' },
      { tier: 'Certified', cut: '×3 reward' },
    ],
    note: 'Open to all reporters. Certified reporters earn up to 3× the base reward.',
  },
  {
    icon: '📋',
    title: 'Assignment Desk',
    desc: 'Direct paid assignments from the ReportAfrica editorial team. You get a brief, deadline, and fixed reward. Submit your report and get paid on approval.',
    rates: [
      { tier: 'Starter', cut: '×1 reward' },
      { tier: 'Trained', cut: '×2 reward' },
      { tier: 'Certified', cut: '×3 reward' },
    ],
    note: 'Some assignments are restricted to Certified reporters only.',
  },
  {
    icon: '📄',
    title: 'Media Licensing',
    desc: 'News agencies, TV stations, and media houses can license your photos, videos, and reports through the platform. You earn a share of every licensing fee.',
    rates: [
      { tier: 'Standard reporters', cut: '50%' },
      { tier: 'Certified reporters', cut: '70%' },
    ],
    note: 'You control which content is available for licensing.',
  },
  {
    icon: '⭐',
    title: 'Fan Subscriptions',
    desc: 'Your regular readers can subscribe to you monthly. You earn 80% of every subscription payment — recurring monthly income.',
    rates: [
      { tier: 'Basic tier ($1/mo)', cut: '80% to you' },
      { tier: 'Premium tier ($3/mo)', cut: '80% to you' },
    ],
    note: 'Available to reporters with trust score 50+ or Certified status.',
  },
  {
    icon: '💼',
    title: 'Reporter Marketplace',
    desc: 'Clients — businesses, NGOs, individuals — commission you directly for custom journalism work. You set your rate, accept the brief, deliver the work, and get paid.',
    rates: [
      { tier: 'Trained reporters', cut: '80% of agreed budget' },
      { tier: 'Certified reporters', cut: '85% of agreed budget' },
    ],
    note: 'Client payment is held in escrow until you deliver. Available to reporters with trust score 50+ or Certified status.',
  },
  {
    icon: '🏷️',
    title: 'Category Sponsorships',
    desc: 'Businesses sponsor specific report categories (e.g. traffic, health, elections). Every time you publish a qualifying report in a sponsored category, you automatically earn a reward.',
    rates: [{ tier: 'Any reporter', cut: 'Fixed reward per qualifying report' }],
    note: 'Completely automatic — just report in the category and the reward is paid.',
  },
  {
    icon: '🎟️',
    title: 'Ticketed Live Streams',
    desc: 'Charge viewers to watch your live streams. Set your ticket price and earn from every viewer who pays to join.',
    rates: [
      { tier: 'Trained reporters', cut: '80% of ticket price' },
      { tier: 'Certified reporters', cut: '85% of ticket price' },
    ],
    note: 'Set any ticket price in your local currency.',
  },
  {
    icon: '🛡️',
    title: 'Monthly Trust Bonus',
    desc: 'Certified reporters who consistently publish high-quality, AI-verified reports receive a monthly bonus from the Trust Bonus pool.',
    rates: [
      { tier: '10+ reports last month', cut: '×1 base bonus' },
      { tier: '25+ reports last month', cut: '×2 base bonus' },
      { tier: '50+ reports last month', cut: '×3 base bonus' },
    ],
    note: 'Paid on the 1st of every month. Requires Certified status and avg AI score ≥90.',
  },
  {
    icon: '🎁',
    title: 'Referral Program',
    desc: 'Invite other journalists to join ReportAfrica. When they sign up using your referral code and purchase a course, you earn a cash reward plus trust points.',
    rates: [{ tier: 'Per successful referral', cut: 'Cash reward + trust points' }],
    note: 'No limit on referrals. Share your code anywhere.',
  },
  {
    icon: '🤝',
    title: 'Community Helping Hands',
    desc: 'Create fundraising campaigns for emergencies or community causes you are covering. Donors contribute directly and funds are disbursed to you after verification.',
    rates: [{ tier: 'Platform fee', cut: 'Small processing fee only' }],
    note: 'Campaigns are reviewed before going live. Emergency campaigns get priority.',
  },
  {
    icon: '🎓',
    title: 'Academy Certification Multiplier',
    desc: 'Not a direct income stream — a multiplier that increases your earnings across all other streams. Completing Academy courses upgrades your tier and unlocks higher rates.',
    rates: [
      { tier: 'Starter (no courses)', cut: 'Base rates' },
      { tier: 'Trained (Course 1 + 2)', cut: 'Up to ×2 on bounties & assignments' },
      { tier: 'Certified (All 3 courses)', cut: 'Up to ×3 on bounties, 85% on marketplace' },
    ],
    note: 'Visit academy.reportafrica.africa to enroll.',
  },
];

const VERIFICATION_LEVELS = [
  { level: 'Unverified', desc: 'Just posted — visible in feed at base score.' },
  { level: 'Community Verified', desc: 'Nearby citizens confirmed your report — feed score boosted.' },
  { level: 'AI Verified', desc: 'AI moderation passed — credibility score increased.' },
  { level: 'Trusted Reporter Verified', desc: 'Verified by a trusted reporter — strong credibility signal.' },
  { level: 'Officially Verified', desc: 'Verified by a government or official source — highest ranking.' },
];

export default function HowToEarnPage() {
  return (
    <main className="min-h-screen py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How to Earn on ReportAfrica</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            14 income streams for reporters across Africa. Earn from your journalism — tips, bounties, licensing, subscriptions and more. All paid directly to your bank account.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/register"
              className="px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-xl hover:bg-[#0a6358] transition">
              Start Earning Free
            </Link>
            <a href="https://academy.reportafrica.africa" target="_blank" rel="noreferrer"
              className="px-6 py-3 border border-[#0F7B6C] text-[#0F7B6C] font-semibold rounded-xl hover:bg-[#0F7B6C]/5 transition">
              🎓 Join the Academy
            </a>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Income Streams', value: '14' },
            { label: 'Max Tip Share', value: '80%' },
            { label: 'Max Marketplace Cut', value: '85%' },
            { label: 'Countries Supported', value: '32+' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-[#0F7B6C]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Income streams */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">All 14 Income Streams</h2>
        <div className="space-y-4 mb-16">
          {STREAMS.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{s.desc}</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rates</p>
                    <div className="space-y-1">
                      {s.rates.map((r, j) => (
                        <div key={j} className="flex justify-between text-sm">
                          <span className="text-gray-600">{r.tier}</span>
                          <span className="font-semibold text-[#0F7B6C]">{r.cut}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">ℹ️ {s.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verification section — answers Lucas's question directly */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2">How Verification Works for Live Reporting</h2>
          <p className="text-sm text-gray-600 mb-5">
            If you are reporting a live event, post immediately — verification happens after the fact. Your report goes live right away and gains verification over time as evidence comes in. Breaking news cannot wait, and the platform is built for that.
          </p>
          <div className="space-y-3">
            {VERIFICATION_LEVELS.map((v, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0F7B6C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{v.level}</p>
                  <p className="text-xs text-gray-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-4">
            Higher verification levels increase your report&apos;s feed ranking and your trust score, which directly affects your earning rates across all income streams.
          </p>
        </div>

        {/* Academy CTA */}
        <div className="bg-[#0F7B6C] rounded-2xl p-8 text-white text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">Unlock Higher Rates with the Academy</h2>
          <p className="text-white/80 text-sm mb-6">
            Completing Academy courses upgrades your tier from Starter → Trained → Certified. Certified reporters earn up to 3× on bounties, 85% on marketplace commissions, and unlock the monthly Trust Bonus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { course: 'Course 1', name: 'Mobile Journalism Basics', tier: '→ Trained' },
              { course: 'Course 2', name: 'Safety & Field Reporting', tier: '→ Trained' },
              { course: 'Course 3', name: 'Investigative Journalism', tier: '→ Certified' },
            ].map((c) => (
              <div key={c.course} className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-white/60 mb-1">{c.course}</p>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-emerald-300 mt-1">{c.tier}</p>
              </div>
            ))}
          </div>
          <a href="https://academy.reportafrica.africa" target="_blank" rel="noreferrer"
            className="inline-block px-8 py-3 bg-white text-[#0F7B6C] font-bold rounded-xl hover:bg-gray-100 transition">
            Enroll in the Academy →
          </a>
        </div>

        {/* Payout info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payout Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900 mb-1">How payouts work</p>
              <p>All earnings are paid directly to your bank account via KoraPay. Add your bank details in your profile settings to receive payments.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Supported currencies</p>
              <p>NGN, GHS, KES, ZAR, USD and other African currencies. Payouts are made in your local currency.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Payout timing</p>
              <p>Tips, bounties, assignments, breaking news bonus, sponsorship rewards: instant on approval. Marketplace commissions: instant on client approval. Fan subscriptions: instant when subscriber&apos;s monthly charge goes through. Ad revenue pool: distributed weekly every Monday. Trust bonus: distributed monthly on the 1st.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Platform fee</p>
              <p>ReportAfrica takes 20% on fan subscriptions and a small processing fee on donations. All other rates are as listed above.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to start earning from your journalism?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register"
              className="px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-xl hover:bg-[#0a6358] transition">
              Create Free Account
            </Link>
            <Link href="/how-it-works"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
              How It Works
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
