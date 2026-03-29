import { useState } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import './SpeakScreen.css';

const quickPhrases = [
  'Hello',
  'How are you?',
  'Thank you',
  'I need help',
  'Please wait',
  'Call someone',
];

export const SpeakScreen = () => {
  const { navigateToScreen } = useApp();
  const { speak, isSpeaking } = useSpeech();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      speak(text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const setPhrase = (phrase: string) => {
    setText(phrase);
  };

  const handleBack = () => {
    navigateToScreen('home');
  };

  return (
    <div className="screen speak-screen">
      <div className="speak-gradient"></div>

      {/* Status Bar */}
      <div className="status-bar">
        <div></div>
      </div>

      {/* Nav Bar */}
      <div className="nav-bar">
        <button className="back-btn" onClick={handleBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="nav-title">What would you like to say?</div>
        <div className="menu-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Orb Area */}
      <div className="speak-orb-area">
        <Orb size="lg" state={isSpeaking ? 'speaking' : 'idle'} />
      </div>

      {/* Bottom Section */}
      <div className="speak-bottom">
        <div className="quick-phrases-header">
          <span className="section-label">
            QUICK PHRASES <span className="section-label-sub">TYPE TO BEGIN</span>
          </span>
        </div>
        <div className="quick-phrases">
          {quickPhrases.map((phrase) => (
            <button
              key={phrase}
              className="phrase-chip"
              onClick={() => setPhrase(phrase)}
            >
              {phrase}
            </button>
          ))}
        </div>

        <div className="speak-input-row">
          <textarea
            className="speak-textarea"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#031a15"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="bottom-tabs">
        <div className="tab-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Recent</span>
        </div>
        <div className="page-dots">
          <div className="page-dot active"></div>
          <div className="page-dot"></div>
          <div className="page-dot"></div>
        </div>
        <div className="tab-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
