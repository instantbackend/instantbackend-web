export default function TermsPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
          InstantBackend
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Terms and conditions</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          These terms govern the use of the InstantBackend BaaS service. By creating an account
          or using the platform, you agree to these conditions.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Acceptance of service</h2>
        <p>
          The service is provided as is and may change over time. You must be of legal age and
          have the legal capacity to use it on your own behalf or for your organization.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Account and credentials</h2>
        <p>
          You are responsible for keeping your credentials, API keys, and tokens secure. Notify
          us immediately if you suspect unauthorized access.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Acceptable use</h2>
        <p>
          You must not use the service for illegal or malicious activities, resource abuse,
          intrusion attempts, spam, malware, or third-party rights violations.
        </p>
        <p>
          We may limit or suspend access if we detect usage that affects the security,
          performance, or stability of the platform.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Data and privacy</h2>
        <p>
          You are responsible for the content you store. Do not upload sensitive data without
          adequate safeguards. Comply with applicable regulations in your jurisdiction.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Payments and subscriptions</h2>
        <p>
          Paid plans are billed according to published pricing and the payment provider. Plan
          changes may apply prorations or adjustments based on the active billing cycle.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Availability and support</h2>
        <p>
          We work to keep the service available, but we do not guarantee uninterrupted service.
          Downtime may occur due to maintenance or third-party failures.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Limitation of liability</h2>
        <p>
          To the extent permitted by law, InstantBackend is not liable for indirect damages, loss
          of profits, or damages arising from the use of the service.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Termination</h2>
        <p>
          You can cancel your account at any time. We may suspend or terminate the service if you
          breach these terms or for justified operational reasons.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Changes to these terms</h2>
        <p>
          We may update these terms. We will publish the current version on this page. Continued
          use of the service implies acceptance of the updates.
        </p>
      </section>

      <section className="text-sm text-slate-500">
        <p>Last updated: January 28, 2026.</p>
      </section>
    </div>
  );
}
