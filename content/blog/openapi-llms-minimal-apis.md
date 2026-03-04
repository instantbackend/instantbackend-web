---
title: "OpenAPI and LLMs: why minimal APIs win for code generation"
description: "How small, consistent APIs improve LLM-generated integration code."
date: "2024-11-15"
---

When an LLM generates code that talks to your API, the size and shape of that API directly affect quality: fewer endpoints and consistent responses mean less confusion and fewer bugs in the generated code.

**Why minimal helps**

- **Fewer tokens.** A small OpenAPI spec (login, signup, collection CRUD) fits in context without trimming. The model sees the full contract.
- **Predictable patterns.** Same response shape for lists (`items` + `nextToken`), single resources, and errors. The model can reuse one integration pattern.
- **Less to get wrong.** No RLS, no custom security rules, no optional features the model might misuse.

**What we do for InstantBackend**

- **OpenAPI.** Public spec at [instantbackend.dev/docs](/docs) so agents can see the exact schema.
- **Stable JSON.** List → `{ "items": [...], "nextToken": "..." }`. Errors → `{ "message": "..." }` or a small set of codes. Same every time.
- **Naming.** Collections as plural, lowercase (e.g. `tasks`, `scores`). Endpoints: `GET/POST /{collection}`, `GET /{collection}/{id}`.

The result: prompts that say "use InstantBackend" produce consistent, maintainable integration code. [See the API](/docs) and [Use this prompt](/ai-prompts) for your stack.
