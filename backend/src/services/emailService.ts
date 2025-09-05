import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const hostEnv = process.env.EMAIL_HOST || process.env.SMTP_HOST || '';
const portEnv = process.env.EMAIL_PORT || process.env.SMTP_PORT || '';
const userEnv = process.env.EMAIL_USER || process.env.SMTP_USER || '';
const passEnv = process.env.EMAIL_PASS || process.env.SMTP_PASS || '';

const host = hostEnv.trim();
const port = portEnv ? parseInt(portEnv.trim(), 10) : 587;
const user = userEnv.trim();
// Gmail app passwords are shown with spaces; remove all whitespace to use them correctly
const pass = passEnv.replace(/\s+/g, '');
const fromAddress = (process.env.FROM_ADDRESS || user || "no-reply@example.com").trim();

// Check if email is properly configured
const isEmailConfigured: boolean = Boolean(host && user && pass);

if (!isEmailConfigured) {
  console.warn("📧 Email service not configured. Email sending will be disabled.");
  console.warn("To enable email, set these environment variables:");
  console.warn("  EMAIL_HOST=smtp.gmail.com");
  console.warn("  EMAIL_PORT=465");
  console.warn("  EMAIL_USER=manushamihiran1999@gmail.com");
  console.warn("  EMAIL_PASS=huma wsoj zdeq siva");
}

let transporter: nodemailer.Transporter | null = null;

if (isEmailConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    // Test connection without top-level await
    transporter.verify()
      .then(() => console.log("✅ Email service configured and ready"))
      .catch((err) => {
        console.error("❌ Email service verification failed:", err);
        transporter = null;
      });
  } catch (error) {
    console.error("❌ Email service configuration failed:", error);
    transporter = null;
  }
}

export async function sendMail(to: string, subject: string, text: string) {
  if (!isEmailConfigured || !transporter) {
    throw new Error("Email service is not configured. Please set up EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text
    });
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function isEmailServiceAvailable(): boolean {
  return Boolean(isEmailConfigured && transporter !== null);
}