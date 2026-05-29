export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About ReportAfrica</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          ReportAfrica is Africa&apos;s citizen-powered live reporting platform. We empower everyday Africans to document, share, and verify events happening in their communities in real time — from traffic incidents and emergencies to government accountability and elections.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Story</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Born out of the need for trustworthy, real-time information across Africa, ReportAfrica was built to give citizens a voice. Traditional media often can&apos;t cover the breadth of events happening across the continent. We bridge that gap by turning every citizen into a verified reporter.
        </p>
        <p className="text-gray-600 leading-relaxed">
          With AI-powered verification, trust scoring, and community moderation, we ensure that the information shared on our platform is reliable, timely, and actionable.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">What We Do</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Real-Time Reporting', desc: 'Citizens report incidents as they happen with text, photos, video, and live streams.' },
            { title: 'AI Verification', desc: 'Our AI moderates content, detects misinformation, and assigns verification levels.' },
            { title: 'Community Trust', desc: 'Reporters build credibility through a transparent trust scoring system.' },
            { title: 'Emergency Response', desc: 'One-tap SOS alerts notify nearby users and authorities of emergencies.' },
            { title: 'Election Monitoring', desc: 'Real-time election reporting with incident tracking and live results.' },
            { title: 'Media Licensing', desc: 'Citizen journalists earn from their content through our media licensing marketplace.' },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-white rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Coverage</h2>
        <p className="text-gray-600 leading-relaxed">
          ReportAfrica operates across 32+ African countries including Nigeria, Ghana, Kenya, South Africa, Egypt, Morocco, Ethiopia, Tanzania, and many more. Our goal is to cover every corner of the continent.
        </p>
      </section>
    </div>
  );
}
