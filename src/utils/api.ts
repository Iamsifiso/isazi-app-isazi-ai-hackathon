const API_BASE_URL = 'http://localhost:3001/api';

export interface AnalyzeSceneRequest {
  images: string[]; // Base64 encoded images
  language: string;
}

export interface AnalyzeSceneResponse {
  success: boolean;
  description: string;
  language: string;
}

export interface TextToSpeechRequest {
  text: string;
  language: string;
}

export interface TextToSpeechResponse {
  success: boolean;
  audioContent: string; // Base64 encoded MP3
  language: string;
}

export const api = {
  async analyzeScene(request: AnalyzeSceneRequest): Promise<AnalyzeSceneResponse> {
    const response = await fetch(`${API_BASE_URL}/analyze-scene`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze scene');
    }

    return response.json();
  },

  async textToSpeech(request: TextToSpeechRequest): Promise<TextToSpeechResponse> {
    const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate speech');
    }

    return response.json();
  },

  async playAudio(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Failed to play audio'));
        audio.play();
      } catch (error) {
        reject(error);
      }
    });
  },

  // Google Cloud Text-to-Speech for better Afrikaans support
  async googleTextToSpeech(text: string, languageCode: string = 'af-ZA'): Promise<string> {
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      throw new Error('Google API key not configured');
    }

    // Map language codes to Google TTS voice names
    const voiceMap: Record<string, { languageCode: string; name: string }> = {
      'af': { languageCode: 'af-ZA', name: 'af-ZA-Standard-A' },
      'en-ZA': { languageCode: 'en-ZA', name: 'en-ZA-Standard-A' },
    };

    const voice = voiceMap[languageCode] || voiceMap['en-ZA'];

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: 0,
            speakingRate: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate speech');
    }

    const data = await response.json();
    return data.audioContent; // Returns base64 encoded MP3
  },
};
