import axios from "axios";
import { serviceResponse } from "../utils/serviceResponseBody.js";

export const markMessageAsRead = async (phoneId, messageId, accessToken) => {
  try {
    const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return true;
  } catch (error) {
    // Ise log zaroor karna taaki debugging mein asani ho
    console.error(
      "Error marking message as read:",
      error.response?.data || error.message,
    );
    return false;
  }
};

export const messageResponseParser = (body) => {
  try {
    // 2. Check karo ki ye message event hai ya kuch aur
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      // 3. Agar messages array exists karta hai, matlab naya message hai
      if (value?.messages && value.messages[0]) {
        const message = value.messages[0];
        const contact = value.contacts?.[0]; // Contacts array se user ki profile details milti hain
        const metadata = value.metadata;

        // --- CRITICAL DATA EXTRACTION ---
        const from = message.from; // Student ka WhatsApp number (e.g., 919876...)
        const messageId = message.id; // Mark as Read ke liye zaroori
        const messageText = message.text?.body; // Student ka message content
        const messageTimestamp = message.timestamp; // Database mein order maintain karne ke liye
        const userName = contact?.profile?.name || "User"; // Student ka display name
        const phoneID = metadata.phone_number_id; // Aapke client ke number ki unique ID
        const wabaID = entry.id; // WhatsApp Business Account (WABA) ki ID

        // --- LOGGING FOR DEBUGGING ---
        // console.log(`\n📩 New Message from ${userName} (${from})`);
        // console.log(`💬 Content: "${messageText}"`);
        // console.log(`🆔 Message ID: ${messageId}`);
        // console.log(`🤖 Bot Phone ID: ${phoneID}`);
        if (messageText == undefined) {
          return serviceResponse(false, "No new message", {});
        } else {
          return serviceResponse(true, "Data extraction successfull", {
            senderUserName: userName,
            sendBy: from,
            content: messageText,
            messageId: messageId,
            botPhoneId: phoneID,
          });
        }
      } else {
        return serviceResponse(false, "No new message", {});
      }
    } else {
      return serviceResponse(false, "Unexpected response", {});
    }
  } catch (e) {
    console.log(`ERROR while whatsapp response parsing ${e}`);
    return serviceResponse(false, "Error in Whatsapp response parsing", {});
  }
};

/**
 * Send a standard text message to a user
 */
export const sendWhatsAppMessage = async (
  phoneId,
  recipientNumber,
  messageText,
  accessToken,
) => {
  try {
    const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientNumber,
      type: "text",
      text: {
        preview_url: false,
        body: messageText,
      },
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message,
    );
    throw error; // Throwing so you can handle it in the worker
  }
};

/**
 * NOTE: Typing Indicator is NOT natively supported in WhatsApp Cloud API as of now.
 * However, professional bots often use "Mark as Read" to show the user that
 * the message has been received and is being processed.
 */
export const simulateTypingEffect = (responseText) => {
  const variance = Math.floor(Math.random() * 10); // Random time
  const msPerChar = 35 + variance;
  const baseDelay = 600;
  const maxDelay = 4500;

  const calculatedDelay = Math.min(
    baseDelay + responseText.length * msPerChar,
    maxDelay,
  );

  return new Promise((resolve) => setTimeout(resolve, calculatedDelay));
};

export const sendTypingIndicator = async (
  recipientId, // Note: Ye function wese bhi status update ke liye messageId leta hai
  messageId,
  accessToken,
  phoneNumberId,
) => {
  try {
    // Make sure your version matches the one in your Meta Dashboard (e.g., v25.0)
    const url = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        status: "read", // Status update
        message_id: messageId, // Specific message ID
        typing_indicator: {
          type: "text", // Documentation format
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    return true;
  } catch (error) {
    console.error(
      "Error sending typing indicator:",
      error.response?.data || error.message,
    );
    return false;
  }
};
