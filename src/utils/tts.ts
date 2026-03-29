/**
 * Text-to-Speech utilities
 * Handles both Google Cloud TTS (for Afrikaans) and Web Speech API (for English)
 */

import { api } from './api';

export type LanguageCode = 'en-ZA' | 'af-ZA' | 'af';

/**
 * Creates a configured SpeechSynthesisUtterance
 */
export function createSpeechUtterance(
  text: string,
  language: LanguageCode,
  rate: number = 0.9,
  pitch: number = 1
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = rate;
  utterance.pitch = pitch;
  return utterance;
}

/**
 * Speaks text using Web Speech API
 */
export function speakWithWebAPI(
  text: string,
  language: LanguageCode = 'en-ZA',
  rate: number = 0.9,
  pitch: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = createSpeechUtterance(text, language, rate, pitch);

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event);

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Speaks text using Google Cloud TTS
 */
export async function speakWithGoogleTTS(
  text: string,
  language: 'af' | 'en' = 'af'
): Promise<void> {
  const audioBase64 = await api.googleTextToSpeech(text, language);
  await api.playAudio(audioBase64);
}

/**
 * Speaks text with automatic fallback
 * Uses Google TTS for Afrikaans, Web Speech API for English
 * Falls back to Web Speech API if Google TTS fails
 */
export async function speakWithFallback(
  text: string,
  language: LanguageCode = 'en-ZA'
): Promise<void> {
  const isAfrikaans = language === 'af-ZA' || language === 'af';

  if (isAfrikaans) {
    try {
      await speakWithGoogleTTS(text, 'af');
    } catch (error) {
      console.error('Google TTS error, falling back to Web Speech API:', error);
      // Fallback to Web Speech API
      await speakWithWebAPI(text, 'af-ZA');
    }
  } else {
    await speakWithWebAPI(text, language);
  }
}

/**
 * Cancels any ongoing speech
 */
export function cancelSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Checks if speech synthesis is supported
 */
export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}
