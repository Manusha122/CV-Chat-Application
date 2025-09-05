const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  return response.json();
}

// Test connection to backend
export async function testConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
}

export async function uploadCV(file: File) {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/chat/upload`, {
      method: "POST",
      body: fd
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Upload CV error:', error);
    throw error;
  }
}

export async function askQuestion(sessionId: string, question: string) {
  try {
    const res = await fetch(`${API_BASE}/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, question })
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Ask question error:', error);
    throw error;
  }
}

export async function sendEmail(recipient: string, subject: string, body: string) {
  try {
    const res = await fetch(`${API_BASE}/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, subject, body })
    });
    return await handleResponse(res);
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
}
