# IZWI 3.0 - Your Voice. Let Me Speak For You.

<div align="center">

**A Progressive Web App (PWA) for accessibility and independence**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple)](https://vitejs.dev/)

</div>

---

## Overview

**IZWI** (isiZulu for "voice") is a comprehensive accessibility assistant designed for blind, visually impaired, and speech-impaired individuals in South Africa. Built with cutting-edge AI technology, IZWI provides three core features to empower independence and improve quality of life.

### Core Features

🗣️ **I Need to Speak** - Text-to-speech communication in English, Afrikaans, and isiZulu
- Convert text to natural speech with high-quality voices
- Manage custom phrases organized by categories
- Emergency WhatsApp contact integration
- Favorite phrases and recent history

👁️ **I Need to See** - AI-powered vision analysis
- Context-aware scene descriptions using Claude Sonnet 4
- Intelligent content detection (environments, menus, products, documents, signs)
- Prioritizes hazards for safety
- Multi-language support with detailed audio descriptions

🤚 **Help Me Sign** - South African Sign Language (SASL) animations
- Learn basic SASL phrases through Lottie animations
- Visual demonstrations of common greetings
- Perfect for learning and communication

---

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera-enabled device (for vision features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/izwi-app.git
   cd IZWI3.O
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_GOOGLE_TTS_API_KEY=your_google_cloud_api_key_here
   VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
   ```

   **Get API Keys:**
   - **Anthropic Claude**: [https://console.anthropic.com/](https://console.anthropic.com/)
   - **Google Cloud**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
     - Enable Cloud Text-to-Speech API
     - Enable Cloud Translation API (optional)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:5173](http://localhost:5173)

---

## Running the Solution

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build and preview the production version:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Production files will be in the `dist/` directory.

### Using the Start Script

Quick start for development (Unix/Linux/Mac):

```bash
chmod +x start.sh
./start.sh
```

---

## Technology Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.6** - Type-safe development
- **Vite 6.0** - Fast build tool
- **CSS3** - Styling with custom properties

### AI & APIs
- **Anthropic Claude Sonnet 4** - Vision analysis
- **Google Cloud Text-to-Speech** - High-quality voices for Afrikaans and isiZulu
- **Web Speech API** - Browser-native speech synthesis for English

### Other Technologies
- **Lottie-React** - Vector animations for SASL
- **PWA (Vite Plugin)** - Progressive Web App capabilities
- **localStorage** - Client-side data persistence

---

## Architecture

IZWI 3.0 is a **frontend-only Progressive Web App** that makes direct API calls from the browser:

```
┌─────────────────────────────────────────┐
│           IZWI Frontend (React)         │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Speak   │  │   See    │  │  Sign  ││
│  │  Screen  │  │  Screen  │  │ Screen ││
│  └────┬─────┘  └────┬─────┘  └────┬───┘│
│       │             │              │    │
│       ▼             ▼              ▼    │
│  ┌─────────────────────────────────┐   │
│  │      Context API / localStorage  │   │
│  └─────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   ┌────────┐ ┌──────┐ ┌─────────┐
   │Anthropic│ │Google│ │   Web   │
   │  Claude │ │Cloud │ │ Speech  │
   │   API   │ │ TTS  │ │   API   │
   └────────┘ └──────┘ └─────────┘
```

**No backend server required** - All API keys are configured via environment variables and called directly from the browser.

---

## Project Structure

```
IZWI3.O/
├── public/                 # Static assets
│   ├── icons/             # App icons
│   └── manifest.json      # PWA manifest
├── src/
│   ├── assets/            # Images and animations
│   │   └── animations/    # Lottie JSON files for SASL
│   ├── components/        # Reusable components
│   │   ├── Orb.tsx       # Visual state indicator
│   │   └── ErrorBoundary.tsx
│   ├── contexts/          # React Context
│   │   └── AppContext.tsx # Global state management
│   ├── hooks/             # Custom React hooks
│   │   ├── useCamera.ts  # Camera control
│   │   ├── useSpeech.ts  # Speech synthesis
│   │   └── useGestures.ts # Touch gestures
│   ├── screens/           # Application screens
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── NameScreen.tsx
│   │   ├── MedicalScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SpeakScreen.tsx
│   │   ├── SeeScreen.tsx
│   │   ├── SignScreen.tsx
│   │   └── AboutScreen.tsx
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── api.ts        # API integrations
│   │   ├── i18n.ts       # Translations
│   │   ├── storage.ts    # localStorage utilities
│   │   └── tts.ts        # Text-to-speech helpers
│   ├── App.tsx           # Main app component
│   ├── App.css           # Global styles
│   └── main.tsx          # Entry point
├── .env                  # Environment variables (not in git)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE               # MIT License
└── README.md            # This file
```

---

## Features in Detail

### 🗣️ I Need to Speak

**Text-to-Speech Communication**
- Convert typed text to natural speech
- Support for 3 languages: English, Afrikaans, isiZulu
- High-quality Google Cloud voices for Afrikaans and isiZulu

**Phrase Management**
- Pre-built categories: Emergency, Medical, Social, Shopping
- Create custom categories
- Add, edit, and delete phrases
- Star favorite phrases for quick access
- Automatic recent history (last 20 phrases)

**Emergency Features**
- One-tap emergency alert button
- WhatsApp emergency contact integration
- Pre-written emergency messages in all languages
- Quick access from any screen

### 👁️ I Need to See

**AI-Powered Vision Analysis**
- Camera-based scene capture (6 frames over 6 seconds)
- Context-aware descriptions using Claude Sonnet 4 AI
- Intelligent detection of content type:
  - General environments (prioritizes hazards)
  - Food menus and price lists
  - Medication and product labels
  - Documents and forms
  - Signage and directions
  - Unclear content (suggests retake)

**Safety First**
- Hazard detection and warnings
- Spatial descriptions (left, right, ahead, near, far)
- Clear audio descriptions in selected language

**Multi-Language**
- Full support in English, Afrikaans, and isiZulu
- AI responses in selected language
- Voice feedback for all actions

### 🤚 Help Me Sign

**SASL Animation Library**
- Visual demonstrations of South African Sign Language
- Current phrases: Hello, Yes, Thank you
- Smooth Lottie vector animations
- Replay capability for practice

---

## Accessibility Features

### Visual Accessibility
- High contrast design (white on dark)
- Large, readable fonts (minimum 14px)
- Clear iconography and visual hierarchy
- Teal accent color for focus states
- Responsive design for all screen sizes

### Auditory Accessibility
- Voice feedback for all actions
- Status announcements
- Error messages spoken aloud
- Multi-language support (English, Afrikaans, isiZulu)
- Natural, high-quality voices

### Motor Accessibility
- Gesture-based navigation:
  - Swipe right: Next/Forward
  - Swipe left: Back/Previous
  - Double tap: Select
- Large touch targets (minimum 44x44px)
- Keyboard navigation support
- No time-limited interactions

### Cognitive Accessibility
- Simple, consistent interface
- Clear instructions with examples
- One primary action per screen
- Confirmation dialogs for important actions
- Help always available

---

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

### Testing as a New User

To reset the app and test the onboarding flow:

**Browser Console (F12):**
```javascript
localStorage.clear();
location.reload();
```

**Manual Reset:**
1. Open Developer Tools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Reload page

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Anthropic API (Required for vision analysis)
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# Google Cloud TTS API (Required for Afrikaans and isiZulu)
VITE_GOOGLE_TTS_API_KEY=AIzaSy...

# Google Translate API (Optional)
VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSy...
```

**Important**: Never commit the `.env` file to git. It's already in `.gitignore`.

---

## Browser Support

IZWI works best on modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Browser Features
- Web Speech API (for text-to-speech)
- MediaDevices API (for camera access)
- localStorage (for data persistence)
- Service Worker (for PWA features)

---

## Deployment

### Recommended: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Configure Environment Variables**
   Add your API keys in the Vercel dashboard under Settings → Environment Variables

### Alternative: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder**
   - Drag and drop to Netlify
   - Or use Netlify CLI
   - Configure environment variables in Netlify dashboard

### Self-Hosting

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Serve the `dist/` folder**
   - Use any static file server (nginx, Apache, etc.)
   - Ensure HTTPS is configured
   - Configure service worker for PWA features

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test on multiple devices/browsers

---

## Troubleshooting

### Camera Not Working
- Grant camera permissions in browser settings
- Ensure HTTPS (camera requires secure context)
- Check if another app is using the camera

### Speech Not Working
- Check browser compatibility (Web Speech API)
- Verify API keys are correct in `.env`
- Check browser console for errors
- Try fallback to Web Speech API

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 SifiSoft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

### Technologies
- **Anthropic** - Claude Sonnet 4 AI model
- **Google Cloud** - Text-to-Speech and Translation APIs
- **React Team** - React framework
- **Vite Team** - Build tooling
- **Open Source Community** - Various libraries and tools

### Project Context
Built for the **ISAZI AI Hackathon** to showcase how AI can improve accessibility and quality of life for people with disabilities in South Africa.

### Special Thanks
- South African National Deaf Association (SANDA) - SASL resources
- Accessibility advocates and testers
- The disability community for feedback and guidance

---

## Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-org/izwi-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/izwi-app/discussions)
- **Documentation**: See `SESSION_LOG.md` for detailed development history

---

<div align="center">

**Made with ❤️ by SifiSoft**

[Report Bug](https://github.com/your-org/izwi-app/issues) · [Request Feature](https://github.com/your-org/izwi-app/issues)

</div>
