export default function HowItWorksPage() {
  const steps = [
    { num: '1', title: 'Sign Up', desc: 'Create your free account in seconds. Choose your country and set up your reporter profile.' },
    { num: '2', title: 'Report an Incident', desc: 'See something happening? Tap "Report", add details, photos or video, and your location is captured automatically.' },
    { num: '3', title: 'AI Verification', desc: 'Our AI instantly moderates your report, checks for misinformation, and assigns a verification level.' },
    { num: '4', title: 'Community Verification', desc: 'Nearby citizens can confirm or dispute your report, strengthening its credibility.' },
    { num: '5', title: 'Build Trust', desc: 'Accurate reports earn you trust points. Higher trust levels unlock features like priority feed placement.' },
    { num: '6', title: 'Earn & Impact', desc: 'Media houses can license your content. Donations flow to verified emergency campaigns. Your reporting makes a difference.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h1>
      <p className="text-gray-600 mb-10">ReportAfrica makes citizen journalism simple, safe, and impactful. Here&apos;s how:</p>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4 items-start">
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

      <div className="mt-12 p-6 bg-[#0F7B6C]/5 rounded-xl border border-[#0F7B6C]/10">
        <h3 className="font-semibold text-gray-900 mb-2">Go Live</h3>
        <p className="text-gray-600 text-sm">For breaking events, tap &quot;Go Live&quot; to broadcast directly from the scene. Viewers can watch in real time and your stream is automatically recorded for verification.</p>
      </div>
    </div>
  );
}
