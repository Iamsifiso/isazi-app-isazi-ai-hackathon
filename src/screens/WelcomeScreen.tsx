import { useEffect, useRef } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { useGestures } from '../hooks/useGestures';
import './WelcomeScreen.css';

export const WelcomeScreen = () => {
  const { navigateToScreen, setNavigationMode } = useApp();
  const { speak, isSpeaking } = useSpeech();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Welcome. Swipe right for voice-guided mode. Swipe left for visual mode.');
    }, 500);

    return () => clearTimeout(timer);
  }, [speak]);

  const handleSwipeLeft = () => {
    setNavigationMode('visual');
    navigateToScreen('name');
  };

  const handleSwipeRight = () => {
    setNavigationMode('voice');
    navigateToScreen('name');
  };

  useGestures(containerRef, {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 40,
  });

  return (
    <div className="screen welcome-screen" ref={containerRef}>
      <div className="welcome-gradient"></div>

      {/* Swipe hints */}
      <div className="swipe-hint swipe-hint-left">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="swipe-label">VISUAL</span>
      </div>
      <div className="swipe-hint swipe-hint-right">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="swipe-label">VOICE</span>
      </div>

      <div className="welcome-orb-area">
        <Orb size="lg" state={isSpeaking ? 'speaking' : 'idle'} />
      </div>

      <div className="welcome-text">
        <h2>Welcome.</h2>
        <p>
          Swipe <strong>right</strong> for voice-guided mode.
          <br />
          Swipe <strong>left</strong> for visual mode.
        </p>
      </div>

      <div className="page-dots">
        <div className="page-dot"></div>
        <div className="page-dot active"></div>
        <div className="page-dot"></div>
      </div>

      <div className="select-mode-label">SELECT INTERACTION MODE</div>
      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
