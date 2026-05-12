import fs from "node:fs";
import path from "node:path";
import {
  confirmationTemplate,
  magicLinkTemplate,
  recoveryTemplate,
} from "./auth-email-templates.mjs";

const cwd = process.cwd();
const envPath = path.join(cwd, ".env.local");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }
  return value;
}

function getProjectRef() {
  if (process.env.SUPABASE_PROJECT_REF) {
    return process.env.SUPABASE_PROJECT_REF;
  }

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  return new URL(url).hostname.split(".")[0];
}

loadDotEnv(envPath);

const accessToken = requireEnv("SUPABASE_ACCESS_TOKEN");
const resendApiKey = requireEnv("RESEND_API_KEY");
const projectRef = getProjectRef();

const payload = {
  external_email_enabled: true,
  mailer_autoconfirm: false,
  smtp_admin_email: "bildirim@fizikhub.com",
  smtp_host: "smtp.resend.com",
  smtp_port: "465",
  smtp_user: "resend",
  smtp_pass: resendApiKey,
  smtp_sender_name: "FizikHub",
  smtp_max_frequency: 60,
  mailer_subjects_confirmation: "FizikHub doğrulama kodun",
  mailer_templates_confirmation_content: confirmationTemplate,
  mailer_subjects_recovery: "FizikHub şifre sıfırlama",
  mailer_templates_recovery_content: recoveryTemplate,
  mailer_subjects_magic_link: "FizikHub giriş bağlantın",
  mailer_templates_magic_link_content: magicLinkTemplate,
};

const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  },
);

const text = await response.text();

if (!response.ok) {
  throw new Error(
    `Supabase auth email config update failed (${response.status}): ${text}`,
  );
}

console.log(`Supabase Auth email config updated for project ${projectRef}.`);
