import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for InstantBackend. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
          InstantBackend
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Privacy policy</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          This policy explains how InstantBackend collects, uses, and protects your information
          when you use our BaaS platform and website.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Information we collect</h2>
        <p>
          We collect account details such as email, username, and authentication credentials, as
          well as billing details when you subscribe to a paid plan.
        </p>
        <p>
          We also collect usage data like API requests, storage consumption, and service logs to
          operate, secure, and improve the platform.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">How we use information</h2>
        <p>
          We use your information to provide the service, authenticate users, process payments,
          monitor performance, and communicate about account or service updates.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Customer data</h2>
        <p>
          You control the data you store in InstantBackend. You are responsible for obtaining
          necessary consent and ensuring your own compliance with privacy regulations.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Sharing and third parties</h2>
        <p>
          We share data with trusted providers only as needed to deliver the service, such as
          cloud infrastructure and payment processors. We do not sell personal data.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Data retention</h2>
        <p>
          We retain account and usage information for as long as your account is active or as
          required to meet legal, billing, or security obligations.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational safeguards to protect
          data. No system is fully secure, so we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Your choices</h2>
        <p>
          You can update or delete your account information by contacting us. Some data may need
          to be retained for legal or operational reasons.
        </p>
      </section>

      <section className="space-y-4 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">Changes to this policy</h2>
        <p>
          We may update this policy from time to time. We will post the current version on this
          page, and continued use of the service indicates acceptance of the changes.
        </p>
      </section>

      <section className="text-sm text-slate-500">
        <p>Last updated: January 28, 2026.</p>
      </section>
    </div>
  );
}
