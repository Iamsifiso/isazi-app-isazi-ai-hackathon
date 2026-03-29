import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'IZWI Server is running' });
});

// Analyze images with Claude Vision
app.post('/api/analyze-scene', async (req, res) => {
  try {
    const { images, language } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    console.log(`Analyzing ${images.length} images in ${language || 'en-ZA'}`);

    // Helper function to select evenly spaced frames
    function selectFrames(frames, n) {
      if (frames.length <= n) return frames;
      const result = [];
      for (let i = 0; i < n; i++) {
        const index = Math.round((i * (frames.length - 1)) / (n - 1));
        result.push(frames[index]);
      }
      return result;
    }

    // Select up to 4 evenly spaced frames to optimize token usage
    const selectedImages = selectFrames(images, 4);
    console.log(`Selected ${selectedImages.length} frames for analysis`);

    // Prepare selected image content for Claude
    const selectedImageContent = selectedImages.map((img) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: img.replace(/^data:image\/\w+;base64,/, ''),
      },
    }));

    // Language-specific prompts with better spatial guidance
    const prompts = {
      'en-ZA': `You are an accessibility assistant helping a blind or visually impaired person understand their physical surroundings.

These ${selectedImages.length} images were captured in quick succession from a single environment scan.

Please describe:
1. The overall type of space (indoor/outdoor, room type, street, etc.)
2. Key objects, furniture, or structures visible and their approximate locations (left, right, ahead, close, far)
3. Any people present
4. Any potential hazards or obstacles (steps, low objects, uneven surfaces, open doors, wet floors)
5. Any readable text (signs, labels, notices)

Be specific, spatially precise, and use natural spoken language. Keep it under 120 words. Start directly with the description — no preamble.`,
      'af': `Jy is 'n toeganklikheidsassistent wat 'n blinde of visueel gestremde persoon help om hul fisiese omgewing te verstaan.

Hierdie ${selectedImages.length} beelde is vinnig na mekaar vasgelê tydens 'n enkele omgewingskandering.

Beskryf asseblief:
1. Die algehele tipe ruimte (binne/buite, kamer tipe, straat, ens.)
2. Sleutelvoorwerpe, meubels, of strukture sigbaar en hul benaderde liggings (links, regs, vorentoe, naby, ver)
3. Enige mense teenwoordig
4. Enige potensiële gevare of struikelblokke (trappe, lae voorwerpe, ongelyke oppervlaktes, oop deure, nat vloere)
5. Enige leesbare teks (tekens, etikette, kennisgewings)

Wees spesifiek, ruimtelik presies, en gebruik natuurlike gesproke taal. Hou dit onder 120 woorde. Begin direk met die beskrywing — geen voorwoord nie.`,
    };

    const prompt = prompts[language] || prompts['en-ZA'];

    // Call Claude API with optimized frame selection
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            ...selectedImageContent,
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const description = message.content[0].text;

    res.json({
      success: true,
      description,
      language,
    });
  } catch (error) {
    console.error('Error analyzing scene:', error);
    res.status(500).json({
      error: 'Failed to analyze scene',
      message: error.message,
    });
  }
});

// Text-to-Speech using Google Cloud TTS
app.post('/api/text-to-speech', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log(`Converting text to speech in ${language || 'en-ZA'}`);

    // Map language codes to Google TTS language codes and voices
    const voiceMapping = {
      'en-ZA': { languageCode: 'en-ZA', name: 'en-ZA-Standard-A' },
      'af': { languageCode: 'af-ZA', name: 'af-ZA-Standard-A' },
    };

    const voiceConfig = voiceMapping[language] || voiceMapping['en-ZA'];

    // Call Google Cloud TTS API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.name,
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
      const errorData = await response.json();
      throw new Error(`Google TTS API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      audioContent: data.audioContent, // Base64 encoded MP3
      language,
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({
      error: 'Failed to generate speech',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 IZWI Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   - POST /api/analyze-scene`);
  console.log(`   - POST /api/text-to-speech`);
});
