import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import { ApiKeyCodeBlock } from "@/components/api-key-code-block";

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
            <div className="flex flex-col gap-1 pl-3 text-xs text-slate-500">
              <a href="#sdk-node-basic" className="hover:text-slate-700">
                Node / JS
              </a>
              <div className="flex flex-col gap-1 pl-3">
                <a href="#sdk-node-basic" className="hover:text-slate-700">
                  Basic read
                </a>
                <a href="#sdk-node-login" className="hover:text-slate-700">
                  Login + query
                </a>
                <a href="#sdk-node-register" className="hover:text-slate-700">
                  Register + invoices
                </a>
                <a href="#sdk-node-pagination" className="hover:text-slate-700">
                  Pagination + sorting
                </a>
                <a href="#sdk-node-custom-sort" className="hover:text-slate-700">
                  Custom sort field
                </a>
              </div>
              <a href="#sdk-android" className="hover:text-slate-700">
                Android
              </a>
              <a href="#sdk-ios" className="hover:text-slate-700">
                iOS
              </a>
              <a href="#sdk-unity" className="hover:text-slate-700">
                Unity
              </a>
            </div>
            <a href="#ai-prompts" className="hover:text-slate-900">
              AI prompts
            </a>
            <a href="#swagger" className="hover:text-slate-900">
              Swagger
            </a>
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1 space-y-8">
        <section id="overview" className="scroll-mt-24 space-y-3">
          <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">
            InstantBackend
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Public documentation</h1>
          <p className="max-w-3xl text-lg text-slate-600">
            InstantBackend is a simple BaaS: authenticate, create collections, and query data
            with a lightweight SDK. Here are quick examples and the embedded swagger.
          </p>
          <p className="text-sm text-slate-600">
            Find more examples on GitHub:{" "}
            <a
              href="https://github.com/instantbackend/instantbackend-examples"
              className="text-brand-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              instantbackend/instantbackend-examples
            </a>
          </p>
        </section>

        <Card id="sdk-examples" className="scroll-mt-24">
          <CardHeader>
            <CardTitle>Quick SDK examples</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div id="sdk-node-basic" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Node / JS</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                code={`import { InstantBackend } from "instantbackend-sdk";

const sdk = new InstantBackend("YOUR_API_KEY");
await sdk.login("user", "pass");
const tasks = await sdk
  .collection("tasks")
  .get();`}
              />
            </div>
            <div id="sdk-node-login" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Login + query</p>
              <ApiKeyCodeBlock
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
            <div id="sdk-node-register" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Register + login + invoices</p>
              <ApiKeyCodeBlock
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
            <div id="sdk-node-pagination" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Pagination + sorting</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                code={`const sdk = new InstantBackend("YOUR_API_KEY");
await sdk.login("user", "pass");

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
            <div id="sdk-node-custom-sort" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Custom sort field</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                code={`const sdk = new InstantBackend("YOUR_API_KEY");
await sdk.login("user", "pass");

await sdk.collection("ranking").add({
  username: "jane.doe",
  score: 1280,
  __sortBy: "score",
});

const topScores = await sdk
  .collection("ranking")
  .sort("desc")
  .limit(10)
  .get();`}
              />
            </div>
            <div id="sdk-android" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Android (Kotlin)</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                language="kotlin"
                code={`val client = OkHttpClient()

val loginPayload = """
  {"username":"jane.doe","password":"secure-password"}
""".trimIndent()

val loginRequest = Request.Builder()
  .url("https://api.instantbackend.dev/login")
  .post(
    loginPayload
      .toRequestBody("application/json".toMediaType())
  )
  .addHeader("X-API-Key", "YOUR_API_KEY")
  .build()

val loginResponse = client
  .newCall(loginRequest)
  .execute()
val token = JSONObject(
  loginResponse.body!!.string()
).getString("token")

val invoicePayload = """
  {"number":"INV-2026-001","status":"paid","total":1290}
""".trimIndent()

val createInvoiceRequest = Request.Builder()
  .url("https://api.instantbackend.dev/invoices")
  .post(
    invoicePayload
      .toRequestBody("application/json".toMediaType())
  )
  .addHeader("Authorization", "Bearer $token")
  .build()

client
  .newCall(createInvoiceRequest)
  .execute()

val listInvoicesRequest = Request.Builder()
  .url(
    "https://api.instantbackend.dev/invoices" +
      "?status=paid&limit=10"
  )
  .get()
  .addHeader("Authorization", "Bearer $token")
  .build()

val invoicesResponse = client
  .newCall(listInvoicesRequest)
  .execute()`}
              />
            </div>
            <div id="sdk-ios" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">iOS (Swift)</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                language="swift"
                code={`import Foundation

let apiKey = "YOUR_API_KEY"
let baseUrl = "https://api.instantbackend.dev"

func request(
  _ path: String,
  method: String,
  body: Data? = nil,
  token: String? = nil
) -> URLRequest {
  var req = URLRequest(
    url: URL(string: baseUrl + path)!
  )
  req.httpMethod = method
  req.setValue(
    "application/json",
    forHTTPHeaderField: "Content-Type"
  )
  if let token = token {
    req.setValue(
      "Bearer \\(token)",
      forHTTPHeaderField: "Authorization"
    )
  } else {
    req.setValue(apiKey, forHTTPHeaderField: "X-API-Key")
  }
  req.httpBody = body
  return req
}

let loginBody = try JSONSerialization.data(
  withJSONObject: [
    "username": "jane.doe",
    "password": "secure-password"
  ]
)

let loginReq = request(
  "/login",
  method: "POST",
  body: loginBody
)
let loginData = try await URLSession.shared
  .data(for: loginReq).0
let token = try JSONSerialization.jsonObject(
  with: loginData
) as? [String: Any]
let jwt = token?["token"] as? String ?? ""

let invoiceBody = try JSONSerialization.data(
  withJSONObject: [
    "number": "INV-2026-001",
    "status": "paid",
    "total": 1290
  ]
)

let createReq = request(
  "/invoices",
  method: "POST",
  body: invoiceBody,
  token: jwt
)
_ = try await URLSession.shared.data(for: createReq)

let listReq = request(
  "/invoices?status=paid&limit=10",
  method: "GET",
  token: jwt
)
_ = try await URLSession.shared.data(for: listReq)`}
              />
            </div>
            <div id="sdk-unity" className="scroll-mt-24 space-y-2">
              <p className="text-sm font-semibold text-slate-800">Unity (C#)</p>
              <ApiKeyCodeBlock
                className="shadow-inner"
                language="csharp"
                code={`using System.Text;
using UnityEngine;
using UnityEngine.Networking;

public class InstantBackendExample : MonoBehaviour
{
  private const string ApiKey = "YOUR_API_KEY";
  private const string BaseUrl =
    "https://api.instantbackend.dev";

  private IEnumerator Start()
  {
    var loginBody =
      "{\"username\":\"jane.doe\",\"password\":\"secure-password\"}";
    var loginReq = new UnityWebRequest(
      BaseUrl + "/login",
      "POST"
    );
    loginReq.uploadHandler = new UploadHandlerRaw(
      Encoding.UTF8.GetBytes(loginBody)
    );
    loginReq.downloadHandler = new DownloadHandlerBuffer();
    loginReq.SetRequestHeader(
      "Content-Type",
      "application/json"
    );
    loginReq.SetRequestHeader("X-API-Key", ApiKey);
    yield return loginReq.SendWebRequest();

    var token = JsonUtility.FromJson<TokenResponse>(
      loginReq.downloadHandler.text
    ).token;

    var saveBody =
      "{\"userId\":\"jane.doe\",\"level\":5," +
      "\"coins\":1200,\"updatedAt\":\"2026-01-28T12:00:00Z\"}";
    var createReq = new UnityWebRequest(
      BaseUrl + "/saves",
      "POST"
    );
    createReq.uploadHandler = new UploadHandlerRaw(
      Encoding.UTF8.GetBytes(saveBody)
    );
    createReq.downloadHandler = new DownloadHandlerBuffer();
    createReq.SetRequestHeader(
      "Content-Type",
      "application/json"
    );
    createReq.SetRequestHeader(
      "Authorization",
      "Bearer " + token
    );
    yield return createReq.SendWebRequest();

    var listReq = UnityWebRequest.Get(
      BaseUrl + "/saves?userId=jane.doe&limit=1"
    );
    listReq.SetRequestHeader(
      "Authorization",
      "Bearer " + token
    );
    yield return listReq.SendWebRequest();
  }

  [System.Serializable]
  private class TokenResponse
  {
    public string token;
  }
}`}
              />
            </div>
          </CardContent>
        </Card>



        <section id="ai-prompts" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">AI prompts</h2>
            <p className="text-slate-600">
              Use these prompts to generate apps that integrate InstantBackend quickly.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">App generator prompt</p>
            <CodeBlock
              className="shadow-inner"
              code={`You are a senior full-stack engineer. Build a small web app
that uses the InstantBackend SDK.
Note the SDK is available at:
- https://www.npmjs.com/package/instantbackend-sdk
Docs:
- https://www.instantbackend.dev/docs

Requirements:
- Use instantbackend-sdk for auth and data access.
- Implement login, create, and list flows.
- Use a collection named "tasks".
- After login, create a task and then fetch tasks filtered by status.
- Include clear UI states (loading, error, empty, success).
- Keep the code minimal and production-ready.

Provide:
- Folder structure
- Key files with code
- How to run locally`}
            />
          </div>
        </section>
        <section id="swagger" className="scroll-mt-24 space-y-4">
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

