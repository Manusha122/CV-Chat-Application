import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiResponse {
  answer: string;
  confidence: number;
  sources: string[];
}

export async function generateContentWithGemini(prompt: string): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response generated from Gemini');
    }

    return {
      answer: generatedText,
      confidence: 0.9,
      sources: ['gemini_ai']
    };

  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error(`Gemini API error: ${error.response?.data?.error?.message || error.message}`);
  }
}
