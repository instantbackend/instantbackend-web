import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

export default function DocsPage() {
  return (
    <div className="mx-auto flex max-w-6xl gap-8">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            On this page
          </p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
            <a href="#overview" className="hover:text-slate-900">
              Overview
            </a>
            <a href="#sdk-examples" className="hover:text-slate-900">
              SDK examples
            </a>
            <a href="#swagger" className="hover:text-slate-900">
              Swagger
            </a>
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1 space-y-8">
        <section id="overview" className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
            InstantBackend
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Public documentation</h1>
          <p className="max-w-3xl text-lg text-slate-600">
            InstantBackend is a simple BaaS: authenticate, create collections, and query data
            with a lightweight SDK. Here are quick examples and the embedded swagger.
          </p>
        </section>

        <Card id="sdk-examples">
          <CardHeader>
            <CardTitle>Quick SDK examples</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Node / JS</p>
              <CodeBlock
                className="shadow-inner"
                code={`import { InstantBackend } from "instantbackend-sdk";

const sdk = new InstantBackend("YOUR_API_KEY");
const tasks = await sdk.collection("tasks").get();`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Login + query</p>
              <CodeBlock
                className="shadow-inner"
                code={`const sdk = new InstantBackend("YOUR_API_KEY");
await sdk.login("user", "pass");

await sdk.collection("tasks").add({
  title: "Send proposal",
  status: "open",
  priority: "high",
});

const openTasks = await sdk
  .collection("tasks")
  .where("status", "==", "open")
  .get();`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Register + login + invoices</p>
              <CodeBlock
                className="shadow-inner"
                code={`const sdk = new InstantBackend("YOUR_API_KEY");

await sdk.registerUserForAccount(
  "jane.doe",
  "secure-password",
  "jane.doe@company.com",
  "Jane Doe"
);

await sdk.login("jane.doe", "secure-password");

await sdk.collection("invoices").add({
  number: "INV-2026-001",
  status: "paid",
  total: 1290,
});

const paidInvoices = await sdk
  .collection("invoices")
  .where("status", "==", "paid")
  .limit(10)
  .get();`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">Pagination + sorting</p>
              <CodeBlock
                className="shadow-inner"
                code={`const sdk = new InstantBackend("YOUR_API_KEY");

const recentInvoices = await sdk
  .collection("invoices")
  .sort("desc")
  .limit(5)
  .get();

const nextPage = await sdk
  .collection("invoices")
  .sort("desc")
  .limit(5)
  .nextToken(recentInvoices.nextToken)
  .get();`}
              />
            </div>
          </CardContent>
        </Card>

        <section id="swagger" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Swagger</h2>
            <p className="text-slate-600">
              Embedded OpenAPI reference. You can open it in a new window if you prefer.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 shadow-card">
            <iframe
              src="/swagger/swagger-ui.html"
              className="w-full min-h-[80vh]"
              title="InstantBackend Swagger"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

