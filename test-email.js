async function main() {
  const dotenv = await import("dotenv");
  const { Resend } = await import("resend");
  const { buildConfirmationTemplate } = await import(
    "./scripts/auth-email-templates.mjs"
  );

  dotenv.config({ path: ".env.local" });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.TEST_EMAIL_TO || "barannnbozkurttb.b@gmail.com";
  const html = buildConfirmationTemplate("48291370");

  const result = await resend.emails.send({
    from: "FizikHub <bildirim@fizikhub.com>",
    to,
    subject: "FizikHub doğrulama kodun - tasarım testi",
    html,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log("Test email sent:", result.data?.id);
}

main().catch((error) => {
  console.error("Test email failed:", error);
  process.exitCode = 1;
});
