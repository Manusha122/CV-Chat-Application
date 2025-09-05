
import React, { useState, useEffect } from "react";
import Link from "next/link";
import EmailForm from "../components/EmailForm";

const EmailPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }
        
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.4;
          animation: float 15s infinite ease-in-out;
          filter: blur(1px);
        }
        
        .orb-1 {
          top: 10%;
          left: 20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, #ff6b6b, #ee5a52);
          animation-delay: 0s;
          animation-duration: 20s;
        }
        
        .orb-2 {
          top: 60%;
          right: 10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #4ecdc4, #26d0ce);
          animation-delay: -7s;
          animation-duration: 25s;
        }
        
        .orb-3 {
          bottom: 20%;
          left: 10%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, #ffe66d, #ffcc02);
          animation-delay: -14s;
          animation-duration: 18s;
        }
        
        .orb-4 {
          top: 30%;
          right: 30%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, #a8e6cf, #7fcdcd);
          animation-delay: -3s;
          animation-duration: 22s;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-30px) translateX(20px) scale(1.1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(0px) translateX(-20px) scale(0.9);
            opacity: 0.3;
          }
          75% { 
            transform: translateY(20px) translateX(30px) scale(1.05);
            opacity: 0.5;
          }
        }
        
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 10s infinite linear;
        }
        
        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 20%; animation-delay: -2s; }
        .particle:nth-child(3) { left: 30%; animation-delay: -4s; }
        .particle:nth-child(4) { left: 40%; animation-delay: -1s; }
        .particle:nth-child(5) { left: 50%; animation-delay: -3s; }
        .particle:nth-child(6) { left: 60%; animation-delay: -5s; }
        .particle:nth-child(7) { left: 70%; animation-delay: -2.5s; }
        .particle:nth-child(8) { left: 80%; animation-delay: -4.5s; }
        .particle:nth-child(9) { left: 90%; animation-delay: -1.5s; }
        
        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .main-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .email-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          width: 100%;
          max-width: 600px;
          position: relative;
          overflow: hidden;
          animation: cardAppear 1s ease-out forwards;
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        
        .email-card.mounted {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .email-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes cardAppear {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .header-section {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .header-top {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 2rem;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          color: white;
          text-decoration: none;
        }
        
        .back-button .back-icon {
          width: 18px;
          height: 18px;
        }
        
        .email-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          animation: iconBounce 2s ease-in-out infinite;
        }
        
        @keyframes iconBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) rotate(0deg); }
          40% { transform: translateY(-10px) rotate(5deg); }
          60% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        .email-icon {
          width: 40px;
          height: 40px;
          color: white;
        }
        
        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #e6f3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
          position: relative;
        }
        
        .main-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
          animation: lineGrow 1s ease-out 0.5s forwards;
          transform-origin: center;
          scale: 0 1;
        }
        
        @keyframes lineGrow {
          to { scale: 1 1; }
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          font-weight: 400;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .form-container {
          position: relative;
        }
        
        .form-wrapper {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .form-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: rotate 8s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .form-wrapper:hover::before {
          opacity: 1;
        }
        
        @keyframes rotate {
          to { transform: rotate(360deg); }
        }
        
        .form-inner {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }
        
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: -1;
        }
        
        .floating-element {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: floatAround 12s infinite ease-in-out;
        }
        
        .float-1 {
          top: 10%;
          left: 5%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }
        
        .float-2 {
          top: 20%;
          right: 10%;
          width: 15px;
          height: 15px;
          animation-delay: -3s;
        }
        
        .float-3 {
          bottom: 15%;
          left: 15%;
          width: 25px;
          height: 25px;
          animation-delay: -6s;
        }
        
        .float-4 {
          bottom: 25%;
          right: 5%;
          width: 18px;
          height: 18px;
          animation-delay: -9s;
        }
        
        @keyframes floatAround {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.5;
          }
          25% { 
            transform: translateY(-20px) translateX(15px);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(0px) translateX(-10px);
            opacity: 0.3;
          }
          75% { 
            transform: translateY(15px) translateX(20px);
            opacity: 0.6;
          }
        }
        
        @media (max-width: 768px) {
          .main-container {
            padding: 1rem;
          }
          
          .email-card {
            padding: 2rem;
            margin: 1rem;
          }
          
          .header-top {
            justify-content: center;
            margin-bottom: 1.5rem;
          }
          
          .back-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
          }
          
          .main-title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .email-icon-wrapper {
            width: 60px;
            height: 60px;
          }
          
          .email-icon {
            width: 30px;
            height: 30px;
          }
          
          .form-inner {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .email-card {
            padding: 1.5rem;
          }
          
          .main-title {
            font-size: 1.75rem;
          }
          
          .form-inner {
            padding: 1rem;
          }
        }
      `}</style>
      )}
      
      {mounted && (
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
      )}
      
      {mounted && (
      <div className="main-container">
        <div className={`email-card ${mounted ? 'mounted' : ''}`}>
          <div className="floating-elements">
            <div className="floating-element float-1"></div>
            <div className="floating-element float-2"></div>
            <div className="floating-element float-3"></div>
            <div className="floating-element float-4"></div>
          </div>
          
          <div className="header-section">
            <div className="header-top">
              <Link href="/" className="back-button">
                <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Chat
              </Link>
            </div>
            
            <div className="email-icon-wrapper">
              <svg className="email-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            <h1 className="main-title">Send Email</h1>
            
          </div>
          
          <div className="form-container">
            <div className="form-wrapper">
              <div className="form-inner">
                <EmailForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default EmailPage;