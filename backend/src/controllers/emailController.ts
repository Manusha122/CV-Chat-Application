import { Request, Response } from "express";
import { sendMail, isEmailServiceAvailable } from "../services/emailService";

export async function sendEmail(req: Request, res: Response) {
  const { recipient, subject, body } = req.body;
  
  if (!recipient || !subject || !body) {
    return res.status(400).json({ error: "recipient, subject and body are required." });
  }

  // Check if email service is available
  if (!isEmailServiceAvailable()) {
    return res.status(503).json({ 
      error: "Email service is not configured. Please set up EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.",
      configured: false
    });
  }

  try {
    const info = await sendMail(recipient, subject, body);
    res.json({ 
      message: "Email sent successfully", 
      info,
      configured: true
    });
  } catch (err: any) {
    console.error("Email sending error:", err);
    res.status(500).json({ 
      error: err.message || "Failed to send email",
      configured: true
    });
  }
}
