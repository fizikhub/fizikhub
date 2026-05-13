const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function maskEmail(email) {
  if (!email || !email.includes("@")) return "";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } },
);

async function check() {
  const { data, error } = await supabase
    .from("profiles")
    .select("email, wants_email_notifications")
    .limit(20);

  if (error) throw error;

  console.log("Subscriber sample from profiles:");
  console.table(
    (data || []).map((row) => ({
      masked_email: maskEmail(row.email),
      wants_email_notifications: row.wants_email_notifications,
    })),
  );
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
