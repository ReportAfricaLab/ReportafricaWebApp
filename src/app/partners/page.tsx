export default function PartnersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Partners</h1>
      <p className="text-gray-600 mb-10">ReportAfrica works with media organizations, NGOs, and government agencies to amplify citizen voices and improve public safety.</p>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Partnership Types</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <p className="text-2xl mb-3">📺</p>
            <h3 className="font-semibold text-gray-900 mb-2">Media Houses</h3>
            <p className="text-sm text-gray-600">License verified citizen content for your newsroom. Access real-time reports, photos, and live streams from across Africa.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <p className="text-2xl mb-3">🏛️</p>
            <h3 className="font-semibold text-gray-900 mb-2">Government Agencies</h3>
            <p className="text-sm text-gray-600">Access our Government Dashboard for real-time incident monitoring, emergency response coordination, and public safety analytics.</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100">
            <p className="text-2xl mb-3">🤝</p>
            <h3 className="font-semibold text-gray-900 mb-2">NGOs & Civil Society</h3>
            <p className="text-sm text-gray-600">Leverage citizen reports for humanitarian response, election monitoring, and human rights documentation.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">What Partners Get</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Real-time API access to verified reports',
            'Custom dashboards and analytics',
            'Priority content licensing',
            'Dedicated account management',
            'Co-branded campaigns and initiatives',
            'Early access to new features',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-[#0F7B6C]">✓</span>
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 bg-[#0F7B6C]/5 rounded-xl border border-[#0F7B6C]/10 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Become a Partner</h2>
        <p className="text-gray-600 text-sm mb-4">Interested in partnering with ReportAfrica? Let&apos;s talk.</p>
        <a href="mailto:support@reportafrica.africa" className="inline-block px-6 py-3 bg-[#0F7B6C] text-white font-semibold rounded-lg hover:bg-[#0B6E4F] transition">
          Contact Partnerships Team
        </a>
      </section>
    </div>
  );
}
