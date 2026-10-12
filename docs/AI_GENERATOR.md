# RecipePro server-side AI

RecipePro's AI generator calls the Supabase Edge Function `recipepro-ai-generator`. The OpenAI key is read only by the server from `OPENAI_API_KEY`; never put it in `JS/`, HTML, GitHub Pages, or `supabase-config.js`.

## One-time setup

1. Open the Supabase project: https://supabase.com/dashboard/project/yuebufitcmryovekraou
2. Go to **Edge Functions → Secrets** (or **Project Settings → Edge Functions → Secrets**, depending on the dashboard layout).
3. Add a secret named `OPENAI_API_KEY` with an API key from your OpenAI platform account.
4. Save the secret. The function is already deployed and reads it at runtime; redeployment should not be necessary.
5. Open RecipePro, sign in to a user account, and generate a recipe. The server-side generator requires an authenticated session; guests continue to have the local generator.

## Security and behavior

- Supabase validates the function JWT; the function also resolves the current user.
- Requests are restricted to the published GitHub Pages origin, POST/OPTIONS, 2,000 characters of prompt text, 10 detected ingredients, and a bounded catalog.
- A persistent database quota limits each account to 10 AI generations per rolling hour before provider usage is incurred.
- The response must match a strict JSON schema. Every ingredient ID must exist in the submitted catalog, amounts and units are validated, and at least one detected product must be used.
- Nutrition is recalculated in the browser by RecipePro's existing nutrition engine. It is an estimate based on the app's local food database, not a laboratory value.
- If the key is missing, the provider rejects it, or the service is unavailable, the UI falls back to the local recipe generator. Do not claim cloud AI is working until the secret is configured and a live signed-in generation succeeds.
- This initial version uses `gpt-4o-mini`. Provider usage may incur charges; set an appropriate budget/usage limit in the provider dashboard.
