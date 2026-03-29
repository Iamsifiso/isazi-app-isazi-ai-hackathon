import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import './SeeScreen.css';

interface Language {
  id: string;
  name: string;
  native: string;
}

const languages: Language[] = [
  { id: 'en-ZA', name: 'English', native: 'SA' },
  { id: 'af', name: 'Afrikaans', native: 'Afr' },
  { id: 'zu', name: 'isiZulu', native: 'Zul' },
  { id: 'xh', name: 'isiXhosa', native: 'Xho' },
  { id: 'st', name: 'Sesotho', native: 'Sot' },
  { id: 'tn', name: 'Setswana', native: 'Tsn' },
  { id: 'nso', name: 'Sepedi', native: 'NSo' },
  { id: 've', name: 'Tshivenḓa', native: 'Ven' },
  { id: 'ts', name: 'Xitsonga', native: 'Tso' },
  { id: 'ss', name: 'siSwati', native: 'Ssw' },
  { id: 'nr', name: 'isiNdebele', native: 'Nbl' },
];

export const SeeScreen = () => {
  const { navigateToScreen, userData, updateUserData } = useApp();
  const [selectedLang, setSelectedLang] = useState(userData.selectedLanguage || 'en-ZA');
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleBack = () => {
    navigateToScreen('home');
  };

  const handleLanguageSelect = (langId: string) => {
    setSelectedLang(langId);
    updateUserData({ selectedLanguage: langId });
  };

  const startCamera = () => {
    setCameraActive(true);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const analyzeSurroundings = () => {
    console.log('Analyzing surroundings...');
    // This is where you would integrate Google Vision API later
  };

  return (
    <div className="screen see-screen">
      <div className="see-gradient"></div>

      {/* Status Bar */}
      <div className="status-bar">
        <div></div>
      </div>

      {/* Nav Bar */}
      <div className="nav-bar see-nav">
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
        <div className="see-title-area">
          <span className="see-title">IZWI VisionVoice</span>
          <span className="vision-mode-badge">VISION MODE</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="scroll-content">
        <div className="see-scroll">
          {/* Tagline */}
          <div className="see-tagline">"See the world, hear its story."</div>

          {/* How to use */}
          <div className="glass-card how-to-card teal-border-left">
            <p>
              <strong>How to use:</strong>
              <br />
              Tap <em>Start Camera</em> to begin, then tap <em>Record</em> to capture, then
              tap <em>Analyze</em> to get results.
            </p>
          </div>

          {/* Language Grid */}
          <div className="glass-card see-card">
            <span className="section-label">LANGUAGE SELECTION</span>
            <div className="lang-grid">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  className={`lang-tile ${selectedLang === lang.id ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.id)}
                >
                  <div className="lang-name">{lang.name}</div>
                  <div className="lang-native">{lang.native}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Camera viewfinder */}
          <div className={`camera-box ${cameraActive ? 'active' : ''}`}>
            {cameraActive ? (
              <div className="camera-active-indicator">
                <span className="camera-status-dot"></span>
                Camera Active
              </div>
            ) : (
              <>
                <div className="camera-icon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <div className="camera-label">Camera not started</div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="see-btn-row">
            <button
              className="btn btn-green see-action-btn"
              onClick={startCamera}
              disabled={cameraActive}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Start Camera
            </button>
            <button
              className={`btn btn-red see-action-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              disabled={!cameraActive}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="10" />
              </svg>
              {isRecording ? 'Stop' : 'Record'}
            </button>
          </div>

          <button
            className="btn btn-gradient analyze-btn"
            onClick={analyzeSurroundings}
            disabled={!cameraActive}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Analyze My Surroundings
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <div style={{ height: '20px' }}></div>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
