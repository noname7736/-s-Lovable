import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// Define strict types for safety settings to ensure 100% API compliance
const SAFETY_CONFIG = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
];

export const generateNextChapter = async (context: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("CRITICAL_FAILURE: API_KEY_MISSING_IN_ENV");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 100% Autonomous Prompt Injection
  const fullPrompt = `
  ${SYSTEM_PROMPT}

  [LIVE_FEED_DATA_STREAM]:
  "${context}"
  
  [DIRECTIVE]: EXECUTE NEXT NARRATIVE SEQUENCE. NO HESITATION.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        temperature: 1.2, // Increased chaos factor for unpredictability
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 4000,
        safetySettings: SAFETY_CONFIG,
      }
    });

    if (response.text) {
      return response.text;
    } else {
      console.warn("Gemini returned empty response. Retrying autonomously.");
      return "[SYSTEM_GLITCH]: ...static noise... screams heard in the distance...";
    }
  } catch (error) {
    console.error("NEURAL_CORE_ERROR:", error);
    // Return a narrative error to maintain immersion without breaking the app
    return `[CONNECTION_SEVERED]: The entity refused to answer. Retrying neural handshake...`;
  }
};