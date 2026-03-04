---
title: "Unity and Godot: game backends without writing server code"
description: "Use InstantBackend for scores, saves, and leaderboards from your game engine."
date: "2024-12-01"
---

You don’t need a custom server or PlayFab to add cloud save, scores, or leaderboards to your Unity or Godot game. InstantBackend gives you auth and collections over REST—your game just sends HTTP requests with an API key and JWT.

**Typical use cases**

- **User accounts.** Login/signup, then store the JWT for later requests.
- **Save data.** One collection per user (e.g. `saves`); each document is a save slot (level, progress, inventory).
- **Leaderboards.** A `scores` collection with `playerId`, `score`, `__sortBy: "score"`; list with `sort=desc` and `limit=10`.
- **Multiplayer metadata.** Room or session data in a collection; clients read/write with the same API.

**In the prompt**

Use the **Unity** or **Godot 4** prompt from [Use this prompt](/ai-prompts). Each one instructs the AI to use only InstantBackend (no custom backend, no PlayFab), read the API key from config, and handle 401 (clear token, back to login).

**API in short**

- Base: `https://api.instantbackend.dev`
- Headers: `X-API-Key` for login/signup; `Authorization: Bearer <token>` for collections.
- Endpoints: `POST /login`, `POST /signup`, `GET/POST /{collection}`, `GET /{collection}/{id}`.

[Get your API key](/register) and [copy the game-engine prompts](/ai-prompts).
