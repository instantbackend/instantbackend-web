export default function SupportPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
          InstantBackend
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Support</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          If you need information or help, email us at{" "}
          <a href="mailto:info@instantbackend.dev" className="text-brand-600 underline">
            info@instantbackend.dev
          </a>
          .
        </p>
      </section>
    </div>
  );
}
