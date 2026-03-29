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

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Camera-enabled device (for vision features)

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
```

3. **Configure API keys:**
Edit `server/.env` with your API keys:
```env
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
```

### Running the App

You need to run both frontend and backend:

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
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

- Google Cloud Vision API integration for advanced scene analysis
- Google Cloud Text-to-Speech API for more natural voices
- Speech-to-Text for voice input
- Offline support with cached responses
- Emergency contact quick dial
- Medical information sharing in emergencies

## License

Copyright © 2026 IZWI. All rights reserved.
