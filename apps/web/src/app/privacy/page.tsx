export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-2">We collect information you provide directly:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>Account information (email, username, display name, country)</li>
            <li>Reports you submit (text, media, location data)</li>
            <li>Verification votes and interactions</li>
            <li>Payment information for donations (processed by Paystack)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">We automatically collect:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>Device information and IP address</li>
            <li>Location data (only when you submit a report or enable location features)</li>
            <li>Usage analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>To provide and improve our reporting platform</li>
            <li>To verify reports and calculate trust scores</li>
            <li>To show relevant, location-based reports in your feed</li>
            <li>To process donations and media licensing payments</li>
            <li>To send emergency alerts and notifications</li>
            <li>To enforce community guidelines and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Anonymous Reporting</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            We support anonymous reporting. When you report anonymously, your identity is hidden from other users. We may still retain your information internally for fraud prevention, but it will never be publicly displayed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Face Blur & Privacy Protection</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Our AI-powered face blur feature automatically detects and blurs faces in uploaded media to protect bystander privacy. You can also manually enable face blur before submitting reports.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Sharing</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            We do not sell your personal data. We may share information with: payment processors (Paystack, KoraPay), cloud infrastructure providers (AWS), and law enforcement when legally required.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention & Deletion</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            You can request deletion of your account and associated data at any time by contacting us. Reports you&apos;ve submitted may be retained in anonymized form for public interest purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            For privacy-related inquiries, contact us at privacy@reportafrica.com.
          </p>
        </section>
      </div>
    </div>
  );
}
