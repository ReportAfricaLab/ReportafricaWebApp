export default function CareersPage() {
  const openings = [
    { title: 'Senior Backend Engineer', location: 'Remote (Africa)', type: 'Full-time', desc: 'Build scalable APIs and real-time systems powering citizen journalism across Africa.' },
    { title: 'Mobile Engineer (React Native)', location: 'Remote (Africa)', type: 'Full-time', desc: 'Craft the mobile experience for millions of citizen reporters across the continent.' },
    { title: 'AI/ML Engineer', location: 'Remote (Africa)', type: 'Full-time', desc: 'Develop content moderation, verification, and fraud detection models.' },
    { title: 'Product Designer', location: 'Remote (Africa)', type: 'Full-time', desc: 'Design intuitive interfaces for reporting, live streaming, and community features.' },
    { title: 'Community Manager', location: 'Lagos, Nigeria', type: 'Full-time', desc: 'Grow and moderate our reporter community. Be the voice of ReportAfrica.' },
    { title: 'Country Lead — Kenya', location: 'Nairobi, Kenya', type: 'Full-time', desc: 'Lead expansion efforts in East Africa. Build partnerships and grow the user base.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Careers at ReportAfrica</h1>
      <p className="text-gray-600 mb-10">Join us in building Africa&apos;s most trusted citizen reporting platform. We&apos;re a remote-first team passionate about civic technology and African innovation.</p>

      <div className="mb-10 p-6 bg-[#0F7B6C]/5 rounded-xl border border-[#0F7B6C]/10">
        <h2 className="font-semibold text-gray-900 mb-2">Why ReportAfrica?</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>🌍 Impact millions across Africa</div>
          <div>🏠 Remote-first culture</div>
          <div>📈 Equity & growth opportunities</div>
          <div>💰 Competitive compensation</div>
          <div>🎓 Learning & development budget</div>
          <div>🤝 Diverse, pan-African team</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Open Positions</h2>
      <div className="space-y-4">
        {openings.map((job) => (
          <div key={job.title} className="p-5 bg-white rounded-xl border border-gray-100 hover:border-[#0F7B6C] transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.desc}</p>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span>📍 {job.location}</span>
                  <span>⏰ {job.type}</span>
                </div>
              </div>
              <a href="mailto:careers@reportafrica.africa" className="px-4 py-2 text-xs font-semibold text-[#0F7B6C] border border-[#0F7B6C] rounded-lg hover:bg-[#0F7B6C]/5 shrink-0">
                Apply
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-600 text-sm">Don&apos;t see your role? Send us your CV at <a href="mailto:careers@reportafrica.africa" className="text-[#0F7B6C] font-semibold">careers@reportafrica.africa</a></p>
      </div>
    </div>
  );
}
