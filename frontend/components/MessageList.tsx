import React from "react";

export default function MessageList({ messages }: { messages: { from: "user" | "bot"; text: string }[] }) {
  return (
    <div className="message-list">
      {messages.length === 0 && <div className="no-messages">No messages yet — upload a CV and ask something.</div>}
      {messages.map((m, i) => (
        <div key={i} className={`message-container ${m.from === "user" ? "user-message" : "bot-message"}`}>
          <div className={`message-bubble ${m.from === "user" ? "user-bubble" : "bot-bubble"}`}>
            <div className="message-text">{m.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
