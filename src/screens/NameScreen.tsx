import { useState } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import './OnboardingScreen.css';

export const NameScreen = () => {
  const { userData, updateUserData, navigateToScreen } = useApp();
  const [name, setName] = useState(userData.name || '');

  const handleNext = () => {
    if (name.trim()) {
      updateUserData({ name: name.trim() });
      navigateToScreen('medical');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleNext();
    }
  };

  const handleBack = () => {
    navigateToScreen('welcome');
  };

  return (
    <div className="screen onboarding-screen">
      <div className="onboard-gradient onboard-gradient-blue"></div>

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
        <div className="menu-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Background Orb */}
      <div className="onboard-orb-bg">
        <Orb size="md" state="idle" opacity={0.5} />
      </div>

      {/* Content */}
      <div className="onboard-content">
        <div className="glass-card onboard-card">
          <h2>What is your name?</h2>
          <p className="sub">IZWI uses this to personalize your assistive voice.</p>

          <div className="input-row">
            <input
              className="input-field"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <button
              className="btn btn-teal"
              onClick={handleNext}
              disabled={!name.trim()}
            >
              Next
            </button>
          </div>

          {/* Voice shortcuts info */}
          <div className="voice-shortcuts">
            <span className="section-label">Voice-Guided Mode Shortcuts</span>
            <div className="shortcuts-list">
              <div className="gesture-item">
                <div className="gesture-icon">→</div>
                <div className="gesture-text">
                  Swipe Right for <span>Next</span>
                </div>
              </div>
              <div className="gesture-item">
                <div className="gesture-icon">←</div>
                <div className="gesture-text">
                  Swipe Left for <span>Back</span>
                </div>
              </div>
              <div className="gesture-item">
                <div className="gesture-icon">✦✦</div>
                <div className="gesture-text">
                  Double Tap to <span>Select</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
