import { getClientWithCache } from "../services/client.cache.service.js";
import { messageResponseParser } from "../services/whatsApp.service.js";
import Clients from "../models/Clients.js";

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

    } else {
      console.error("Message: ", isDataExtracted.message, "data: ", {});
      return;
    }
  } catch (error) {
    console.error("🔥 Webhook Error: ", error.message);
    return;
  }
};
