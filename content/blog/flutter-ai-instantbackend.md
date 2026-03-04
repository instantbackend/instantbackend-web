---
title: "Building a Flutter app with AI and InstantBackend"
description: "Flutter + InstantBackend prompt and setup."
date: "2024-12-10"
---

You can have an AI generate your Flutter app and use InstantBackend for auth and data—no custom backend, no Firebase required.

**Setup**

1. **API key.** [Sign up](https://instantbackend.dev/register) and copy your API key. Store it in your Flutter config (e.g. `.env` with `flutter_dotenv`, or a config file). Never hardcode it.
2. **Prompt.** Use the [Flutter prompt](/ai-prompts): it tells the AI to use only the InstantBackend REST API for login, signup, and CRUD.
3. **Auth.** `POST https://api.instantbackend.dev/login` with `X-API-Key` and `{"username","password"}`; store the JWT and send `Authorization: Bearer <token>` on later requests.
4. **Data.** `POST /{collection}` to create, `GET /{collection}?limit=20` to list (response: `items` + `nextToken`), `GET /{collection}/{id}` for one item.

**What the AI generates**

Screens, navigation, and a small API client that reads the key from config and uses the JWT for authenticated calls. You run `flutter run` and set the API key in your environment or config.

[Copy the Flutter prompt](/ai-prompts) and [check the API reference](/docs).
