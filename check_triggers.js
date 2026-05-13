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
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } },
);

async function check() {
  const { data, error } = await supabase.rpc("get_triggers");

  if (error) {
    console.log("RPC get_triggers failed. Check database migrations or SQL editor for trigger details.");
    console.error(error.message);
    return;
  }

  console.log(data);
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
