---
title: "Claude and InstantBackend: auth and CRUD without custom code"
description: "Use Claude to generate your app; use InstantBackend for the backend."
date: "2025-01-10"
---

Claude can build your UI and business logic quickly. For auth and data, instead of letting it invent API routes and a database layer, point it at InstantBackend: one backend, one instruction.

**In the prompt**

Tell Claude to use InstantBackend as the **only** backend. No custom server, no Firebase or Supabase unless you explicitly want them. Specify:

- **Auth:** `POST /login`, `POST /signup` with `X-API-Key`; use the returned JWT as `Authorization: Bearer <token>`.
- **CRUD:** `GET /{collection}`, `POST /{collection}`, `GET /{collection}/{id}`. List responses: `{ "items": [...], "nextToken": "..." }`.
- **Config:** API key from env (e.g. `INSTANTBACKEND_API_KEY` or `NEXT_PUBLIC_INSTANTBACKEND_API_KEY` for web).

**What you get**

Login, signup, and full CRUD on collections without writing or deploying backend code. Claude generates the frontend and the InstantBackend calls; you add your API key and run.

[Copy the prompts](/ai-prompts) for React, Flutter, Swift, Kotlin, Unity, and Godot—each one instructs the AI to use InstantBackend and nothing else.
