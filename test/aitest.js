import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();



const ai = new GoogleGenAI({
  apiKey: "XXXXXXXxxxxxxxXXXXXXXXXXXxxxxxxxXXXXX"
});


// GEMINI CLIENT
export async function geminiClient({
  model = "gemini-2.5-flash",
  content,
  role = "user"
}) {
  try {
    const res = await ai.models.generateContent({
      model,
      contents: [{ role, parts: [{ text: "content" }] }],
    });

    const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return text;

  } catch (err) {
    console.error("Gemini Error:", err.message);
    return null;
  }
}

const a = await geminiClient({model:"gemini-2.5-flash"});
console.log(a);
