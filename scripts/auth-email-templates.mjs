const siteUrl = "https://www.fizikhub.com";
const bodyBgUrl = `${siteUrl}/email/body-bg.png`;
const cardBgUrl = `${siteUrl}/email/card-bg.png`;

function renderBrandLogo() {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
      <tr>
        <td align="center" style="padding:0;">
          <div class="text-yellow" style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:40px;line-height:40px;font-weight:900;font-style:italic;letter-spacing:-2px;color:#ffd400;text-shadow:3px 3px 0 #000000,-2px -2px 0 #000000,2px -2px 0 #000000,-2px 2px 0 #000000;">FizikHub</div>
        </td>
      </tr>
      <tr>
        <td align="right" style="padding:0 16px 0 0;">
          <span class="text-yellow" style="display:inline-block;background:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;color:#ffd400;border:1px solid #5d4f08;padding:3px 8px;font-family:Inter,Arial,Helvetica,sans-serif;font-size:9px;line-height:9px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;box-shadow:2px 2px 0 #0b0b0d;transform:rotate(-3deg);">BİLİM PLATFORMU</span>
        </td>
      </tr>
    </table>
  `;
}

function renderEmailShell({ title, preheader, body }) {
  return `
<!doctype html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <style>
    :root { color-scheme: light; supported-color-schemes: light; }
    body, table, td, div, p, a, span, h1, h2 { font-family: Inter, Arial, Helvetica, sans-serif; }
    body { margin:0 !important; padding:0 !important; background:#292929 !important; color:#f5f5f5 !important; }
    a { color:#ffd400; }
    .bg-page { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    .bg-top { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    .bg-card { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
    .bg-panel { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
    .bg-code { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    .bg-yellow { background-color:#ffd400 !important; background-image:linear-gradient(#ffd400,#ffd400) !important; }
    .text-white { color:#f8f8f8 !important; -webkit-text-fill-color:#f8f8f8 !important; }
    .text-soft { color:#b9bac4 !important; -webkit-text-fill-color:#b9bac4 !important; }
    .text-muted { color:#848791 !important; -webkit-text-fill-color:#848791 !important; }
    .text-black { color:#060606 !important; -webkit-text-fill-color:#060606 !important; }
    .text-yellow { color:#ffd400 !important; -webkit-text-fill-color:#ffd400 !important; }
    u + .body .bg-page, [data-ogsc] .bg-page { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    u + .body .bg-top, [data-ogsc] .bg-top { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    u + .body .bg-card, [data-ogsc] .bg-card { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
    u + .body .bg-panel, [data-ogsc] .bg-panel { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
    u + .body .bg-code, [data-ogsc] .bg-code { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
    u + .body .bg-yellow, [data-ogsc] .bg-yellow { background-color:#ffd400 !important; background-image:linear-gradient(#ffd400,#ffd400) !important; }
    u + .body .text-white, [data-ogsc] .text-white { background-image:linear-gradient(#f8f8f8,#f8f8f8) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    u + .body .text-soft, [data-ogsc] .text-soft { background-image:linear-gradient(#b9bac4,#b9bac4) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    u + .body .text-muted, [data-ogsc] .text-muted { background-image:linear-gradient(#848791,#848791) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    u + .body .text-black, [data-ogsc] .text-black { background-image:linear-gradient(#060606,#060606) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    u + .body .text-yellow, [data-ogsc] .text-yellow { background-image:linear-gradient(#ffd400,#ffd400) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    @media (prefers-color-scheme: light) {
      body, .bg-page { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; color:#f5f5f5 !important; }
      .bg-top { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
      .bg-card { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
      .bg-panel { background-color:#1a1a1a !important; background-image:url('${cardBgUrl}') !important; background-repeat:repeat !important; }
      .bg-code { background-color:#111111 !important; background-image:url('${bodyBgUrl}') !important; background-repeat:repeat !important; }
      .text-white { background-image:linear-gradient(#f8f8f8,#f8f8f8) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
      .text-soft { background-image:linear-gradient(#b9bac4,#b9bac4) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
      .text-muted { background-image:linear-gradient(#848791,#848791) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
      .text-black { background-image:linear-gradient(#060606,#060606) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
      .text-yellow { background-image:linear-gradient(#ffd400,#ffd400) !important; -webkit-background-clip:text !important; background-clip:text !important; color:transparent !important; -webkit-text-fill-color:transparent !important; }
    }
    @media screen and (max-width: 520px) {
      .outer-pad { padding:14px 8px !important; }
      .card-pad { padding-left:18px !important; padding-right:18px !important; }
      .headline { font-size:32px !important; line-height:35px !important; }
      .lead { font-size:15px !important; line-height:24px !important; }
      .code { font-size:36px !important; letter-spacing:6px !important; }
    }
  </style>
</head>
<body class="body bg-page" style="margin:0;padding:0;background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;color:#f5f5f5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg-page" background="${bodyBgUrl}" style="background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;">
    <tr>
      <td align="center" class="outer-pad bg-page" background="${bodyBgUrl}" style="padding:22px 12px;background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px;margin:0 auto;">
          <tr>
            <td class="bg-top" background="${bodyBgUrl}" style="background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;border:1px solid #2a2a2f;border-bottom:0;border-radius:8px 8px 0 0;padding:14px 16px 10px;box-shadow:5px 5px 0 #0b0b0d;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding:0 0 8px;">
                    ${renderBrandLogo()}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0;">
                    <div class="text-muted" style="font-family:'Courier New',Courier,monospace;font-size:11px;line-height:16px;color:#777b86;letter-spacing:1px;white-space:normal;">
                      E = mc² &nbsp; F = ma &nbsp; ΔS ≥ 0 &nbsp; λ = h/p
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${body}
          <tr>
            <td align="center" class="bg-page" background="${bodyBgUrl}" style="padding:20px 0 0;background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;">
              <a href="${siteUrl}" class="text-yellow" style="font-size:12px;line-height:18px;font-weight:900;color:#ffd400;text-decoration:none;">fizikhub.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function buildConfirmationTemplate(token = "{{ .Token }}") {
  const body = `
    <tr>
      <td class="bg-card" background="${cardBgUrl}" style="background-color:#1a1a1a;background-image:url('${cardBgUrl}');background-repeat:repeat;border:1px solid #2a2a2f;border-radius:0 0 8px 8px;box-shadow:5px 5px 0 #0b0b0d;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg-card" background="${cardBgUrl}" style="background-color:#1a1a1a;background-image:url('${cardBgUrl}');background-repeat:repeat;border-radius:0 0 8px 8px;">
          <tr>
            <td class="card-pad" style="padding:18px 24px 0;">
              <span class="text-yellow" style="display:inline-block;background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;color:#ffd400;border:1px solid #5d4f08;border-radius:5px;padding:7px 11px;font-size:10px;line-height:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;box-shadow:3px 3px 0 #0b0b0d;">ERİŞİM DOĞRULAMASI</span>
            </td>
          </tr>
          <tr>
            <td class="card-pad" style="padding:16px 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="5" style="width:5px;background-color:#ffd400;background-image:linear-gradient(#ffd400,#ffd400);border-radius:4px;"></td>
                  <td style="padding-left:14px;">
                    <h1 class="headline text-white" style="margin:0;color:#f8f8f8;font-size:36px;line-height:38px;font-weight:900;letter-spacing:0;">FizikHub'a hoş geldin.</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="card-pad" style="padding:12px 24px 0;">
              <p class="lead text-soft" style="margin:0;color:#b9bac4;font-size:15px;line-height:24px;font-weight:800;">Hesabını doğrulamak için kodu gir. Küçük bir kapı kontrolü, hepsi bu.</p>
            </td>
          </tr>
          <tr>
            <td align="center" class="card-pad" style="padding:20px 24px 18px;">
              <div class="code bg-code text-yellow" style="background-color:#111111;background-image:url('${bodyBgUrl}');background-repeat:repeat;color:#ffd400;border:1px solid #3a3320;border-radius:8px;box-shadow:5px 5px 0 #0b0b0d;padding:14px 10px;font-family:'Courier New',Courier,monospace;font-size:42px;line-height:46px;font-weight:900;letter-spacing:9px;text-align:center;">${token}</div>
            </td>
          </tr>
          <tr>
            <td class="card-pad" style="padding:0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="bg-panel" background="${cardBgUrl}" style="background-color:#1a1a1a;background-image:url('${cardBgUrl}');background-repeat:repeat;border:1px solid #33333a;border-radius:8px;">
                <tr>
                  <td width="4" style="width:4px;background-color:#ffd400;background-image:linear-gradient(#ffd400,#ffd400);border-radius:8px 0 0 8px;"></td>
                  <td style="padding:13px 15px;">
                    <p class="text-white" style="margin:0;color:#f8f8f8;font-size:13px;line-height:21px;font-weight:800;">FizikHub'da derdimiz basit: merakı ciddiye almak. Sorunu getir, beraber kurcalarız; boş gaz az, anlaşılır fizik çok.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="card-pad" style="padding:16px 24px 22px;">
              <p class="text-muted" style="margin:0;color:#848791;font-size:12px;line-height:19px;font-weight:700;">Bu kodu sen istemediysen maili yok say. Hesabın güvende.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return renderEmailShell({
    title: "FizikHub doğrulama kodun",
    preheader: "FizikHub hesabını doğrulamak için kodun hazır.",
    body,
  });
}

export const confirmationTemplate = buildConfirmationTemplate();

export const recoveryTemplate = renderEmailShell({
  title: "FizikHub şifre sıfırlama",
  preheader: "FizikHub şifreni sıfırlamak için bağlantın hazır.",
  body: `
    <tr>
      <td class="bg-card" style="background-color:#171719;background-image:linear-gradient(#171719,#171719);border:3px solid #000000;border-radius:0 0 8px 8px;box-shadow:7px 7px 0 #000000;padding:28px;">
        <h1 class="text-white" style="margin:0 0 14px;color:#f8f8f8;font-size:32px;line-height:36px;font-weight:900;">Şifreyi toparlayalım.</h1>
        <p class="text-soft" style="margin:0 0 22px;color:#b9bac4;font-size:16px;line-height:26px;font-weight:700;">FizikHub şifreni sıfırlamak için aşağıdaki bağlantıyı kullan.</p>
        <a href="{{ .ConfirmationURL }}" class="text-yellow" style="display:inline-block;background-color:#09090b;background-image:linear-gradient(#09090b,#09090b);color:#ffd400;border:3px solid #ffd400;border-radius:5px;padding:13px 18px;font-size:13px;line-height:13px;font-weight:900;letter-spacing:1px;text-transform:uppercase;text-decoration:none;box-shadow:4px 4px 0 #000000;">ŞİFREMİ SIFIRLA</a>
        <p class="text-muted" style="margin:24px 0 0;color:#848791;font-size:13px;line-height:21px;font-weight:700;">Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
      </td>
    </tr>
  `,
});

export const magicLinkTemplate = renderEmailShell({
  title: "FizikHub giriş bağlantın",
  preheader: "FizikHub'a giriş bağlantın hazır.",
  body: `
    <tr>
      <td class="bg-card" style="background-color:#171719;background-image:linear-gradient(#171719,#171719);border:3px solid #000000;border-radius:0 0 8px 8px;box-shadow:7px 7px 0 #000000;padding:28px;">
        <h1 class="text-white" style="margin:0 0 14px;color:#f8f8f8;font-size:32px;line-height:36px;font-weight:900;">Giriş kapısı açık.</h1>
        <p class="text-soft" style="margin:0 0 22px;color:#b9bac4;font-size:16px;line-height:26px;font-weight:700;">FizikHub'a giriş yapmak için aşağıdaki bağlantıyı kullan.</p>
        <a href="{{ .ConfirmationURL }}" class="text-yellow" style="display:inline-block;background-color:#09090b;background-image:linear-gradient(#09090b,#09090b);color:#ffd400;border:3px solid #ffd400;border-radius:5px;padding:13px 18px;font-size:13px;line-height:13px;font-weight:900;letter-spacing:1px;text-transform:uppercase;text-decoration:none;box-shadow:4px 4px 0 #000000;">GİRİŞ YAP</a>
        <p class="text-muted" style="margin:24px 0 0;color:#848791;font-size:13px;line-height:21px;font-weight:700;">Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
      </td>
    </tr>
  `,
});
