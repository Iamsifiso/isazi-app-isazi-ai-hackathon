import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import './HomeScreen.css';

export const HomeScreen = () => {
  const { userData, navigateToScreen } = useApp();
  const displayName = userData.name || 'there';

  return (
    <div className="screen home-screen">
      <div className="bg-glow-home"></div>

      {/* Status Bar */}
      <div className="status-bar">
        <div></div>
      </div>

      {/* Header */}
      <div className="home-header">
        <h1>Hi {displayName}, how can I help you today?</h1>
        <div className="home-header-icons">
          <button title="Notifications">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button title="Settings">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="assistant-label">
        <span className="section-label">ASSISTANT ACTIVE</span>
        <div className="assistant-subtitle">Choose your interaction</div>
      </div>

      {/* Main Cards */}
      <div className="home-cards-area">
        <button
          className="home-card home-card-speak"
          onClick={() => navigateToScreen('speak')}
        >
          <div className="home-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="home-card-title">I need to speak</div>
            <div className="home-card-sub">Voice conversion</div>
          </div>
        </button>

        <button
          className="home-card home-card-see"
          onClick={() => navigateToScreen('see')}
        >
          <div className="home-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <div className="home-card-title">I need to see</div>
            <div className="home-card-sub">AI Scene Analysis</div>
          </div>
        </button>

        <button
          className="home-card home-card-sign"
          onClick={() => navigateToScreen('sign')}
        >
          <div className="home-card-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div>
            <div className="home-card-title">Help me sign</div>
            <div className="home-card-sub">SASL Animations</div>
          </div>
        </button>
      </div>

      {/* Bottom Area */}
      <div className="home-bottom-area">
        <div className="banner">
          <div className="banner-dot"></div>
          <span className="banner-text">VisionVoice 2.0 is now active</span>
          <span className="banner-link">Learn More</span>
        </div>

        <div className="listening-area">
          <Orb size="sm" state="idle" opacity={0.5} />
          <span className="section-label listening-label">LISTENING FOR GESTURES</span>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
