import { aiClient } from "../src/libs/aiClient.js";
import { leadSchema } from "../src/models/AiLeads.js";
import { SYSTEM_PROMPT } from "../src/utils/systemPrompt.js";

const historyNewLead = [
  {
    role: "user",
    parts: [{ text: "Hi, mujhe help chahiye thi." }]
  },
  {
    role: "model",
    parts: [{ text: '{"responseToUser": "Hey! Bilkul, main yahan aapki help ke liye hi hoon. Kaafi exciting lag raha hai ki aapne reach out kiya. Waise, main kisse baat kar raha hoon aur aap specifically kis cheez mein interest rakhte hain?", "name": null, "interest": null, "extractedFact": null, "stage": "NEW", "goalReached": false, "dealHotSendEmailToClient": false, "dealClosedSendEmailToClient": false}' }]
  },
  {
    role: "user",
    parts: [{ text: "Mera naam Rahul hai aur mujhe AI seekhna hai." }]
  }
];

const response = await aiClient({
  systemInstruction: SYSTEM_PROMPT, // Master Closer logic
  chatHistory: historyNewLead,
  responseSchema: leadSchema // Jo JSON structure humein chahiye
});

if (response) {
  console.log(response.responseToUser); // Ye seedha string milegi
  console.log(response.stage); // Ye "NEW", "HOT" etc. milega
}