const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("browser bundle contains no server-side Supabase credentials or common secret keys", () => {
  const clientFiles = [
    "index.html",
    ...fs.readdirSync(path.join(root, "JS"))
      .filter(name => name.endsWith(".js"))
      .map(name => path.join("JS", name))
  ];
  const forbidden = [
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /service_role/i,
    /sb_secret_[A-Za-z0-9_-]{12,}/,
    /sk-[A-Za-z0-9]{20,}/
  ];

  for (const file of clientFiles) {
    const source = read(file);
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, `Potential secret in client file: ${file} (${pattern})`);
    }
  }
});

test("cloud database enforces per-user row isolation with RLS", () => {
  const schema = read("supabase/schema.sql");
  assert.match(schema, /alter table public\.recipepro_user_data enable row level security/i);
  assert.match(schema, /using \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(schema, /with check \(\(select auth\.uid\(\)\) = user_id\)/i);
  assert.match(schema, /revoke all on table public\.recipepro_usernames from anon, authenticated/i);
});

test("username authentication endpoint restricts origin, method and password length", () => {
  const handler = read("supabase/functions/recipepro-username-auth/index.ts");
  assert.match(handler, /Access-Control-Allow-Origin/);
  assert.match(handler, /origin !== allowedOrigin/);
  assert.match(handler, /req\.method !== "POST"/);
  assert.match(handler, /password\.length < 10/);
  assert.match(handler, /password\.length > 128/);
  assert.match(handler, /Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
});
