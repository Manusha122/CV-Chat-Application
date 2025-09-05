"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const emailService_1 = require("../services/emailService");
async function sendEmail(req, res) {
    const { recipient, subject, body } = req.body;
    if (!recipient || !subject || !body) {
        return res.status(400).json({ error: "recipient, subject and body are required." });
    }
    // Check if email service is available
    if (!(0, emailService_1.isEmailServiceAvailable)()) {
        return res.status(503).json({
            error: "Email service is not configured. Please set up EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.",
            configured: false
        });
    }
    try {
        const info = await (0, emailService_1.sendMail)(recipient, subject, body);
        res.json({
            message: "Email sent successfully",
            info,
            configured: true
        });
    }
    catch (err) {
        console.error("Email sending error:", err);
        res.status(500).json({
            error: err.message || "Failed to send email",
            configured: true
        });
    }
}
