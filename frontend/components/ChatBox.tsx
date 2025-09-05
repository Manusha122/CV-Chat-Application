import React, { useState } from "react";

export default function ChatBox({ onSend }: { onSend: (q: string) => void }) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
      <input
        style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc" }}
        placeholder="Ask a question about your resume..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button onClick={submit} style={{ padding: "8px 16px", borderRadius: 8 }}>Send</button>
    </div>
  );
}
