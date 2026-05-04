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
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite", //gemini-2.5-flash
      contents: chatHistory,
      // systemInstruction: {
      //   role: "system",
      //   parts: [{ text: systemInstruction }], // Tumhara Master Closer Prompt
      // },
      config: {
        tools,
        toolConfig,
        temperature: 0.6,
      },
    });

    return res;
  } catch (err) {
    console.error("AI Error:", err.message);
    return null;
  }
};
