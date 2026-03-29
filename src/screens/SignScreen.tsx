import { useState } from 'react';
import Lottie from 'lottie-react';
import { useApp } from '../contexts/AppContext';
import './SignScreen.css';

interface SignPhrase {
  id: string;
  text: string;
  animationData: any; // Lottie JSON animation data
}

// Placeholder - Replace these imports with actual Lottie JSON files
// Import your Lottie animations here like:
// import helloAnimation from '../assets/animations/hello.json';
// import myNameIsAnimation from '../assets/animations/my-name-is.json';

const signPhrases: SignPhrase[] = [
  {
    id: 'hello',
    text: 'Hello',
    animationData: null, // Replace with: helloAnimation
  },
  {
    id: 'my-name-is',
    text: 'My name is',
    animationData: null, // Replace with: myNameIsAnimation
  },
  {
    id: 'yes',
    text: 'Yes',
    animationData: null, // Replace with: yesAnimation
  },
  {
    id: 'no',
    text: 'No',
    animationData: null, // Replace with: noAnimation
  },
  {
    id: 'thank-you',
    text: 'Thank you',
    animationData: null, // Replace with: thankYouAnimation
  },
  {
    id: 'please',
    text: 'Please',
    animationData: null, // Replace with: pleaseAnimation
  },
];

export const SignScreen = () => {
  const { navigateToScreen } = useApp();
  const [selectedPhrase, setSelectedPhrase] = useState<SignPhrase | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePhraseSelect = (phrase: SignPhrase) => {
    setSelectedPhrase(phrase);
    setIsPlaying(true);
  };

  const handleBack = () => {
    navigateToScreen('home');
  };

  const handleReplay = () => {
    if (selectedPhrase) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  return (
    <div className="screen sign-screen">
      <div className="sign-gradient"></div>

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
        <div className="nav-title">South African Sign Language</div>
        <div className="menu-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Animation Display Area */}
      <div className="sign-animation-area">
        {selectedPhrase && selectedPhrase.animationData ? (
          <div className="animation-container">
            <Lottie
              animationData={selectedPhrase.animationData}
              loop={false}
              autoplay={isPlaying}
              style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
            />
            <div className="phrase-label">{selectedPhrase.text}</div>
            <button className="replay-btn" onClick={handleReplay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <p>Select a phrase to see the sign</p>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="sign-bottom">
        <div className="phrases-header">
          <span className="section-label">AVAILABLE PHRASES</span>
        </div>
        <div className="sign-phrases">
          {signPhrases.map((phrase) => (
            <button
              key={phrase.id}
              className={`phrase-card ${selectedPhrase?.id === phrase.id ? 'active' : ''}`}
              onClick={() => handlePhraseSelect(phrase)}
              disabled={!phrase.animationData}
            >
              <div className="phrase-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <div className="phrase-text">{phrase.text}</div>
              {!phrase.animationData && (
                <div className="coming-soon">Animation needed</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
