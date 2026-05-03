import { getClientWithCache } from "../services/client.cache.service.js";
import { messageResponseParser } from "../services/whatsApp.service.js";
import Clients from "../models/Clients.js";
import {
  getLeadWithCache,
  saveChatHistory,
} from "../services/lead.cache.service.js";
import { isMissing } from "../utils/fieldValidation.js";
import Leads from "../models/Leads.js";
import { SYSTEM_PROMPT } from "../utils/systemPrompt.js";
import { historyNormalizer } from "../utils/chatHistoryNormiliser.js";
import { processLeadMessage } from "../utils/leadHandler.js";

export const whatsappHandShake = async (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Check karo ki Meta wahi token bhej raha hai jo tumne .env mein dala hai
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("Webhook Verified! Handshake Successful.");
      return res.status(200).send(challenge); // Meta ko challenge waapis bhejna zaroori hai
    } else {
      console.log("Verification Failed. Tokens don't match.");
      return res.sendStatus(403);
    }
  } catch (e) {
    console.log("Verification Failed. Tokens don't match. ERROR: " + e.message);
    return res.sendStatus(403);
  }
};

export const whatsappWebHook = async (req, res) => {
  try {
    const body = req.body;
    res.sendStatus(200); // Send success response to WhatsApp

    const isDataExtracted = messageResponseParser(body);
    if (isDataExtracted.success) {
      const { senderUserName, sendBy, content, messageId, botPhoneId } =
        isDataExtracted.data;

      const client = await getClientWithCache(botPhoneId, Clients);
      // 1. Existence check
      if (!client) {
        console.log("Client not found");
        return;
      }

      // 2. Business validation
      if (!client.active) {
        console.log("Client inactive");
        return;
      }

      if (!client.adminAllowed) {
        console.log("Client not approved by admin");
        return;
      }

      //Get the lead data too here first
      const {
        ownerName,
        email,
        businessName,
        industry,
        businessContext,
        businessDetails,
        services,
        aiSettings,
        conversionGoal,
        automation,
        _id,
      } = client;

      if (
        isMissing(ownerName) ||
        isMissing(email) ||
        isMissing(businessName) ||
        isMissing(industry) ||
        isMissing(businessContext) ||
        isMissing(businessDetails) ||
        isMissing(services) ||
        isMissing(aiSettings) ||
        isMissing(conversionGoal) ||
        isMissing(automation) ||
        isMissing(_id)
      ) {
        return console.log("Client's database not satisfied");
      }

      //mark message read here....

      const lead = await getLeadWithCache(_id, sendBy, Leads);
      // 1. Existence check
      if (!lead) {
        console.log("Lead not found");
        return;
      }

      // 2. Business validation
      if (!lead.isBotActive) {
        console.log("Agent inactive");
        return;
      }

      const {
        name,
        phone,
        interest,
        extractedData,
        stage,
        goalReached,
        isEmailSentOnHot,
        isEmailSentOnClosed,
        chatHistory,
        lastInteraction,
      } = lead;

      // finaly we have here all required data to take next step.
      // Now we will move it to gemini, Prepare a tampalate
      const systemInstruction_sy = SYSTEM_PROMPT(
        businessName,
        name,
        interest,
        extractedData,
        stage,
        conversionGoal,
        aiSettings.tone,
        aiSettings.responseStyle,
        aiSettings.language,
        businessContext,
        businessDetails,
        ownerName,
        services,
        industry,
      );
      let finalChatHistory = [];

      // system Instruction
      // chatHistory
      if (chatHistory.length === 0) {
        finalChatHistory.push(
          ...historyNormalizer([{ role: "user", content: content }]),
        );
      } else {
        finalChatHistory.push(...historyNormalizer(chatHistory));
        finalChatHistory.push(
          ...historyNormalizer([{ role: "user", content: content }]),
        );
      }
      finalChatHistory.unshift(
        ...historyNormalizer([
          { role: "model", content: systemInstruction_sy },
        ]),
      );
      //collecting active chat object of user.
      const latestUserChatObject = { role: "user", content: content };
      const userResponse = await processLeadMessage(
        finalChatHistory,
        systemInstruction_sy,
        _id,
        sendBy,
      );

      if (userResponse) {
        const aiResponseObject = { role: "model", content: userResponse };
        await saveChatHistory(_id, sendBy, [
          latestUserChatObject,
          aiResponseObject,
        ]);
        // Now we succfully saved chat histoey now have to work to update extracted feilds and then update field in cache.
        // Then move on to to send to workers to save in DBs.

        return console.log("AI Response: " + userResponse);
      }
      return console.log("AI Response ERROR " + userResponse);
    } else {
      console.error("Message: ", isDataExtracted.message, "data: ", {});
      return;
    }
  } catch (error) {
    console.error("Webhook Error: ", error.message);
    return;
  }
};
