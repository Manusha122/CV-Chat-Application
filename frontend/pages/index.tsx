import React, { useState, useEffect } from "react";
import Link from "next/link";
import ChatBox from "../components/ChatBox";
import MessageList from "../components/MessageList";
import { uploadCV, askQuestion, testConnection } from "../lib/api";

const HomePage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    setMounted(true);
    
    // Test backend connection on mount
    testConnection()
      .then(() => {
        setBackendStatus('connected');
        console.log('✅ Backend connection successful');
      })
      .catch((error) => {
        setBackendStatus('disconnected');
        console.error('❌ Backend connection failed:', error);
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: "⚠️ Backend server is not running. Please start the backend server on port 4000." 
        }]);
      });
  }, []);

  async function handleUpload(file?: File) {
    if (!file) return;
    
    if (backendStatus !== 'connected') {
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "❌ Cannot upload file. Backend server is not connected. Please start the backend server first." 
      }]);
      return;
    }
    
    setUploading(true);
    try {
      const res = await uploadCV(file);
      if (res.sessionId) {
        setSessionId(res.sessionId);
        const summary = res.summary ? `\n\nExtracted: ${res.summary}` : '';
        setMessages(prev => [...prev, { 
          from: "bot", 
          text: `✅ CV uploaded and parsed successfully!${summary}\n\nYou can now ask questions about the resume. The system will provide intelligent answers using advanced resume analysis.` 
        }]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: "❌ Upload failed. Please try again." }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { from: "bot", text: "❌ Upload error: " + (e.message || e) }]);
    } finally {
      setUploading(false);
    }
  }

  async function handleQuestion(question: string) {
    if (backendStatus !== 'connected') {
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: "❌ Cannot ask questions. Backend server is not connected. Please start the backend server first." 
      }]);
      return;
    }
    
    if (!sessionId) {
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Please upload your CV first to start asking questions." }]);
      return;
    }
    setMessages(prev => [...prev, { from: "user", text: question }]);
    try {
      const res = await askQuestion(sessionId, question);
      const confidence = res.confidence ? ` (Confidence: ${Math.round(res.confidence * 100)}%)` : '';
      setMessages(prev => [...prev, { 
        from: "bot", 
        text: `${res.answer}${confidence}` 
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { from: "bot", text: "❌ Error: " + (e.message || e) }]);
    }
  }

  return (
    <>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="main-container">
        <div className={`glass-card ${mounted ? 'mounted' : ''}`}>
          <div className="header">
            <div className="header-top">
              <h1 className="title">Chat Playground</h1>
              <Link href="/email" className="email-nav-button">
                <svg className="email-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Send Email
              </Link>
            </div>
            <p className="subtitle">
              Upload your CV (PDF, DOCX, or TXT) and start an intelligent conversation about your experience
            </p>
            <div className="status-indicators">
              <div className={`backend-status ${backendStatus}`}>
                <div className="status-dot"></div>
                Backend: {backendStatus === 'checking' ? 'Checking...' : 
                         backendStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
              {sessionId && (
                <div className="session-indicator session-active">
                  <div className="status-dot"></div>
                  Session Active
                </div>
              )}
              {!sessionId && backendStatus === 'connected' && (
                <div className="session-indicator session-inactive">
                  <div className="status-dot"></div>
                  No Session
                </div>
              )}
            </div>
          </div>

          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                id="file"
                type="file"
                accept=".pdf,.txt,.docx"
                className="file-input"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
                disabled={uploading || backendStatus !== 'connected'}
              />
              <button className="file-button" disabled={uploading || backendStatus !== 'connected'}>
                <svg className="upload-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                {uploading ? 'Uploading...' : 
                 backendStatus !== 'connected' ? 'Backend Disconnected' : 'Choose File'}
              </button>
            </div>
            {uploading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
                Processing your CV...
              </div>
            )}
          </div>

          <div className="content-section">
            <MessageList messages={messages} />
            {sessionId && messages.length <= 1 && (
              <div className="suggested-questions">
                <p className="suggestions-title">💡 Try asking:</p>
                <div className="suggestion-buttons">
                  {[
                    "What skills does this person have?",
                    "Tell me about their work experience",
                    "What is their educational background?",
                    "What is their contact information?",
                    "How many years of experience do they have?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-button"
                      onClick={() => handleQuestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <ChatBox onSend={handleQuestion} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;