import { generateAIResponse } from "../libs/aiClient.js";
import { leadFunction } from "../ai/leadFunction.js";
import { handleLeadActions } from "../services/ai.leads.services.js";

export const processLeadMessage = async (
  chatHistory,
  systemInstruction,
  _id,
  sendBy,
) => {
  const res = await generateAIResponse({
    chatHistory,
    systemInstruction,
    tools: [{ functionDeclarations: [leadFunction] }],

    toolConfig: {
      functionCallingConfig: {
        mode: "ANY",
        allowedFunctionNames: ["handleLead"],
      },
    },
  });

  const call = res?.functionCalls?.[0];

  if (!call) {
    console.log("No function call, AI failure");
    return null;
  }

  const data = call.args;

  // RUN IN BACKGROUND
  handleLeadActions(data, _id, sendBy)
    .then(() => console.log("Actions done"))
    .catch((err) => console.error("Action error:", err));

  // immediate response
  return data.responseToUser;
};
