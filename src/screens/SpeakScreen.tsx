import { useState, useEffect } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { api } from '../utils/api';
import './SpeakScreen.css';

interface Phrase {
  id: string;
  text: string;
  category: string;
  isFavorite?: boolean;
  isCustom?: boolean;
}

interface RecentPhrase {
  text: string;
  timestamp: number;
}

type PhraseCategory = 'emergency' | 'medical' | 'social' | 'shopping' | 'custom';

const defaultPhrases: Phrase[] = [
  // Emergency
  { id: 'e1', text: 'I need help', category: 'emergency' },
  { id: 'e2', text: 'Call emergency services', category: 'emergency' },
  { id: 'e3', text: 'I need a doctor', category: 'emergency' },

  // Medical
  { id: 'm1', text: 'I need my medication', category: 'medical' },
  { id: 'm2', text: 'I am not feeling well', category: 'medical' },
  { id: 'm3', text: 'Where is the nearest hospital?', category: 'medical' },

  // Social
  { id: 's1', text: 'Hello', category: 'social' },
  { id: 's2', text: 'How are you?', category: 'social' },
  { id: 's3', text: 'Thank you', category: 'social' },
  { id: 's4', text: 'Please wait', category: 'social' },
  { id: 's5', text: 'Goodbye', category: 'social' },

  // Shopping
  { id: 'sh1', text: 'How much does this cost?', category: 'shopping' },
  { id: 'sh2', text: 'Where is the bathroom?', category: 'shopping' },
  { id: 'sh3', text: 'Can you help me?', category: 'shopping' },
];

