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
<div style="margin:0;padding:0;background:#07080d;font-family:Arial,Helvetica,sans-serif;color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#07080d;background-image:radial-gradient(circle at 18% 16%,rgba(255,215,0,0.18) 0 1px,transparent 2px),radial-gradient(circle at 82% 22%,rgba(96,165,250,0.18) 0 1px,transparent 2px),radial-gradient(circle at 50% 80%,rgba(249,115,22,0.14) 0 1px,transparent 2px);padding:34px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;" align="center">
          <tr>
            <td align="center" style="padding:0 0 18px;">
              <div style="font-size:42px;line-height:1;font-weight:900;font-style:italic;color:#ffd700;letter-spacing:-1px;text-transform:none;text-shadow:3px 3px 0 #000000;">FizikHub</div>
              <div style="display:inline-block;margin-top:6px;background:#ffffff;color:#050505;border:2px solid #000000;padding:3px 10px;font-size:10px;line-height:1;font-weight:900;letter-spacing:2px;text-transform:uppercase;box-shadow:3px 3px 0 #000000;">BİLİM PLATFORMU</div>
            </td>
          </tr>
          <tr>
            <td style="background:#111111;border:4px solid #000000;border-radius:18px;box-shadow:10px 10px 0 #000000;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111111;">
                <tr>
                  <td style="padding:26px 26px 10px;">
                    <div style="display:inline-block;background:#f97316;color:#000000;border:3px solid #000000;border-radius:7px;padding:7px 12px;font-size:11px;line-height:1;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;box-shadow:4px 4px 0 #000000;">ERİŞİM DOĞRULAMASI</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 26px 0;">
                    <h1 style="margin:0;color:#ffffff;font-size:34px;line-height:1.08;font-weight:900;letter-spacing:-0.8px;">FizikHub'a hoş geldin.</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 26px 0;">
                    <p style="margin:0;color:#b8bcc8;font-size:16px;line-height:1.65;font-weight:700;">Hesabını doğrulamak için aşağıdaki kodu gir. Kısa bir güvenlik kontrolü; evrene giriş turnikesi gibi düşün.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:24px 26px 24px;">
                    <div style="background:#f1f5ff;color:#111111;border:4px solid #000000;border-radius:14px;box-shadow:7px 7px 0 #000000;padding:18px 12px;font-size:42px;line-height:1;font-weight:900;letter-spacing:8px;font-family:'Courier New',Courier,monospace;">{{ .Token }}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 26px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1c1c1f;border:2px solid #2d2d32;border-radius:12px;">
                      <tr>
                        <td style="padding:16px 18px;">
                          <p style="margin:0;color:#e5e7eb;font-size:14px;line-height:1.65;font-weight:700;">Bilim bizim için 'çok zeki insanların kapalı kutusu' değil; kafaya takılan şeyi kurcalama işi. FizikHub'da amacımız bu merakı boş yapmadan, kaynakla ve azıcık muhabbetle büyütmek. Evren zaten yeterince acayip; biz sadece ışığı biraz açıyoruz.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 26px 28px;">
                    <p style="margin:0;color:#7d8491;font-size:13px;line-height:1.55;">Bu kodu sen istemediysen maili güvenle yok sayabilirsin. Hesabına kimse giremeyecek; panik yok, fizik var.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 0 0;">
              <a href="https://www.fizikhub.com" style="color:#ffd700;font-size:12px;font-weight:800;text-decoration:none;">fizikhub.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>
`.trim();

const recoveryTemplate = `
<h2>FizikHub şifre sıfırlama</h2>
<p>Şifreni sıfırlamak için aşağıdaki bağlantıyı kullan:</p>
<p><a href="{{ .ConfirmationURL }}">Şifremi sıfırla</a></p>
<p>Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
`.trim();

const magicLinkTemplate = `
<h2>FizikHub giriş bağlantın</h2>
<p>FizikHub'a giriş yapmak için aşağıdaki bağlantıyı kullan:</p>
<p><a href="{{ .ConfirmationURL }}">Giriş yap</a></p>
<p>Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
`.trim();

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
