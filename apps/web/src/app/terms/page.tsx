export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            By accessing or using ReportAfrica, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Eligibility</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            You must be at least 16 years old to use ReportAfrica. By creating an account, you represent that you meet this requirement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>You are responsible for maintaining the security of your account</li>
            <li>One account per person; multiple accounts may be suspended</li>
            <li>You must provide accurate information during registration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Content & Reporting</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>You retain ownership of content you submit</li>
            <li>By submitting, you grant ReportAfrica a license to display and distribute your content</li>
            <li>Reports must be truthful and based on firsthand observation</li>
            <li>Deliberately false reports will result in trust score penalties and potential suspension</li>
            <li>Content violating community guidelines will be removed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Media Licensing</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            When you accept a media licensing request, you grant the requesting organization usage rights as specified. Revenue is split 50/50 between the reporter and the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Donations & Campaigns</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>Campaign creators must provide truthful information about their cause</li>
            <li>Fraudulent campaigns will be removed and creators banned</li>
            <li>Donations are non-refundable once disbursed to campaign creators</li>
            <li>ReportAfrica charges a platform fee on donations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Trust Score & Verification</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Your trust score reflects your reporting accuracy and community standing. It is calculated algorithmically and may affect content visibility. Manipulation of the trust system is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Prohibited Conduct</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
            <li>Submitting false or misleading reports</li>
            <li>Hate speech, harassment, or incitement to violence</li>
            <li>Spam or automated submissions</li>
            <li>Impersonation of other users or authorities</li>
            <li>Attempting to manipulate trust scores or verification</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Termination</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Questions about these terms? Contact us at legal@reportafrica.com.
          </p>
        </section>
      </div>
    </div>
  );
}
