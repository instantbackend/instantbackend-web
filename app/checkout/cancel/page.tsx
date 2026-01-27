export default function CheckoutCancel() {
  return (
    <div className="max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
      <h1 className="text-3xl font-bold text-slate-900">Checkout canceled</h1>
      <p className="text-slate-700">
        Your Stripe checkout session was canceled. You can try again or choose another plan.
      </p>
      <div className="flex gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          Back to pricing
        </a>
        <a
          href="/docs"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          View docs
        </a>
      </div>
    </div>
  );
}

