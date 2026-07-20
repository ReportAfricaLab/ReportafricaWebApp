'use client';
import { useState } from 'react';

type Section = { heading: string; faqs: { q: string; a: string }[] };

const SECTIONS: Section[] = [
  {
    heading: '📱 About ReportAfrica',
    faqs: [
      { q: 'What is ReportAfrica?', a: 'ReportAfrica is Africa\'s citizen-powered live reporting platform. It enables anyone across Africa to report incidents in real time — from traffic and emergencies to government accountability, elections, and community issues — and earn money from their journalism.' },
      { q: 'Is it free to use?', a: 'Yes. Creating an account, submitting reports, and reading the feed is completely free. Fees only apply on specific transactions like donations (small processing fee) and fan subscriptions (20% platform cut).' },
      { q: 'What countries are supported?', a: 'We support 32+ African countries including Nigeria, Ghana, Kenya, South Africa, Egypt, Morocco, Ethiopia, Tanzania, Uganda, Rwanda, Senegal, Cameroon, and more.' },
      { q: 'Can I report anonymously?', a: 'Yes. Toggle anonymous mode when creating a report. Your identity will be hidden from other users. We also offer face blur for photos and videos to protect identities in sensitive situations.' },
    ],
  },
  {
    heading: '✅ Verification & Trust',
    faqs: [
      { q: 'How does verification work?', a: 'Reports go through five verification levels: Unverified → Community Verified → AI Verified → Trusted Reporter Verified → Officially Verified. Each level increases your report\'s credibility score and feed ranking. For live or breaking news, post immediately — verification happens after the fact as evidence comes in.' },
      { q: 'Can I post a live report before I have proof?', a: 'Yes, absolutely. If you are on the ground at a live event, post immediately. The platform is designed for this — your report goes live right away and gains verification over time. Your trust score as a journalist actually helps your reports rank higher even before verification catches up.' },
      { q: 'How do trust scores work?', a: 'You earn trust points for accurate reports, community verifications, consistent activity, and completing Academy courses. Points are deducted for flagged or disputed content. Your trust level (New Reporter → Community → Trusted → Elite → Investigative) unlocks features and higher earning rates.' },
      { q: 'What is the difference between AI verification and community verification?', a: 'AI verification is automated — our system checks your report for misinformation signals, harmful content, and credibility markers. Community verification is human — nearby citizens who can confirm or dispute what you reported. Both contribute to your report\'s overall verification level.' },
    ],
  },
  {
    heading: '💰 Payments & Earnings',
    faqs: [
      { q: 'How many ways can I earn on ReportAfrica?', a: 'There are 14 income streams: tips from readers, weekly ad revenue pool, breaking news bonus, bounties, assignments, media licensing, fan subscriptions, reporter marketplace commissions, category sponsorships, ticketed live streams, monthly trust bonus, referral rewards, community helping hands campaigns, and the Academy certification multiplier. See the full breakdown at reportafrica.africa/how-to-earn.' },
      { q: 'What are the earning rates?', a: 'Rates depend on your Academy tier. Tips: 55% (Starter), 70% (Trained), 80% (Certified). Bounties and assignments: ×1/×2/×3 multiplier. Media licensing: 50% standard, 70% Certified. Marketplace commissions: 80% Trained, 85% Certified. Fan subscriptions: 80% always. Ticketed streams: 80% Trained, 85% Certified.' },
      { q: 'How do I get paid?', a: 'All earnings are paid directly to your bank account via KoraPay. Add your bank details in your profile settings. Payouts are in your local currency (NGN, GHS, KES, ZAR, USD and more).' },
      { q: 'When are payouts made?', a: 'Tips and bounties: instant on approval. Breaking news bonus: instant when marked. Ad revenue pool: every Monday at 09:00 UTC. Trust bonus: 1st of every month. Marketplace commissions: when the client approves your work. Fan subscriptions: monthly.' },
      { q: 'Does ReportAfrica take a cut of my earnings?', a: 'ReportAfrica takes 20% on fan subscriptions (you keep 80%) and a small processing fee on donations. For tips, bounties, assignments, and marketplace commissions, the platform cut is already factored into the rates listed above — what you see is what you receive.' },
    ],
  },
  {
    heading: '🏹 Bounties & Assignments',
    faqs: [
      { q: 'What is the Bounty Board?', a: 'The Bounty Board is where ReportAfrica posts paid story requests. We need a specific story covered — you claim the bounty, go report it, submit your report, and get paid when it is approved. Bounties are open to all reporters. Certified reporters earn up to 3× the base reward.' },
      { q: 'What is the Assignment Desk?', a: 'Assignments are direct editorial commissions from the ReportAfrica team. You receive a brief, a deadline, and a fixed reward. Submit your report and get paid on approval. Some assignments are restricted to Certified reporters only.' },
      { q: 'What happens if my bounty submission is rejected?', a: 'If your submission is rejected, the bounty is reopened for other reporters to claim. You will receive a reason for the rejection. You can improve your submission and try again on future bounties.' },
      { q: 'What happens if an assignment is rejected?', a: 'If your assignment submission is rejected, the assignment is reopened. You will receive a rejection reason. Your reward is not paid until the submission is approved.' },
    ],
  },
  {
    heading: '💼 Reporter Marketplace',
    faqs: [
      { q: 'What is the Reporter Marketplace?', a: 'The Reporter Marketplace lets clients — businesses, NGOs, media houses, individuals — commission you directly for custom journalism work. You set your rate per article, create a profile, and clients can find and hire you.' },
      { q: 'How does payment work in the Marketplace?', a: 'When a client commissions you, they pay the agreed budget upfront into escrow via Paystack. The funds are held securely until you deliver the work and the client approves it. Once approved, you receive 80% (Trained) or 85% (Certified) of the budget directly to your bank account.' },
      { q: 'What if the client does not approve my work?', a: 'If the client rejects your submission, you can revise and resubmit. If there is a genuine dispute, contact support@reportafrica.africa. Escrowed funds are not released until there is a resolution.' },
      { q: 'Who can join the Marketplace?', a: 'Reporters with a trust score of 50 or higher, or Certified reporters. Complete Academy courses to reach Certified status and unlock the highest marketplace rates.' },
    ],
  },
  {
    heading: '⭐ Fan Subscriptions',
    faqs: [
      { q: 'What are Fan Subscriptions?', a: 'Fan Subscriptions let your regular readers support you with a monthly payment. You offer two tiers — Basic ($1/mo) and Premium ($3/mo). You keep 80% of every subscription. It is recurring monthly income that grows as your audience grows.' },
      { q: 'Who can offer Fan Subscriptions?', a: 'Reporters with a trust score of 50 or higher, or Certified reporters. Build your trust score by publishing quality reports consistently.' },
      { q: 'Can subscribers cancel at any time?', a: 'Yes. Subscribers can cancel their subscription at any time from their Fan Subscriptions page.' },
    ],
  },
  {
    heading: '🎓 Academy & Certification',
    faqs: [
      { q: 'What is the ReportAfrica Academy?', a: 'The Academy is our professional journalism training platform at academy.reportafrica.africa. It offers three courses: Mobile Journalism Basics, Safety & Field Reporting, and Investigative Journalism. Completing all three makes you a Certified reporter.' },
      { q: 'Why does certification matter?', a: 'Certification is a multiplier on your earnings. Certified reporters earn up to 3× on bounties and assignments, 85% on marketplace commissions and ticketed streams, 70% on media licensing, and unlock the monthly Trust Bonus. It is the single biggest lever for increasing your income on the platform.' },
      { q: 'How much do the courses cost?', a: 'Course pricing is listed on academy.reportafrica.africa. Some subscription tiers include free course access.' },
    ],
  },
  {
    heading: '🔴 Live Streaming',
    faqs: [
      { q: 'Can I go live?', a: 'Yes. Any authenticated reporter can start a live stream directly from the app. Viewers watch in real time and interact via chat. Your stream is automatically recorded.' },
      { q: 'Can I charge viewers to watch my live stream?', a: 'Yes. Set a ticket price before going live. Viewers pay to join. You earn 80% (Trained) or 85% (Certified) of every ticket sold.' },
      { q: 'Can I live stream elections or breaking events?', a: 'Yes. Live streaming is specifically designed for breaking events. There is a dedicated election live stream section. Accredited election observers get additional tools.' },
    ],
  },
  {
    heading: '🤝 Donations & Campaigns',
    faqs: [
      { q: 'How do donations work?', a: 'Verified users can create fundraising campaigns for emergencies, community projects, or causes they are covering. Donors contribute via Paystack. Campaigns are reviewed for fraud before funds are disbursed to the campaign creator.' },
      { q: 'What is the platform fee on donations?', a: 'A small payment processing fee applies. ReportAfrica does not take a profit cut on donations — the fee covers payment processing costs.' },
      { q: 'Can media houses use my content?', a: 'Yes. Through Media Licensing, news organisations can request to license your reports, photos, and videos. You earn 50% (standard) or 70% (Certified) of the licensing fee. You control which content is available for licensing.' },
    ],
  },
  {
    heading: '🔒 Safety & Privacy',
    faqs: [
      { q: 'How does the SOS feature work?', a: 'Tap the SOS button to send an emergency alert with your exact location. Nearby users and relevant authorities are notified immediately.' },
      { q: 'What is Safe Trip?', a: 'Safe Trip lets you share your route with trusted contacts. If you stop moving unexpectedly, your contacts are alerted. Designed for journalists and citizens travelling through high-risk areas.' },
      { q: 'What is the Watchlist?', a: 'Watchlists are geo-fenced alert zones you set up. When a report is filed inside your zone — your neighbourhood, your city, a border crossing — you get an instant notification.' },
      { q: 'Is my personal data safe?', a: 'Yes. We use industry-standard encryption, secure server infrastructure, and access controls. We do not sell personal data. See our Privacy Policy for full details.' },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-10">Everything you need to know about ReportAfrica — reporting, earning, verification, payments and more.</p>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{section.heading}</h2>
            <div className="space-y-2">
              {section.faqs.map((faq, i) => {
                const key = `${section.heading}-${i}`;
                return (
                  <div key={key} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setOpen(open === key ? null : key)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4">
                      <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                      <span className="text-gray-400 text-lg shrink-0">{open === key ? '−' : '+'}</span>
                    </button>
                    {open === key && (
                      <div className="px-5 pb-4">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-3">Still have questions?</p>
        <a href="mailto:support@reportafrica.africa"
          className="inline-block px-5 py-2.5 bg-[#0F7B6C] text-white text-sm font-semibold rounded-lg hover:bg-[#0a6358] transition">
          Contact Support
        </a>
      </div>
    </div>
  );
}
