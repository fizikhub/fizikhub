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

async function sync() {
  const shouldWrite = process.env.CONFIRM_SYNC_EMAILS === "true";
  const {
    data: { users },
    error: authError,
  } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (authError) throw authError;

  console.log(`${shouldWrite ? "Syncing" : "Dry run for"} ${users.length} users...`);
  if (!shouldWrite) {
    console.log("Set CONFIRM_SYNC_EMAILS=true to write auth emails into profiles.");
  }

  let updates = 0;
  for (const user of users) {
    if (!user.email) continue;
    updates += 1;

    if (!shouldWrite) continue;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email: user.email })
      .eq("id", user.id);

    if (updateError) console.error(`Error updating user ${user.id}:`, updateError.message);
  }

  console.log(`${shouldWrite ? "Synced" : "Would sync"} ${updates} profiles.`);
}

sync().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
