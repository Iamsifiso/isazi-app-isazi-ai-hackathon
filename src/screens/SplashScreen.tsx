import { useEffect } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import './SplashScreen.css';

export const SplashScreen = () => {
  const { navigateToScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigateToScreen('welcome');
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigateToScreen]);

  return (
    <div className="screen splash-screen">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="splash-orb-area">
        <Orb size="lg" state="idle" />
      </div>

      <div className="splash-text">
        <h1 className="splash-appname">IZWI</h1>
        <p className="splash-tagline">Your voice. Let me speak for you.</p>
      </div>

      <div className="bottom-indicator">
        <div className="splash-dot"></div>
      </div>
    </div>
  );
};
