import { generateAIResponse } from "../libs/aiClient.js";
import { leadFunction } from "../ai/leadFunction.js";
import { handleLeadActions } from "../services/ai.leads.services.js";

export const processLeadMessage = async (
  chatHistory,
  systemInstruction,
  _id,
  sendBy,
  lead,
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

  const { usageMetadata } = res;
  // Logic: Output tokens mein 'thoughts' (reasoning) ko include karna best practice hai
  const inputToken = usageMetadata ? usageMetadata.promptTokenCount : 0;
  const outputToken = usageMetadata
    ? usageMetadata.candidatesTokenCount +
      (usageMetadata.thoughtsTokenCount || 0)
    : 0;
  const totalTokens = usageMetadata ? usageMetadata.totalTokenCount : 0;

  if (!call) {
    console.log("No function call, AI failure");
    return null;
  }

  const data = call.args;

  // RUN IN BACKGROUND
  handleLeadActions(data, _id, sendBy, lead)
    .then(() => console.log("Actions done"))
    .catch((err) => console.error("Action error:", err));

  // immediate response
  return {
    userResponse: data.responseToUser,
    inputToken,
    outputToken,
    totalTokens,
  };
};
