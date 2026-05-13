const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  { auth: { persistSession: false } },
);

async function check() {
  const { count, error } = await supabase
    .from("profiles")
    .select("email", { count: "exact", head: true })
    .not("email", "is", null);

  if (error) throw error;
  console.log(`Profiles with non-null email: ${count || 0}`);
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
