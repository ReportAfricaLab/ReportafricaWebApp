'use client';
import { useState } from 'react';

const FAQS = [
  { q: 'What is ReportAfrica?', a: 'ReportAfrica is a citizen-powered live reporting platform that enables Africans to report incidents in real time — from traffic and emergencies to government accountability and elections.' },
  { q: 'Is it free to use?', a: 'Yes! Creating an account, submitting reports, and viewing the feed is completely free. We charge fees only on donations and media licensing transactions.' },
  { q: 'How does verification work?', a: 'Reports go through AI moderation first, then community members can confirm or dispute them. Your trust score increases with accurate, verified reports.' },
  { q: 'Can I report anonymously?', a: 'Yes. Toggle anonymous mode when creating a report. Your identity will be hidden from other users. We also offer face blur for photos and videos.' },
  { q: 'How do trust scores work?', a: 'You earn trust points for accurate reports, community verifications, and consistent activity. Points are deducted for flagged content or disputed reports. Higher trust unlocks features like priority placement.' },
  { q: 'How do donations work?', a: 'Verified users can create fundraising campaigns for emergencies. Donors contribute via Paystack. Campaigns are reviewed for fraud before funds are disbursed.' },
  { q: 'Can media houses use my content?', a: 'Yes! Through our Media Licensing feature, news organizations can request to license your reports. You earn 50% of the licensing fee.' },
  { q: 'What countries are supported?', a: 'We currently support 32+ African countries including Nigeria, Ghana, Kenya, South Africa, Egypt, Morocco, Ethiopia, Tanzania, Uganda, Rwanda, and more.' },
  { q: 'How does the SOS feature work?', a: 'Tap the SOS button to send an emergency alert with your location. Nearby users and relevant authorities are notified immediately.' },
  { q: 'Can I go live?', a: 'Yes! Authenticated users can start a live stream directly from the app. Viewers can watch in real time and interact via chat.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">Find answers to common questions about ReportAfrica.</p>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-5 py-4 text-left flex items-center justify-between">
              <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
              <span className="text-gray-400 text-lg">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
