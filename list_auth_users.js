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
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) throw error;

  console.log(`Total users in Auth page: ${users.length}`);
  users.slice(0, 5).forEach((user) => {
    console.log(`ID: ${user.id}, Email: ${maskEmail(user.email)}`);
  });
}

check().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
