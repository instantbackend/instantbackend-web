export default function CheckoutSuccess() {
  return (
    <div className="max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
      <h1 className="text-3xl font-bold text-slate-900">Payment successful</h1>
      <p className="text-slate-700">
        Your checkout session completed. You can return to the dashboard to continue building.
      </p>
      <div className="flex gap-3">
        <a
          href="/app"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          Go to dashboard
        </a>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

