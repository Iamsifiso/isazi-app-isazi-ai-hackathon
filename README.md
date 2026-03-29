# IZWI - Your Voice. Let Me Speak For You.

A Progressive Web App (PWA) designed to assist people with hearing, speech, and visibility difficulties.

## Features

- **Multi-modal Introduction**: Voice-guided and visual modes for accessibility
- **Text-to-Speech (TTS)**: Convert typed text to speech using Web Speech API
- **AI Vision Analysis**: Camera-based scene description (coming soon with Google Vision API)
- **Multi-language Support**: Support for all 11 official South African languages
- **Gesture Navigation**: Swipe-based navigation for visually impaired users
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **PWA Support**: Install as an app on your device

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Web Speech API** for text-to-speech
- **PWA** with service worker support
- **CSS3** with glass morphism effects and animations

## Architecture

IZWI 3.0 is a **frontend-only PWA** that makes direct API calls from the browser:

- **Vision Analysis**: Anthropic Claude API (direct browser call)
- **Text-to-Speech**: Google Cloud TTS API (direct browser call)
- **Speech-to-Text**: Web Speech API (browser native)

No backend server required - all API keys configured via environment variables.

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Camera-enabled device (for vision features)
- API Keys:
  - [Anthropic API](https://console.anthropic.com/) for Claude Vision
  - [Google Cloud TTS API](https://cloud.google.com/text-to-speech) for text-to-speech
  - [Google Translate API](https://cloud.google.com/translate) for translations

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd IZWI3.O
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env and add your API keys:
# VITE_ANTHROPIC_API_KEY=your_key_here
# VITE_GOOGLE_TRANSLATE_API_KEY=your_key_here
```

### Running the App

**Development mode:**
```bash
npm run dev
```

**Using the start script:**
```bash
./start.sh
```

**Production build:**
```bash
npm run build
npm run preview
```

Then open http://localhost:5173/

### Testing as a New User

To reset the app and test onboarding again:

**Option 1 - Browser Console:**
```javascript
clearAppData()  // Run this in browser console (F12)
```

**Option 2 - Manual:**
```javascript
localStorage.clear();
location.reload();
```

## Project Structure

```
src/
├── components/       # Reusable UI components (Orb, etc.)
├── screens/          # App screens (Splash, Welcome, Home, etc.)
├── hooks/            # Custom React hooks (useSpeech, useGestures)
├── contexts/         # React contexts for state management
├── styles/           # Global styles and animations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Accessibility Features

- **Voice-Guided Mode**: Audio feedback and voice instructions
- **Visual Mode**: Enhanced visual cues and indicators
- **Gesture Support**:
  - Swipe right: Next item
  - Swipe left: Previous item
  - Double tap: Select

## Future Enhancements

- Expanded language support for all 11 official South African languages
- Offline support with cached responses
- Emergency contact quick dial
- Medical information sharing in emergencies
- Voice command navigation
- Saved scene descriptions history

## License

Copyright © 2026 IZWI. All rights reserved.