export const SpeakScreen = () => {
  const { navigateToScreen, userData, updateUserData } = useApp();
  const { speak, isSpeaking } = useSpeech();
  const [text, setText] = useState('');
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [recentPhrases, setRecentPhrases] = useState<RecentPhrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhraseCategory | 'favorites' | 'recent'>('social');
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(userData.selectedLanguage);
  const [isSpeakingWithTTS, setIsSpeakingWithTTS] = useState(false);

  // Load saved phrases and recent from localStorage
  useEffect(() => {
    const savedPhrases = localStorage.getItem('izwi-phrases');
    const savedRecent = localStorage.getItem('izwi-recent-phrases');

    if (savedPhrases) {
      setPhrases(JSON.parse(savedPhrases));
    } else {
      setPhrases(defaultPhrases);
      localStorage.setItem('izwi-phrases', JSON.stringify(defaultPhrases));
    }

    if (savedRecent) {
      setRecentPhrases(JSON.parse(savedRecent));
    }
  }, []);

  // Save phrases when they change
  useEffect(() => {
    if (phrases.length > 0) {
      localStorage.setItem('izwi-phrases', JSON.stringify(phrases));
    }
  }, [phrases]);

  // Save recent phrases when they change
  useEffect(() => {
    if (recentPhrases.length > 0) {
      localStorage.setItem('izwi-recent-phrases', JSON.stringify(recentPhrases));
    }
  }, [recentPhrases]);

  const handleSend = async () => {
    if (!text.trim()) return;

    // Add to recent phrases
    const newRecent: RecentPhrase = {
      text: text.trim(),
      timestamp: Date.now(),
    };
    setRecentPhrases(prev => [newRecent, ...prev.filter(p => p.text !== text.trim())].slice(0, 20));

    // Speak using Google TTS for Afrikaans, Web Speech API for English
    if (currentLanguage === 'af-ZA') {
      try {
        setIsSpeakingWithTTS(true);
        const audioBase64 = await api.googleTextToSpeech(text, 'af');
        await api.playAudio(audioBase64);
        setIsSpeakingWithTTS(false);
      } catch (error) {
        console.error('TTS error:', error);
        setIsSpeakingWithTTS(false);
        // Fallback to Web Speech API
        speak(text);
      }
    } else {
      speak(text);
    }
  };

  const handleQuickSpeak = async (phraseText: string) => {
    setText(phraseText);

    // Add to recent
    const newRecent: RecentPhrase = {
      text: phraseText,
      timestamp: Date.now(),
    };
    setRecentPhrases(prev => [newRecent, ...prev.filter(p => p.text !== phraseText)].slice(0, 20));

    // Speak immediately
    if (currentLanguage === 'af-ZA') {
      try {
        setIsSpeakingWithTTS(true);
        const audioBase64 = await api.googleTextToSpeech(phraseText, 'af');
        await api.playAudio(audioBase64);
        setIsSpeakingWithTTS(false);
      } catch (error) {
        console.error('TTS error:', error);
        setIsSpeakingWithTTS(false);
        speak(phraseText);
      }
    } else {
      speak(phraseText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleFavorite = (phraseId: string) => {
    setPhrases(prev =>
      prev.map(p => (p.id === phraseId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const addCustomPhrase = () => {
    if (!newPhraseText.trim()) return;
    if (selectedCategory === 'recent' || selectedCategory === 'favorites') return;

    const newPhrase: Phrase = {
      id: `${selectedCategory}-${Date.now()}`,
      text: newPhraseText.trim(),
      category: selectedCategory as PhraseCategory,
      isCustom: true,
      isFavorite: false,
    };

    setPhrases(prev => [...prev, newPhrase]);
    setNewPhraseText('');
    setIsAddingPhrase(false);
  };

  const deletePhrase = (phraseId: string) => {
    if (window.confirm('Are you sure you want to delete this phrase?')) {
      setPhrases(prev => prev.filter(p => p.id !== phraseId));
    }
  };

  const updatePhrase = (phraseId: string, newText: string) => {
    setPhrases(prev =>
      prev.map(p => (p.id === phraseId ? { ...p, text: newText } : p))
    );
    setEditingPhraseId(null);
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en-ZA' ? 'af-ZA' : 'en-ZA';
    setCurrentLanguage(newLang);
    updateUserData({ selectedLanguage: newLang });
  };

  const handleCategoryChange = (category: PhraseCategory | 'favorites' | 'recent') => {
    setSelectedCategory(category);
    setIsAddingPhrase(false); // Close add phrase mode when switching categories
    setEditingPhraseId(null); // Close edit mode when switching categories
  };

  const getFilteredPhrases = (): Phrase[] => {
    if (selectedCategory === 'favorites') {
      return phrases.filter(p => p.isFavorite);
    }
    if (selectedCategory === 'recent') {
      return recentPhrases.map((rp, idx) => ({
        id: `recent-${idx}`,
        text: rp.text,
        category: 'recent' as PhraseCategory,
        isFavorite: false,
        isCustom: false,
      }));
    }
    return phrases.filter(p => p.category === selectedCategory);
  };

  const handleBack = () => {
    navigateToScreen('home');
  };

  const filteredPhrases = getFilteredPhrases();

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
        <button className="lang-toggle-btn" onClick={handleLanguageToggle}>
          <span className="lang-flag">{currentLanguage === 'en-ZA' ? '🇬🇧' : '🇿🇦'}</span>
          <span className="lang-code">{currentLanguage === 'en-ZA' ? 'EN' : 'AF'}</span>
        </button>
      </div>

      {/* Emergency Quick Access */}
      <div className="emergency-bar">
        <button
          className="emergency-btn"
          onClick={() => handleQuickSpeak('I need help! Please call emergency services!')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>EMERGENCY</span>
        </button>
      </div>

      {/* Orb Area */}
      <div className="speak-orb-area">
        <Orb size="lg" state={isSpeaking || isSpeakingWithTTS ? 'speaking' : 'idle'} />
      </div>

      {/* Bottom Section */}
      <div className="speak-bottom">
        {/* Category Tabs */}
        <div className="category-tabs">
          <button
            className={`category-tab ${selectedCategory === 'recent' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('recent')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Recent
          </button>
          <button
            className={`category-tab ${selectedCategory === 'favorites' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('favorites')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favorites
          </button>
          <button
            className={`category-tab ${selectedCategory === 'emergency' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('emergency')}
          >
            Emergency
          </button>
          <button
            className={`category-tab ${selectedCategory === 'medical' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('medical')}
          >
            Medical
          </button>
          <button
            className={`category-tab ${selectedCategory === 'social' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('social')}
          >
            Social
          </button>
          <button
            className={`category-tab ${selectedCategory === 'shopping' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('shopping')}
          >
            Shopping
          </button>
          <button
            className={`category-tab ${selectedCategory === 'custom' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('custom')}
          >
            Custom
          </button>
        </div>

        {/* Phrases */}
        <div className="quick-phrases">
          {filteredPhrases.map((phrase) => (
            <div key={phrase.id} className="phrase-chip-wrapper">
              {editingPhraseId === phrase.id ? (
                <div className="phrase-edit-mode">
                  <input
                    type="text"
                    className="phrase-edit-input"
                    defaultValue={phrase.text}
                    autoFocus
                    onBlur={(e) => updatePhrase(phrase.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updatePhrase(phrase.id, (e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                </div>
              ) : (
                <>
                  <button
                    className="phrase-chip"
                    onClick={() => handleQuickSpeak(phrase.text)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setEditingPhraseId(phrase.id);
                    }}
                  >
                    {phrase.text}
                  </button>
                  {selectedCategory !== 'recent' && (
                    <button
                      className={`favorite-btn ${phrase.isFavorite ? 'active' : ''}`}
                      onClick={() => toggleFavorite(phrase.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={phrase.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}
                  {selectedCategory !== 'recent' && selectedCategory !== 'favorites' && (
                    <button
                      className="delete-btn"
                      onClick={() => deletePhrase(phrase.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Add Phrase Button - Available in all categories except Recent and Favorites */}
          {selectedCategory !== 'recent' && selectedCategory !== 'favorites' && (
            <div className="phrase-chip-wrapper">
              {isAddingPhrase ? (
                <div className="phrase-add-mode">
                  <input
                    type="text"
                    className="phrase-add-input"
                    placeholder={`Add ${selectedCategory} phrase...`}
                    value={newPhraseText}
                    onChange={(e) => setNewPhraseText(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      if (!newPhraseText.trim()) {
                        setIsAddingPhrase(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addCustomPhrase();
                      }
                    }}
                  />
                  <button className="add-phrase-confirm-btn" onClick={addCustomPhrase}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="phrase-chip add-phrase-btn"
                  onClick={() => setIsAddingPhrase(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Phrase
                </button>
              )}
            </div>
          )}
        </div>

        <div className="speak-input-row">
          <textarea
            className="speak-textarea"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
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
