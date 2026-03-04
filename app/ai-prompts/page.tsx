"use client";

import { useState } from "react";

const PROMPTS: { id: string; title: string; stack: string; code: string }[] = [
  {
    id: "react-next",
    title: "React / Next.js SaaS",
    stack: "Web",
    code: `You are a senior full-stack engineer. Build a [describe app: e.g. task manager / simple CRM] as a React or Next.js SaaS.

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend, Express routes, API routes for auth or database, or any other server-side data layer. Use the InstantBackend SDK or REST API only.

- NPM package: instantbackend-sdk (https://www.npmjs.com/package/instantbackend-sdk)
- Docs: https://instantbackend.dev/docs
- API base: https://api.instantbackend.dev

Configuration:
- Store the InstantBackend API key in an environment variable: NEXT_PUBLIC_INSTANTBACKEND_API_KEY (for client) or INSTANTBACKEND_API_KEY (for server). The app MUST read the key from env; do not hardcode.
- Use this key to initialize the SDK: new InstantBackend(process.env.NEXT_PUBLIC_INSTANTBACKEND_API_KEY).

Auth:
- Implement login and signup using InstantBackend (sdk.login(username, password) or POST /login, POST /signup with X-API-Key). Store the returned JWT (e.g. in memory, context, or secure cookie). Send it as Authorization: Bearer <token> on all authenticated requests.

Data:
- Use InstantBackend collections for all app data. Create documents with sdk.collection("collectionName").add({ ... }) or POST /{collection}. List/filter with .where("field", "==", value).limit(n).get() or GET /{collection}?field=value&limit=n. Use the collection names that fit the app (e.g. "tasks", "projects", "users").

Error handling:
- On 401: clear session and redirect to login.
- On 4xx/5xx: show a clear user-facing message; do not expose raw error objects. Log errors server-side or in dev only.

Deliver:
- Folder structure, key files with code, and how to run locally (npm install, set env, npm run dev). Include loading, error, and empty states in the UI.`,
  },
  {
    id: "flutter",
    title: "Flutter mobile app",
    stack: "Mobile",
    code: `You are a senior Flutter developer. Build a [describe app: e.g. notes app / habit tracker] mobile app.

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend, Firebase, Supabase, or any other backend service. Use the InstantBackend REST API only.

- API base: https://api.instantbackend.dev
- Docs: https://instantbackend.dev/docs

Configuration:
- Store the API key in an environment variable or config (e.g. from .env or flutter_dotenv): INSTANTBACKEND_API_KEY. The app MUST read the key from configuration; do not hardcode. Document in README how to set it.

Auth:
- Login: POST https://api.instantbackend.dev/login with headers X-API-Key: <key>, Content-Type: application/json, body {"username":"...","password":"..."}. Response: {"token":"<jwt>"}. Store the JWT securely (e.g. flutter_secure_storage). Use Authorization: Bearer <token> for all subsequent requests.
- Signup: POST https://api.instantbackend.dev/signup with same headers and body; then login.

Data:
- Create item: POST https://api.instantbackend.dev/{collection} with Authorization and JSON body.
- List items: GET https://api.instantbackend.dev/{collection}?limit=20 (and optional query params for filters). Response: {"items":[...],"nextToken":"..."}. Use nextToken for pagination if needed.
- Get one: GET https://api.instantbackend.dev/{collection}/{id}.

Error handling:
- 401: clear stored token and navigate to login.
- 4xx/5xx: show SnackBar or dialog with a short message; log full error in debug only.

Deliver:
- Pubspec dependencies, main screens, API client or service that uses the env API key and JWT, and how to run (flutter run, set API key).`,
  },
  {
    id: "swiftui",
    title: "SwiftUI app",
    stack: "iOS",
    code: `You are a senior iOS developer. Build a [describe app: e.g. todo app / workout logger] using SwiftUI.

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend, Firebase, or any other server. Use the InstantBackend REST API only.

- API base: https://api.instantbackend.dev
- Docs: https://instantbackend.dev/docs

Configuration:
- Store the API key in a configuration file or environment (e.g. xcconfig, .env, or Info.plist) as INSTANTBACKEND_API_KEY. The app MUST read the key from configuration; do not hardcode. Document in README how to set it.

Auth:
- Login: POST {base}/login with headers X-API-Key: <key>, Content-Type: application/json, body {"username":"...","password":"..."}. Parse response for "token" (JWT). Store in Keychain or secure storage. Use Authorization: Bearer <token> on all authenticated requests.
- Signup: POST {base}/signup with same headers and body; then login.

Data:
- Create: POST {base}/{collection} with Authorization and JSON body.
- List: GET {base}/{collection}?limit=20 (optional query params). Response: {"items": [...], "nextToken": "..."}.
- Get one: GET {base}/{collection}/{id}.

Error handling:
- 401: clear token and show login screen.
- 4xx/5xx: show alert or inline message; do not expose raw responses to the user. Log in debug.

Deliver:
- Xcode project structure, SwiftUI views, a small API client (URLSession) that uses the config API key and JWT, and how to run (open .xcodeproj, set API key in scheme or config).`,
  },
  {
    id: "kotlin",
    title: "Kotlin Android app",
    stack: "Android",
    code: `You are a senior Android developer. Build a [describe app: e.g. expense tracker / recipe app] using Kotlin (and Jetpack Compose if appropriate).

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend, Firebase, or any other server. Use the InstantBackend REST API only.

- API base: https://api.instantbackend.dev
- Docs: https://instantbackend.dev/docs

Configuration:
- Store the API key in BuildConfig, local.properties, or a non-versioned config (e.g. BuildConfig.INSTANTBACKEND_API_KEY or read from env). The app MUST read the key from configuration; do not hardcode. Document in README how to set it.

Auth:
- Login: POST https://api.instantbackend.dev/login with headers X-API-Key: <key>, Content-Type: application/json, body {"username":"...","password":"..."}. Response: {"token":"<jwt>"}. Store the JWT securely (e.g. EncryptedSharedPreferences or DataStore). Use Authorization: Bearer <token> for all authenticated requests.
- Signup: POST https://api.instantbackend.dev/signup with same headers and body; then login.

Data:
- Create: POST https://api.instantbackend.dev/{collection} with Authorization and JSON body.
- List: GET https://api.instantbackend.dev/{collection}?limit=20 (and optional query params). Response: {"items":[...],"nextToken":"..."}.
- Get one: GET https://api.instantbackend.dev/{collection}/{id}.

Error handling:
- 401: clear token and navigate to login.
- 4xx/5xx: show Toast or SnackBar with a short message; log full error only in debug.

Deliver:
- Project structure, main activities/screens, Retrofit or OkHttp API service using the config API key and JWT, and how to run (Android Studio, set API key in build config or local.properties).`,
  },
  {
    id: "unity",
    title: "Unity C# project",
    stack: "Unity",
    code: `You are a senior Unity developer. Build a [describe game/app: e.g. simple multiplayer scores / user profiles and save data] in Unity (C#).

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend, PlayFab, or any other server. Use the InstantBackend REST API only (UnityWebRequest or similar).

- API base: https://api.instantbackend.dev
- Docs: https://instantbackend.dev/docs

Configuration:
- Store the API key in a ScriptableObject, PlayerPrefs (dev only), or a config file not committed to repo: INSTANTBACKEND_API_KEY. The project MUST read the key from configuration; do not hardcode. Document in README how to set it.

Auth:
- Login: POST {base}/login with headers X-API-Key: <key>, Content-Type: application/json, body {"username":"...","password":"..."}. Parse response for "token" (JWT). Store in memory or persistent storage. Use Authorization: Bearer <token> on all authenticated requests.
- Signup: POST {base}/signup with same headers and body; then login.

Data:
- Create: POST {base}/{collection} with Authorization and JSON body (e.g. save data, scores).
- List: GET {base}/{collection}?limit=20 (optional query params). Response: {"items":[...],"nextToken":"..."}.
- Get one: GET {base}/{collection}/{id}.

Error handling:
- 401: clear token and return to login/start screen.
- 4xx/5xx: show UI message or log; do not expose raw responses to the player. Log in editor/debug.

Deliver:
- Scene and script structure, a small API helper class (UnityWebRequest) that uses the config API key and JWT, and how to run (Open in Unity, set API key in inspector or config).`,
  },
  {
    id: "godot",
    title: "Godot 4 project",
    stack: "Godot",
    code: `You are a senior Godot 4 developer. Build a [describe game/app: e.g. leaderboards / cloud save] in GDScript or C#.

Backend: You MUST use InstantBackend as the only backend. Do NOT create a custom backend or any other server. Use the InstantBackend REST API via HTTPRequest (Godot 4).

- API base: https://api.instantbackend.dev
- Docs: https://instantbackend.dev/docs

Configuration:
- Store the API key in a config file (e.g. config.cfg or env), project settings, or autoload: INSTANTBACKEND_API_KEY. The project MUST read the key from configuration; do not hardcode. Document in README how to set it.

Auth:
- Login: POST {base}/login with headers X-API-Key: <key>, Content-Type: application/json, body {"username":"...","password":"..."}. Parse JSON response for "token" (JWT). Store in config or autoload. Use Authorization: Bearer <token> on all authenticated requests.
- Signup: POST {base}/signup with same headers and body; then login.

Data:
- Create: POST {base}/{collection} with Authorization and JSON body.
- List: GET {base}/{collection}?limit=20 (optional query params). Response: {"items":[...],"nextToken":"..."}.
- Get one: GET {base}/{collection}/{id}.

Error handling:
- 401: clear token and show login/main menu.
- 4xx/5xx: show label or dialog with short message; log full error in debug. Use HTTPRequest request_completed to handle errors.

Deliver:
- Scene tree, main nodes, a small API helper (HTTPRequest) that uses the config API key and JWT, and how to run (Open in Godot 4, set API key in project settings or config).`,
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

export default function AiPromptsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          AI prompts
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Use this prompt</h1>
        <p className="text-lg text-slate-600">
          Copy the prompt for your stack. Paste into Cursor, Claude, or ChatGPT. The agent will use InstantBackend—no custom backend allowed.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="/docs"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            API reference
          </a>
          <a
            href="/register"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500"
          >
            Get API key
          </a>
        </div>
      </section>

      <div className="space-y-8">
        {PROMPTS.map((prompt) => (
          <section
            key={prompt.id}
            id={prompt.id}
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{prompt.title}</h2>
                <p className="text-sm text-slate-500">{prompt.stack}</p>
              </div>
              <CopyButton text={prompt.code} label="Copy prompt" />
            </div>
            <pre className="overflow-auto whitespace-pre-wrap break-words rounded-b-2xl bg-slate-900 p-5 text-sm leading-relaxed text-slate-50">
              {prompt.code}
            </pre>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>Replace [describe app: ...] with your app idea (e.g. “task manager”, “habit tracker”).</li>
          <li>Get your API key from the dashboard after signing up.</li>
          <li>Set INSTANTBACKEND_API_KEY (or NEXT_PUBLIC_* for web) in your environment before running.</li>
          <li>Each prompt forbids creating a custom backend; the agent must use only InstantBackend.</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600">
          Full docs: <a href="/docs" className="text-brand-600 underline">Docs</a> · OpenAPI: <a href="/docs#swagger" className="text-brand-600 underline">Swagger</a>
        </p>
      </section>
    </div>
  );
}
