import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
          InstantBackend
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Public documentation</h1>
        <p className="max-w-3xl text-lg text-slate-600">
          InstantBackend is a simple BaaS: authenticate, create collections, and query data
          with a lightweight SDK. Here are quick examples and the embedded swagger.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Quick SDK examples</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Node / JS</p>
            <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100 overflow-auto">
{`import { InstantBackend } from "instantbackend-sdk";

const sdk = new InstantBackend("YOUR_API_KEY");
const users = await sdk.collection("users").get();`}
            </pre>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Login + query</p>
            <pre className="rounded-lg bg-slate-900 p-4 text-sm text-slate-100 overflow-auto">
{`const sdk = new InstantBackend("YOUR_API_KEY");
await sdk.login("user", "pass");
const admins = await sdk
  .collection("users")
  .where("role", "==", "admin")
  .get();`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
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
  );
}

