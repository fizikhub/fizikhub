import fs from "node:fs";
import path from "node:path";

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

const confirmationTemplate = `
<div style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:32px 28px 12px;">
              <p style="margin:0 0 10px;color:#f97316;font-size:14px;font-weight:700;">Fizikhub</p>
              <h1 style="margin:0;color:#111827;font-size:28px;line-height:1.25;">Fizikhub'a hoş geldin!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 10px;">
              <p style="margin:0;color:#374151;font-size:16px;line-height:1.6;">Hesabını doğrulamak için aşağıdaki kodu kullan:</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 24px;">
              <div style="display:inline-block;background:#111827;color:#ffffff;border-radius:10px;padding:16px 22px;font-size:34px;line-height:1;font-weight:800;letter-spacing:6px;">{{ .Token }}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 32px;">
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">Bu kodu sen istemediysen bu e-postayı güvenle yok sayabilirsin.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
`.trim();

const recoveryTemplate = `
<h2>Fizikhub şifre sıfırlama</h2>
<p>Şifreni sıfırlamak için aşağıdaki bağlantıyı kullan:</p>
<p><a href="{{ .ConfirmationURL }}">Şifremi sıfırla</a></p>
<p>Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
`.trim();

const magicLinkTemplate = `
<h2>Fizikhub giriş bağlantın</h2>
<p>Fizikhub'a giriş yapmak için aşağıdaki bağlantıyı kullan:</p>
<p><a href="{{ .ConfirmationURL }}">Giriş yap</a></p>
<p>Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
`.trim();

const payload = {
  external_email_enabled: true,
  mailer_autoconfirm: false,
  smtp_admin_email: "bildirim@fizikhub.com",
  smtp_host: "smtp.resend.com",
  smtp_port: 465,
  smtp_user: "resend",
  smtp_pass: resendApiKey,
  smtp_sender_name: "Fizikhub",
  smtp_max_frequency: 60,
  mailer_subjects_confirmation: "Fizikhub doğrulama kodun",
  mailer_templates_confirmation_content: confirmationTemplate,
  mailer_subjects_recovery: "Fizikhub şifre sıfırlama",
  mailer_templates_recovery_content: recoveryTemplate,
  mailer_subjects_magic_link: "Fizikhub giriş bağlantın",
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
