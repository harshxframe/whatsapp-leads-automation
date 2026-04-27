import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config("../../.env");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// GEMINI CLIENT
export async function geminiClient({
  model = "gemini-2.5-flash",
  chatHistory
}) {
  try {
    if (!Array.isArray(chatHistory)) {
      return null;
    }
    const res = await ai.models.generateContent({
      model,
      contents: chatHistory,
    });
    const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    return text;

  } catch (err) {
    console.error("Gemini Error:", err.message);
    return null;
  }
}