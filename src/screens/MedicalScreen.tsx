import { useState } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import './OnboardingScreen.css';

const medicalConditionOptions = [
  'Diabetic',
  'High Blood Pressure',
  'Epilepsy',
  'Asthma',
  'Heart Condition',
  'Allergies',
  'None',
];

export const MedicalScreen = () => {
  const { updateUserData, navigateToScreen, completeOnboarding } = useApp();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherCondition, setOtherCondition] = useState('');

  const toggleCondition = (condition: string) => {
    if (condition === 'None') {
      // If "None" is clicked, clear all other selections
      setSelectedConditions((prev) =>
        prev.includes('None') ? [] : ['None']
      );
      setShowOtherInput(false);
      setOtherCondition('');
    } else {
      // If any other condition is clicked, remove "None" if it was selected
      setSelectedConditions((prev) => {
        const filtered = prev.filter((c) => c !== 'None');
        return filtered.includes(condition)
          ? filtered.filter((c) => c !== condition)
          : [...filtered, condition];
      });
    }
  };

  const handleOtherToggle = () => {
    setShowOtherInput(!showOtherInput);
    if (showOtherInput) {
      setOtherCondition('');
    } else {
      // Remove "None" if user is adding "Other" condition
      setSelectedConditions((prev) => prev.filter((c) => c !== 'None'));
    }
  };

  const handleNext = () => {
    updateUserData({
      medicalConditions: selectedConditions,
      otherCondition: otherCondition.trim(),
    });
    completeOnboarding();
  };

  const handleBack = () => {
    navigateToScreen('name');
  };

  return (
    <div className="screen onboarding-screen">
      <div className="onboard-gradient onboard-gradient-purple"></div>

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
        <Orb size="md" state="idle" opacity={0.45} />
      </div>

      {/* Content */}
      <div className="onboard-content medical-content">
        <div className="glass-card onboard-card">
          <h2>
            Do you have any
            <br />
            medical conditions?
          </h2>
          <p className="sub">Gives IZWI context in case of emergencies.</p>

          <div className="chip-group">
            {medicalConditionOptions.map((condition) => (
              <button
                key={condition}
                className={`chip ${selectedConditions.includes(condition) ? 'selected' : ''}`}
                onClick={() => toggleCondition(condition)}
              >
                {condition}
              </button>
            ))}
            <button
              className={`chip ${showOtherInput ? 'selected' : ''}`}
              onClick={handleOtherToggle}
            >
              Other
            </button>
          </div>

          {showOtherInput && (
            <div className="other-input-wrap">
              <input
                className="input-field"
                type="text"
                placeholder="Describe your condition..."
                value={otherCondition}
                onChange={(e) => setOtherCondition(e.target.value)}
              />
            </div>
          )}

          <div className="action-buttons action-buttons-centered">
            <button className="btn btn-dark" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-teal" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>

      <p className="gesture-hint-text">
        Swipe right = next • Swipe left = previous • Double tap = select
      </p>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
