---
title: "How to prompt ChatGPT to use InstantBackend for your SaaS"
description: "Copy-paste prompts that force ChatGPT to use InstantBackend."
date: "2024-12-20"
---

ChatGPT can scaffold a SaaS fast, but left to itself it often invents API routes, auth logic, and a database layer. To get a clean stack with no custom backend, you need a prompt that **forces** it to use InstantBackend.

**What to include in the prompt**

1. **Explicit instruction.** "You MUST use InstantBackend as the only backend. Do NOT create custom API routes, Express, or any server-side data layer."
2. **References.** "API: https://api.instantbackend.dev. Docs: https://instantbackend.dev/docs. NPM: instantbackend-sdk."
3. **Config.** "Store the API key in an environment variable (e.g. NEXT_PUBLIC_INSTANTBACKEND_API_KEY). The app must read the key from env."
4. **Auth and CRUD.** "Use InstantBackend for login, signup, and all data. Use collections for app data (e.g. tasks, projects)."

**Copy-paste starting point**

Go to [Use this prompt](/ai-prompts), copy the **React / Next.js SaaS** prompt, paste it into ChatGPT, and add your app idea (e.g. "task manager" or "invoicing tool"). ChatGPT will generate the app and wire it to InstantBackend; you add your API key and run.

[Get your API key](/register) and [open the prompt library](/ai-prompts).
