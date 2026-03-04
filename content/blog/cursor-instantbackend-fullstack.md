---
title: "How to build a full-stack app with Cursor and InstantBackend"
description: "From prompt to production in minutes using Cursor and InstantBackend."
date: "2025-03-01"
---

Cursor is one of the fastest ways to go from an idea to a working app. The catch: if you ask it to build something full-stack, it often generates a custom backend—Express routes, API handlers, maybe a database layer. That's flexible, but it's also more code to maintain and more room for bugs. A simpler path is to tell Cursor exactly which backend to use: InstantBackend. One prompt, one API key, and you get auth, collections, and usage out of the box. Here's how to build a full-stack app with Cursor and InstantBackend in a few minutes.

## 1. Get your InstantBackend API key

If you don't have an account yet, [sign up at InstantBackend](/register). After logging in, open the dashboard—your API key is there. You'll use it only in your app's environment (e.g. in a `.env.local` file), never in the prompt or in committed code.

## 2. Copy the right prompt

Go to [Use this prompt](/ai-prompts) and copy the **React / Next.js SaaS** prompt. That prompt explicitly tells the AI to use InstantBackend as the only backend and forbids creating custom API routes or a server-side data layer. It also specifies using `NEXT_PUBLIC_INSTANTBACKEND_API_KEY` so the generated code reads the key from the environment.

## 3. Tell Cursor what to build

In Cursor, start a new chat or project. Paste the prompt at the top, then replace the placeholder with your app idea. For example:

```
You are a senior full-stack engineer. Build a **task manager** as a React or Next.js SaaS.

Backend: You MUST use InstantBackend as the only backend...
```

Send the message. Cursor will generate the app structure, components, and the InstantBackend integration. Because the prompt is strict about "no custom backend," the output should use only the InstantBackend SDK (or REST calls to `api.instantbackend.dev`) for auth and data.

## 4. Set the API key and run

In your project folder, create a `.env.local` (or `.env`) and add:

```
NEXT_PUBLIC_INSTANTBACKEND_API_KEY=your_api_key_here
```

Install dependencies and run the app (e.g. `npm install && npm run dev`). The first time you use login or signup, InstantBackend will create the user; collections are created on first write. No migrations or backend deploy step.

## 5. Iterate with Cursor

You can keep asking Cursor to add features (e.g. "add a filter by status" or "add a profile page"). Remind it to keep using InstantBackend for any new data or auth needs—e.g. "store this in the same InstantBackend collection" or "use the existing login flow." That keeps the stack consistent and avoids a mix of custom APIs and InstantBackend.

## What you get

A full-stack app with login/signup, CRUD on collections (e.g. tasks), and a single backend that's already hosted and scaled. No server code to deploy, no database to configure. When you're ready to ship, point your frontend at your own domain and keep using the same InstantBackend API key (and upgrade the plan if you need more requests or storage).

[Get the React / Next.js prompt](/ai-prompts) and try it in Cursor—from idea to running app in minutes.
