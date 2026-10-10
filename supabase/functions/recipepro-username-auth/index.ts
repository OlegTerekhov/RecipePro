import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigin = "https://olegterekhov.github.io";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

function respond(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (origin && origin !== allowedOrigin) return respond(403, { error: "Источник запроса не разрешён." });
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return respond(405, { error: "Метод не поддерживается." });

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return respond(500, { error: "Сервер авторизации не настроен." });

  let body: { action?: string; username?: string; password?: string };
  try { body = await req.json(); } catch { return respond(400, { error: "Некорректный запрос." }); }

  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return respond(400, { error: "Логин: 3–24 символа, только латинские буквы, цифры и _." });
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const email = `${username}@users.recipepro.invalid`;

  if (body.action === "resolve") {
    const { data, error } = await admin.from("recipepro_usernames")
      .select("username_normalized").eq("username_normalized", username).maybeSingle();
    if (error) return respond(500, { error: "Не удалось проверить логин. Попробуй позже." });
    if (!data) return respond(400, { error: "Логин или пароль неверен." });
    return respond(200, { email });
  }

  if (body.action !== "register") return respond(400, { error: "Неизвестное действие." });
  if (password.length < 10) return respond(400, { error: "Пароль должен содержать не менее 10 символов." });
  if (password.length > 128) return respond(400, { error: "Пароль слишком длинный." });

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { username },
  });
  if (createError || !created.user) {
    if (createError?.message?.toLowerCase().includes("already")) return respond(409, { error: "Этот логин уже занят." });
    return respond(400, { error: "Не удалось создать аккаунт. Проверь данные и попробуй другой логин." });
  }

  const { error: insertError } = await admin.from("recipepro_usernames").insert({
    username_normalized: username, user_id: created.user.id,
  });
  if (insertError) {
    await admin.auth.admin.deleteUser(created.user.id);
    if (insertError.code === "23505") return respond(409, { error: "Этот логин уже занят." });
    return respond(500, { error: "Не удалось сохранить логин. Попробуй ещё раз." });
  }
  return respond(200, { email, message: "Аккаунт создан." });
});
