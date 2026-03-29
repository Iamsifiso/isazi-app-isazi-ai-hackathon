# IZWI Server

Backend API server for IZWI app with Claude Vision AI and Google Cloud TTS integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
ANTHROPIC_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
PORT=3001
```

3. Start the server:
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/analyze-scene
Analyze images using Claude Vision AI

**Request:**
```json
{
  "images": ["base64_image1", "base64_image2", ...],
  "language": "en-ZA"
}
```

**Response:**
```json
{
  "success": true,
  "description": "Detailed scene description...",
  "language": "en-ZA"
}
```

### POST /api/text-to-speech
Convert text to speech using Google Cloud TTS

**Request:**
```json
{
  "text": "Text to convert",
  "language": "en-ZA"
}
```

**Response:**
```json
{
  "success": true,
  "audioContent": "base64_encoded_mp3",
  "language": "en-ZA"
}
```

## Supported Languages

- `en-ZA` - English (South Africa)
- `af` - Afrikaans

For other South African languages, the app falls back to Web Speech API.
