import { useApp } from '../contexts/AppContext';
import './AboutScreen.css';

export const AboutScreen = () => {
  const { navigateToScreen } = useApp();

  return (
    <div className="screen about-screen">
      <div className="about-gradient"></div>

      {/* Status Bar */}
      <div className="status-bar">
        <div></div>
      </div>

      {/* Nav Bar */}
      <div className="nav-bar">
        <button className="back-btn" onClick={() => navigateToScreen('home')}>
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
      </div>

      {/* Content */}
      <div className="about-content">
        <div className="about-header">
          <h1 className="about-title">IZWI</h1>
          <p className="about-tagline">Your voice. Let me speak for you.</p>
          <div className="about-version">Version 3.0 • VisionVoice Enabled</div>
        </div>

        <div className="about-sections">
          {/* What is IZWI */}
          <section className="about-section">
            <h2>What is IZWI?</h2>
            <p>
              IZWI is a comprehensive accessibility assistant designed specifically for blind,
              visually impaired, and speech-impaired individuals in South Africa. The name
              "IZWI" means "voice" in isiZulu, reflecting our mission to give everyone a voice
              and help them see the world around them.
            </p>
          </section>

          {/* Features */}
          <section className="about-section">
            <h2>Core Features</h2>

            <div className="feature-item">
              <div className="feature-icon feature-icon-speak">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>I Need to Speak</h3>
                <p>
                  Convert text to natural speech in English, Afrikaans, or isiZulu. Save
                  favorite phrases, organize by category, and access emergency messages instantly.
                  Perfect for individuals who cannot speak or have speech difficulties.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon feature-icon-see">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>I Need to See</h3>
                <p>
                  AI-powered scene analysis using advanced computer vision. Point your camera
                  at your surroundings and IZWI will describe what it sees, read menus, identify
                  products, warn about hazards, and help you navigate your environment safely.
                  Supports multiple languages.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon feature-icon-sign">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Help Me Sign</h3>
                <p>
                  Learn and communicate using South African Sign Language (SASL). Watch animated
                  demonstrations of common phrases and greetings. Perfect for learning basic sign
                  language or communicating with the deaf community.
                </p>
              </div>
            </div>
          </section>

          {/* Language Support */}
          <section className="about-section">
            <h2>Multi-Language Support</h2>
            <p>
              IZWI supports three South African languages with high-quality text-to-speech:
            </p>
            <ul className="language-list">
              <li>
                <strong>English (South African)</strong> - Native Web Speech API
              </li>
              <li>
                <strong>Afrikaans</strong> - Google Cloud Text-to-Speech with af-ZA-Standard-A voice
              </li>
              <li>
                <strong>isiZulu</strong> - Google Cloud Text-to-Speech with zu-ZA-Standard-A voice
              </li>
            </ul>
          </section>

          {/* Technology */}
          <section className="about-section">
            <h2>Powered by AI</h2>
            <p>
              IZWI uses cutting-edge artificial intelligence technology:
            </p>
            <ul className="tech-list">
              <li>
                <strong>Claude Sonnet 4</strong> by Anthropic for advanced vision analysis
                and context-aware scene understanding
              </li>
              <li>
                <strong>Google Cloud TTS</strong> for natural, human-like speech synthesis
                in Afrikaans and isiZulu
              </li>
              <li>
                <strong>Web Speech API</strong> for real-time speech recognition and synthesis
              </li>
              <li>
                <strong>Progressive Web App</strong> technology for offline capability and
                app-like experience
              </li>
            </ul>
          </section>

          {/* Privacy & Safety */}
          <section className="about-section">
            <h2>Privacy & Safety</h2>
            <p>
              Your privacy is our priority. IZWI:
            </p>
            <ul className="privacy-list">
              <li>Stores all personal data locally on your device</li>
              <li>Does not collect or sell your information</li>
              <li>Processes images temporarily for analysis only</li>
              <li>Includes emergency contact features for safety</li>
              <li>Prioritizes hazard warnings in scene descriptions</li>
            </ul>
          </section>

          {/* How to Use */}
          <section className="about-section">
            <h2>Getting Started</h2>
            <ol className="steps-list">
              <li>
                <strong>Choose your mode:</strong> Select "I need to speak" for voice conversion,
                "I need to see" for vision assistance, or "Help me sign" for SASL animations.
              </li>
              <li>
                <strong>Select your language:</strong> Switch between English, Afrikaans, and
                isiZulu at any time.
              </li>
              <li>
                <strong>Personalize:</strong> Add custom phrases, create categories, and save
                your emergency WhatsApp contact.
              </li>
              <li>
                <strong>Use gestures:</strong> Swipe right for next, swipe left for back,
                double-tap to select.
              </li>
            </ol>
          </section>

          {/* Contact */}
          <section className="about-section about-footer">
            <h2>About the Project</h2>
            <p>
              IZWI 3.0 was developed as part of the ISAZI AI Hackathon to showcase how
              artificial intelligence can improve accessibility and quality of life for
              people with disabilities in South Africa.
            </p>
            <p className="about-credits">
              Built with care by the SifiSoft team
              <br />
              Powered by Claude, Google Cloud, and modern web technologies
            </p>
          </section>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
