export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Press & Media Kit</h1>
      <p className="text-gray-600 mb-10">Resources for journalists and media covering ReportAfrica.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">About ReportAfrica</h2>
        <div className="p-5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
          ReportAfrica is Africa&apos;s citizen-powered live reporting platform, enabling real-time incident reporting, AI-verified news, and community-driven accountability across 32+ African countries. Founded in 2024, the platform combines citizen journalism with AI verification, trust scoring, and media licensing to create a reliable, decentralized news ecosystem for the continent.
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Facts</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Countries', value: '32+' },
            { label: 'Report Categories', value: '8' },
            { label: 'Founded', value: '2024' },
            { label: 'Headquarters', value: 'Lagos, Nigeria' },
            { label: 'Platform', value: 'Web, iOS, Android' },
            { label: 'Languages', value: '9+' },
          ].map((fact) => (
            <div key={fact.label} className="p-4 bg-white rounded-lg border border-gray-100 text-center">
              <p className="text-2xl font-bold text-[#0F7B6C]">{fact.value}</p>
              <p className="text-xs text-gray-500 mt-1">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Brand Assets</h2>
        <p className="text-gray-600 text-sm mb-4">Download our logo and brand assets for editorial use.</p>
        <div className="flex gap-4">
          <div className="p-6 bg-white rounded-xl border border-gray-100 flex-1 text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Primary Logo</p>
            <p className="text-xs text-gray-500">PNG, SVG formats</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-100 flex-1 text-center">
            <p className="text-sm font-medium text-white mb-2">Logo (Dark BG)</p>
            <p className="text-xs text-gray-400">PNG, SVG formats</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Brand Colors</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-16 rounded-lg bg-[#0F7B6C] mb-2" />
            <p className="text-xs text-gray-600 text-center">Primary #0F7B6C</p>
          </div>
          <div className="flex-1">
            <div className="h-16 rounded-lg bg-[#D92D20] mb-2" />
            <p className="text-xs text-gray-600 text-center">Emergency #D92D20</p>
          </div>
          <div className="flex-1">
            <div className="h-16 rounded-lg bg-[#F97316] mb-2" />
            <p className="text-xs text-gray-600 text-center">Humanitarian #F97316</p>
          </div>
          <div className="flex-1">
            <div className="h-16 rounded-lg bg-[#1D4ED8] mb-2" />
            <p className="text-xs text-gray-600 text-center">Info #1D4ED8</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Press Contact</h2>
        <p className="text-gray-600 text-sm">For press inquiries, interviews, or media partnerships:</p>
        <p className="text-[#0F7B6C] font-semibold text-sm mt-2">press@reportafrica.africa</p>
      </section>
    </div>
  );
}
