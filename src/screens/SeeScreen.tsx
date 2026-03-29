import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useCamera } from '../hooks/useCamera';
import { api } from '../utils/api';
import { getTranslation, LanguageCode } from '../utils/i18n';
import './SeeScreen.css';

interface Language {
  id: string;
  name: string;
  native: string;
}

const languages: Language[] = [
  { id: 'en-ZA', name: 'English', native: 'SA' },
  { id: 'af', name: 'Afrikaans', native: 'Afr' },
];

export const SeeScreen = () => {
  const { navigateToScreen, userData, updateUserData } = useApp();
  const selectedLang = (userData.selectedLanguage || 'en-ZA') as LanguageCode;

  const {
    videoRef,
    canvasRef,
    isActive: cameraActive,
    isRecording,
    capturedFrames,
    startCamera,
    stopCamera,
    startRecording,
    stopRecording,
    clearFrames,
    error: cameraError,
  } = useCamera();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = (key: string, ...args: any[]) => getTranslation(selectedLang, key as any, ...args);

  const handleBack = () => {
    if (cameraActive) {
      stopCamera();
    }
    navigateToScreen('home');
  };

  const handleLanguageSelect = (langId: string) => {
    updateUserData({ selectedLanguage: langId });
  };

  const speakFeedback = async (text: string) => {
    // Use Google TTS for Afrikaans, Web Speech API for English
    if (selectedLang === 'af') {
      try {
        const audioContent = await api.googleTextToSpeech(text, 'af');
        await api.playAudio(audioContent);
      } catch (error) {
        console.error('Google TTS error:', error);
        // Fallback to Web Speech API
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = selectedLang;
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }
      }
    } else {
      // Use Web Speech API for English
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleStartCamera = async () => {
    setError('');
    await startCamera();
    setTimeout(() => {
      if (cameraActive) {
        speakFeedback(
          selectedLang === 'af'
            ? 'Kamera is gereed. Tik Neem op om jou omgewing vas te vang.'
            : 'Camera is ready. Tap Record to capture your surroundings.'
        );
      }
    }, 500);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      setTimeout(() => {
        speakFeedback(
          selectedLang === 'af'
            ? `${capturedFrames.length} rame vasgevang. Tik Analiseer My Omgewing.`
            : `${capturedFrames.length} frames captured. Tap Analyze My Surroundings.`
        );
      }, 300);
    } else {
      clearFrames();
      setAnalysisResult('');
      setError('');
      startRecording();
      speakFeedback(
        selectedLang === 'af'
          ? 'Opname begin. Beweeg die kamera stadig rond jou omgewing.'
          : 'Recording started. Pan the camera slowly around your surroundings.'
      );
    }
  };

  // Helper function to select frames evenly
  const selectFrames = (frames: string[], n: number): string[] => {
    if (frames.length <= n) return frames;
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
      result.push(frames[Math.round(i * (frames.length - 1) / (n - 1))]);
    }
    return result;
  };

  const handleAnalyze = async () => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      const errorMsg = selectedLang === 'af'
        ? 'API sleutel nie gekonfigureer nie'
        : 'API key not configured';
      setError(errorMsg);
      speakFeedback(errorMsg);
      return;
    }

    if (capturedFrames.length === 0) {
      setError('No frames captured. Please record first.');
      speakFeedback(
        selectedLang === 'af'
          ? 'Geen rame vasgevang nie. Neem asseblief eerste op.'
          : 'No frames captured. Please record first.'
      );
      return;
    }

    setIsAnalyzing(true);
    setError('');
    speakFeedback(
      selectedLang === 'af' ? 'Besig om te analiseer. Wag asseblief.' : 'Analyzing. Please wait.'
    );

    try {
      // Select up to 4 evenly spaced frames to stay within token limits
      const selectedFrames = selectFrames(capturedFrames, 4);

      // Build message content for Anthropic API
      const content: any[] = [];
      selectedFrames.forEach((dataUrl) => {
        const base64 = dataUrl.split(',')[1];
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: base64 }
        });
      });

      // Add prompt in selected language
      const prompt = selectedLang === 'af'
        ? `Jy is 'n toeganklikheidsassistent wat 'n blinde of visueel gestremde persoon help om hul fisiese omgewing te verstaan.

Hierdie ${selectedFrames.length} beelde is in vinnige opeenvolging vasgevang van 'n enkele omgewingskandering.

Beskryf asseblief:
1. Die algehele tipe ruimte (binnenshuis/buitenshuis, kamer tipe, straat, ens.)
2. Sleutelvoorwerpe, meubels, of strukture sigbaar en hul benaderde liggings (links, regs, voor, naby, ver)
3. Enige mense teenwoordig
4. Enige potensiële gevare of struikelblokke (trappe, lae voorwerpe, ongelyke oppervlaktes, oop deure, ens.)
5. Enige leesbare teks (tekens, etikette, kennisgewings)

Wees spesifiek, ruimtelik presies, en gebruik natuurlike gesproke taal. Hou dit onder 120 woorde. Begin direk met die beskrywing — geen inleiding nie.`
        : `You are an accessibility assistant helping a blind or visually impaired person understand their physical surroundings.

These ${selectedFrames.length} images were captured in quick succession from a single environment scan.

Please describe:
1. The overall type of space (indoor/outdoor, room type, street, etc.)
2. Key objects, furniture, or structures visible and their approximate locations (left, right, ahead, close, far)
3. Any people present
4. Any potential hazards or obstacles (steps, low objects, uneven surfaces, open doors, etc.)
5. Any readable text (signs, labels, notices)

Be specific, spatially precise, and use natural spoken language. Keep it under 120 words. Start directly with the description — no preamble.`;

      content.push({
        type: 'text',
        text: prompt
      });

      // Call Anthropic API directly
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{ role: 'user', content }]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || response.statusText);
      }

      const data = await response.json();
      const text = data.content.map((b: any) => b.text || '').join('');

      setAnalysisResult(text);

      // Auto-speak the result - use Google TTS for Afrikaans, Web Speech API for English
      setIsSpeaking(true);
      if (selectedLang === 'af') {
        try {
          const audioContent = await api.googleTextToSpeech(text, 'af');
          await api.playAudio(audioContent);
          setIsSpeaking(false);
        } catch (ttsError) {
          console.error('Google TTS error:', ttsError);
          // Fallback to Web Speech API
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = selectedLang;
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error('Analysis error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze surroundings';
      setError(errorMsg);
      speakFeedback(
        selectedLang === 'af'
          ? 'Daar was \'n fout. ' + errorMsg
          : 'There was an error. ' + errorMsg
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = async () => {
    if (!analysisResult) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);

      // Use Google TTS for Afrikaans, Web Speech API for English
      if (selectedLang === 'af') {
        try {
          const audioContent = await api.googleTextToSpeech(analysisResult, 'af');
          await api.playAudio(audioContent);
          setIsSpeaking(false);
        } catch (error) {
          console.error('Google TTS error:', error);
          // Fallback to Web Speech API
          const utterance = new SpeechSynthesisUtterance(analysisResult);
          utterance.lang = selectedLang;
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        const utterance = new SpeechSynthesisUtterance(analysisResult);
        utterance.lang = selectedLang;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.code === 'Space' && cameraActive) {
        e.preventDefault();
        handleToggleRecording();
      }
      if (e.code === 'Enter' && capturedFrames.length > 0 && !isAnalyzing) {
        e.preventDefault();
        handleAnalyze();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [cameraActive, isRecording, capturedFrames, isAnalyzing]);

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
          <span className="see-title">{t('visionVoice')}</span>
          <span className="vision-mode-badge">{t('visionMode')}</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="scroll-content">
        <div className="see-scroll">
          {/* Tagline */}
          <div className="see-tagline">{t('seeWorldTagline')}</div>

          {/* How to use */}
          <div className="glass-card how-to-card teal-border-left">
            <p>
              <strong>{t('howToUse')}</strong>
              <br />
              {t('howToUseText')}
            </p>
          </div>

          {/* Language Grid */}
          <div className="glass-card see-card">
            <span className="section-label">{t('languageSelection')}</span>
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
          <div className="camera-box">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            <div className={`camera-overlay ${cameraActive ? 'hidden' : ''}`}>
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
              <div className="camera-label">{t('cameraNotStarted')}</div>
            </div>
            {isRecording && (
              <div className="recording-indicator">
                <span className="recording-dot"></span>
                {t('recordingFrames')} ({capturedFrames.length}/6)
              </div>
            )}
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Errors */}
          {(error || cameraError) && (
            <div className="error-message">{error || cameraError}</div>
          )}

          {/* Frames Preview */}
          {capturedFrames.length > 0 && (
            <div className="frames-preview-section">
              <span className="section-label">
                {t('recordingFrames')} ({capturedFrames.length})
              </span>
              <div className="frames-grid">
                {capturedFrames.map((frame, index) => (
                  <img
                    key={index}
                    src={frame}
                    alt={`Frame ${index + 1}`}
                    className="frame-thumb"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="glass-card analysis-result">
              <span className="section-label">
                {selectedLang === 'af' ? 'KI SIEN' : 'AI SEES'}
              </span>
              <p>{analysisResult}</p>
              <div className="response-actions">
                <button
                  className={`btn-voice ${isSpeaking ? 'speaking' : ''}`}
                  onClick={handleSpeak}
                >
                  {isSpeaking ? (
                    <>
                      <span>⏸</span>{' '}
                      {selectedLang === 'af' ? 'Besig om te praat...' : 'Speaking...'}
                    </>
                  ) : (
                    <>
                      <span>🔊</span> {selectedLang === 'af' ? 'Lees Hardop' : 'Read Aloud'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="see-btn-row">
            <button
              className="btn btn-green see-action-btn"
              onClick={handleStartCamera}
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
              {t('startCamera')}
            </button>
            <button
              className={`btn btn-red see-action-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleToggleRecording}
              disabled={!cameraActive}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="10" />
              </svg>
              {isRecording ? t('stopRecording') : t('record')}
            </button>
          </div>

          <button
            className="btn btn-gradient analyze-btn"
            onClick={handleAnalyze}
            disabled={!cameraActive || capturedFrames.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="spinner"></div>
                {t('analyzing')}
              </>
            ) : (
              <>
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
                {t('analyzeSurroundings')}
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
              </>
            )}
          </button>

          {/* Keyboard Shortcuts Hint */}
          <div className="keyboard-hint">
            <kbd>Space</kbd> = {selectedLang === 'af' ? 'Wissel opname' : 'Toggle record'} •{' '}
            <kbd>Enter</kbd> = {selectedLang === 'af' ? 'Analiseer' : 'Analyze'}
          </div>

          <div style={{ height: '20px' }}></div>
        </div>
      </div>

      <div className="bottom-indicator">
        <div className="home-indicator"></div>
      </div>
    </div>
  );
};
