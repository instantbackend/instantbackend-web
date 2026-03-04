---
title: "Cursor + InstantBackend: from prompt to production in minutes"
description: "Step-by-step: prompt, API key, and deploy."
date: "2025-01-20"
---

Go from a Cursor prompt to a running app in minutes—no custom backend, no server deploy.

**Step 1: Get your API key**  
[Sign up](https://instantbackend.dev/register), open the dashboard, and copy your InstantBackend API key.

**Step 2: Copy the prompt**  
Open [Use this prompt](/ai-prompts), copy the **React / Next.js SaaS** prompt, and paste it into Cursor. Replace the app description (e.g. "task manager" or "simple CRM").

**Step 3: Generate the app**  
Send the message. Cursor will generate the app and wire it to InstantBackend for auth and data.

**Step 4: Run locally**  
Add `NEXT_PUBLIC_INSTANTBACKEND_API_KEY=your_key` to `.env.local`, then `npm install && npm run dev`.

**Step 5: Deploy**  
Deploy the frontend (Vercel, Netlify, etc.). Keep the same env var in the project settings. No backend to deploy—InstantBackend is already live.

That’s it. [Get the prompt](/ai-prompts) and try it in Cursor.
