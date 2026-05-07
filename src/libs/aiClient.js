import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async ({
  chatHistory,
  tools,
  toolConfig,
  systemInstruction,
}) => {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory,
        config: {
          tools,
          toolConfig,
          temperature: 0.6,
        },
      });

      if (res) return res;

      console.warn(`Attempt ${attempt}: Received null response. Retrying...`);
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === MAX_RETRIES) return null;
    }
  }
  return null;
};
