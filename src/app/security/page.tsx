import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security | ReportAfrica',
  description: 'How ReportAfrica protects your data and keeps the platform secure.',
};

export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Security at ReportAfrica</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">

        <section>
          <p>
            ReportAfrica is built for Africa&apos;s most critical moments — elections, emergencies, breaking news.
            We take the security of your data and the integrity of the platform seriously.
            This page explains what we do to keep you safe.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Transport Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All traffic is encrypted via TLS 1.2+ enforced by Cloudflare</li>
            <li>HSTS (HTTP Strict Transport Security) with preload is enabled — your browser will always use HTTPS</li>
            <li>SSL certificates are managed and auto-renewed by Cloudflare</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Account Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Passwords are hashed with bcrypt (industry-standard, never stored in plain text)</li>
            <li>Login tokens expire after 15 minutes — you are automatically re-authenticated in the background</li>
            <li>Refresh token rotation: every token can only be used once. Reuse is detected and all your sessions are immediately revoked</li>
            <li>Account lockout after 10 failed login attempts (15-minute lock)</li>
            <li>IP-level brute force protection — repeated attacks from the same IP are blocked automatically</li>
            <li>Multi-factor authentication (TOTP) — coming in v2</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Infrastructure Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hosted on AWS (eu-west-1, Ireland) — one of the most secure cloud environments in the world</li>
            <li>Cloudflare WAF (Web Application Firewall) and DDoS protection on all traffic</li>
            <li>Server SSH access is disabled — all management is done via AWS SSM (no SSH keys in circulation)</li>
            <li>Firewall rules allow only ports 80 and 443 — no other ports are exposed</li>
            <li>Database deletion protection is enabled — the database cannot be accidentally deleted</li>
            <li>Media storage (S3) has versioning enabled — files can be recovered</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Data Protection</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All data in transit is encrypted</li>
            <li>We never store card numbers — payments are handled entirely by Paystack and KoraPay</li>
            <li>Application logs never contain request bodies or personal data</li>
            <li>Input sanitization strips XSS payloads from all data submitted to the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Your Rights (GDPR)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Export your data</strong> — download everything we hold about you from your profile settings</li>
            <li><strong>Delete your account</strong> — permanently remove your account and data at any time</li>
            <li><strong>Consent recorded</strong> — the date you accepted our terms is stored and auditable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Monitoring & Response</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All security events (lockouts, IP blocks, token reuse) are logged and trigger real-time alerts to our engineering team</li>
            <li>Error tracking via Sentry — all server errors are captured and reviewed</li>
            <li>We have a documented Incident Response Plan with defined response times for critical incidents</li>
            <li>GDPR breach notification: affected users are notified within 72 hours of a confirmed data breach</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Dependency & Code Security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Automated vulnerability scanning runs on every code change via GitHub Actions</li>
            <li>Pull requests that introduce known high or critical CVEs are blocked automatically</li>
            <li>An internal security audit has been completed — current score: ~87/100</li>
            <li>An external penetration test is planned for Phase 4 (post-launch)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Report a Vulnerability</h2>
          <p>
            If you discover a security vulnerability in ReportAfrica, please report it responsibly.
            Do not publicly disclose the issue until we have had a chance to address it.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <p className="font-semibold text-gray-900">Security Contact</p>
            <p className="mt-1">Email: <a href="mailto:security@reportafrica.africa" className="text-blue-600 hover:underline">security@reportafrica.africa</a></p>
            <p className="mt-1 text-gray-500 text-xs">We aim to acknowledge reports within 24 hours and resolve critical issues within 72 hours.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
