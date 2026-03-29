import { useState, useEffect } from 'react';
import { Orb } from '../components/Orb';
import { useApp } from '../contexts/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { api } from '../utils/api';
import {
  getStorageItem,
  setStorageItem,
  validatePhrases,
  validateCategories,
  validateRecentPhrases,
  validatePhoneNumber,
} from '../utils/storage';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('social');
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(userData.selectedLanguage);
  const [isSpeakingWithTTS, setIsSpeakingWithTTS] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [emergencyWhatsAppContact, setEmergencyWhatsAppContact] = useState('');
  const [isConfigureWhatsApp, setIsConfigureWhatsApp] = useState(false);
  const [tempWhatsAppContact, setTempWhatsAppContact] = useState('');

  // Load saved phrases and recent from localStorage
  useEffect(() => {
    const savedPhrases = getStorageItem<Phrase[]>('izwi-phrases', []);
    const validatedPhrases = validatePhrases(savedPhrases);

    if (validatedPhrases.length > 0) {
      setPhrases(validatedPhrases);
    } else {
      setPhrases(defaultPhrases);
      setStorageItem('izwi-phrases', defaultPhrases);
    }

    const savedRecent = getStorageItem<RecentPhrase[]>('izwi-recent-phrases', []);
    const validatedRecent = validateRecentPhrases(savedRecent, 20);
    setRecentPhrases(validatedRecent);

    const savedCustomCategories = getStorageItem<string[]>('izwi-custom-categories', []);
    const validatedCategories = validateCategories(savedCustomCategories);
    setCustomCategories(validatedCategories);

    const savedWhatsAppContact = getStorageItem<string>('izwi-emergency-whatsapp', '');
    const validatedContact = validatePhoneNumber(savedWhatsAppContact);
    setEmergencyWhatsAppContact(validatedContact);
  }, []);

  // Save phrases when they change
  useEffect(() => {
    if (phrases.length > 0) {
      setStorageItem('izwi-phrases', phrases);
    }
  }, [phrases]);

  // Save recent phrases when they change
  useEffect(() => {
    if (recentPhrases.length > 0) {
      setStorageItem('izwi-recent-phrases', recentPhrases);
    }
  }, [recentPhrases]);

  // Save custom categories when they change
  useEffect(() => {
    setStorageItem('izwi-custom-categories', customCategories);
  }, [customCategories]);

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

  const addCustomCategory = () => {
    const categoryName = newCategoryName.trim().toLowerCase();
    if (!categoryName) return;

    // Check if category already exists
    const allCategories = ['emergency', 'medical', 'social', 'shopping', 'custom', 'recent', 'favorites', ...customCategories];
    if (allCategories.includes(categoryName)) {
      alert('This category already exists!');
      return;
    }

    setCustomCategories(prev => [...prev, categoryName]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setSelectedCategory(categoryName);
  };

  const deleteCustomCategory = (categoryName: string) => {
    if (window.confirm(`Delete "${categoryName}" category and all its phrases?`)) {
      // Remove category
      setCustomCategories(prev => prev.filter(c => c !== categoryName));
      // Remove all phrases in this category
      setPhrases(prev => prev.filter(p => p.category !== categoryName));
      // Switch to social category
      setSelectedCategory('social');
    }
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en-ZA' ? 'af-ZA' : 'en-ZA';
    setCurrentLanguage(newLang);
    updateUserData({ selectedLanguage: newLang });
  };

  const handleOpenWhatsAppConfig = () => {
    setTempWhatsAppContact(emergencyWhatsAppContact);
    setIsConfigureWhatsApp(true);
  };

  const handleSaveWhatsAppContact = () => {
    const validatedNumber = validatePhoneNumber(tempWhatsAppContact);
    if (!validatedNumber) {
      alert('Please enter a valid phone number (10-15 digits)');
      return;
    }
    setEmergencyWhatsAppContact(validatedNumber);
    setStorageItem('izwi-emergency-whatsapp', validatedNumber);
    setIsConfigureWhatsApp(false);
  };

  const handleOpenWhatsApp = () => {
    if (!emergencyWhatsAppContact) {
      alert('Please configure emergency WhatsApp contact first');
      handleOpenWhatsAppConfig();
      return;
    }

    const emergencyMessage = currentLanguage === 'af-ZA'
      ? 'NOODGEVAL! Ek het dringend hulp nodig. Asseblief help my!'
      : 'EMERGENCY! I need urgent help. Please assist me!';

    const encodedMessage = encodeURIComponent(emergencyMessage);
    const whatsappUrl = `https://wa.me/${emergencyWhatsAppContact}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsAddingPhrase(false); // Close add phrase mode when switching categories
    setEditingPhraseId(null); // Close edit mode when switching categories
    setIsAddingCategory(false); // Close add category mode when switching categories
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
          <span className="lang-flag">{currentLanguage === 'en-ZA' ? '🇿🇦' : '🇿🇦'}</span>
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

        <button
          className="whatsapp-emergency-btn"
          onClick={handleOpenWhatsApp}
          title={emergencyWhatsAppContact ? 'Send emergency WhatsApp' : 'Configure emergency contact'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </button>

        <button
          className="config-whatsapp-btn"
          onClick={handleOpenWhatsAppConfig}
          title="Configure emergency WhatsApp contact"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
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

          {/* Custom Categories */}
          {customCategories.map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
              onContextMenu={(e) => {
                e.preventDefault();
                deleteCustomCategory(category);
              }}
              title="Right-click to delete"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}

          {/* Add Category Button */}
          {isAddingCategory ? (
            <div className="category-tab add-category-mode">
              <input
                type="text"
                className="category-input"
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!newCategoryName.trim()) {
                    setIsAddingCategory(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCustomCategory();
                  } else if (e.key === 'Escape') {
                    setIsAddingCategory(false);
                    setNewCategoryName('');
                  }
                }}
              />
            </div>
          ) : (
            <button
              className="category-tab add-category-btn"
              onClick={() => setIsAddingCategory(true)}
              title="Add custom category"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
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

      {/* WhatsApp Configuration Modal */}
      {isConfigureWhatsApp && (
        <div className="modal-overlay" onClick={() => setIsConfigureWhatsApp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configure Emergency WhatsApp</h3>
              <button className="modal-close-btn" onClick={() => setIsConfigureWhatsApp(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Enter your emergency contact's WhatsApp number (with country code).
                <br />
                Example: 27812345678 (for South Africa)
              </p>
              <input
                type="tel"
                className="whatsapp-input"
                placeholder="e.g. 27812345678"
                value={tempWhatsAppContact}
                onChange={(e) => setTempWhatsAppContact(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsConfigureWhatsApp(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveWhatsAppContact}>
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
