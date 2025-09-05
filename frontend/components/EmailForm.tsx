import React, { useState, useEffect } from "react";
import { sendEmail } from "../lib/api";

export default function EmailForm() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Test email configuration on component mount
    testEmailConfiguration();
  }, []);

  async function testEmailConfiguration() {
    try {
      // Try to send a test email to check configuration
      const res = await sendEmail("test@example.com", "Test", "Test");
      setIsConfigured(res.configured !== false);
    } catch (err: any) {
      // If we get a 503 error, email is not configured
      if (err.message.includes("503") || err.message.includes("not configured")) {
        setIsConfigured(false);
      } else {
        setIsConfigured(true); // Other errors mean it's configured but failed
      }
    }
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    
    if (isConfigured === false) {
      setStatus("❌ Email service is not configured. Please set up EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.");
      return;
    }
    
    setStatus("Sending...");
    try {
      const res = await sendEmail(recipient, subject, body);
      if (res.error) {
        setStatus("❌ Error: " + res.error);
      } else {
        setStatus("✅ Email sent successfully!");
        // Clear form on success
        setRecipient("");
        setSubject("");
        setBody("");
      }
    } catch (err: any) {
      setStatus("❌ Failed: " + (err.message || err));
    }
  }

  return (
    <div>
      {isConfigured === false && (
        <div style={{ 
          padding: "12px", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffeaa7", 
          borderRadius: "8px", 
          marginBottom: "16px",
          color: "#856404"
        }}>
          <strong>⚠️ Email Service Not Configured</strong>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
            To enable email functionality, configure these environment variables in your backend:
          </p>
          <ul style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
            <li>EMAIL_HOST (e.g., smtp.gmail.com)</li>
            <li>EMAIL_PORT (e.g., 587)</li>
            <li>EMAIL_USER (your email address)</li>
            <li>EMAIL_PASS (your app password)</li>
          </ul>
        </div>
      )}
      
      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input 
          value={recipient} 
          onChange={(e) => setRecipient(e.target.value)} 
          placeholder="Recipient email" 
          disabled={isConfigured === false}
        />
        <input 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="Subject" 
          disabled={isConfigured === false}
        />
        <textarea 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          placeholder="Body" 
          rows={6} 
          disabled={isConfigured === false}
        />
        <div>
          <button 
            type="submit" 
            style={{ 
              padding: "8px 12px",
              backgroundColor: isConfigured === false ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isConfigured === false ? "not-allowed" : "pointer"
            }}
            disabled={isConfigured === false}
          >
            {isConfigured === false ? "Email Not Configured" : "Send Email"}
          </button>
        </div>
        {status && (
          <div style={{ 
            marginTop: 8, 
            padding: "8px 12px",
            backgroundColor: status.includes("✅") ? "#d4edda" : status.includes("❌") ? "#f8d7da" : "#d1ecf1",
            border: `1px solid ${status.includes("✅") ? "#c3e6cb" : status.includes("❌") ? "#f5c6cb" : "#bee5eb"}`,
            borderRadius: "4px",
            color: status.includes("✅") ? "#155724" : status.includes("❌") ? "#721c24" : "#0c5460"
          }}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
