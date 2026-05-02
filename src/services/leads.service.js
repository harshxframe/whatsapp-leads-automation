import Leads from "../models/Leads.js";
import {serviceResponse} from "../utils/serviceResponseBody.js";
import { getClientId } from "./client.service.js";
import { getExpireDate } from "../utils/getExpireDate.js";


// CREATE LEAD
export const createLead = async (senderNumber, clientId) => {
  try {
    // const clientId = await getClientId(clientNumber);
    if (!clientId)
      return serviceResponse(false, "ClientID not found", {});

    let lead = await Leads.findOne({ clientId, phone: senderNumber });

    if (lead) {
      return serviceResponse(true, "Lead already exists", lead);
    }

    const newLead = await Leads.create({
      clientId,
      phone: senderNumber,
      expireAt: getExpireDate(),
    });

    return serviceResponse(true, "Lead created", newLead);
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};

// GET LEAD
export const getLead = async (senderNumber, clientNumber) => {
  try {
    const clientId = await getClientId(clientNumber);
    if (!clientId)
      return serviceResponse(false, "Client not found", {});

    const lead = await Leads.findOne({ clientId, phone: senderNumber });

    if (!lead) return serviceResponse(false, "Lead not found", {});

    return serviceResponse(true, "Lead found", lead);
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};

// UPDATE NAME
export const updateLeadName = async (clientId, phone, name) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { name } },
      { new: true }
    );

    if (!updated)
      return serviceResponse(false, "Lead not found", {});

    return serviceResponse(true, "Name updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// UPDATE INTEREST
export const updateLeadInterest = async (clientId, phone, interest) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { interest } },
      { new: true }
    );

    return serviceResponse(true, "Interest updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// UPDATE STAGE
export const updateLeadStage = async (clientId, phone, stage) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { stage } },
      { new: true }
    );

    return serviceResponse(true, "Stage updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// GOAL REACHED
export const updateGoalReached = async (clientId, phone, value) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { goalReached: value } },
      { new: true }
    );

    return serviceResponse(true, "Goal updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

//EXTRACTED DATA (MAX 15)
export const updateExtractedData = async (
  clientId,
  phone,
  key,
  value
) => {
  try {
    const lead = await Leads.findOne({ clientId, phone });

    if (!lead)
      return serviceResponse(false, "Lead not found", {});

    const data = lead.extractedData || new Map();

    if (!data.has(key) && data.size >= 15) {
      return serviceResponse(false, "Max extractedData limit reached", {});
    }

    data.set(key, value);

    lead.extractedData = data;
    await lead.save();

    return serviceResponse(true, "Extracted data updated", lead);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// CHAT HISTORY (MAX 15)
export const chatHistoryPush = async (
  clientId,
  phone,
  text,
  role
) => {
  try {
    const lead = await Leads.findOne({ clientId, phone });

    if (!lead)
      return serviceResponse(false, "Lead not found", {});

    const history = lead.chatHistory || [];

    if (history.length >= 15) {
      history.shift(); // remove oldest
    }

    history.push({ text, role });

    lead.chatHistory = history;
    await lead.save();

    return serviceResponse(true, "Chat updated", lead);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// BOT ACTIVE
export const updateBotActive = async (clientId, phone, value) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { isBotActive: value } },
      { new: true }
    );

    return serviceResponse(true, "Bot status updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

//LAST INTERACTION + TTL
export const updateLastIntrectionAndExpire = async (
  clientId,
  phone
) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      {
        $set: {
          lastInteraction: new Date(),
          expireAt: getExpireDate(),
        },
      },
      { new: true }
    );

    return serviceResponse(true, "Interaction updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// EMAIL FLAGS
export const updateEmailOnHot = async (clientId, phone, value) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { isEmailSentOnHot: value } },
      { new: true }
    );

    return serviceResponse(true, "Hot email flag updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

export const updateEmailOnClose = async (clientId, phone, value) => {
  try {
    const updated = await Leads.findOneAndUpdate(
      { clientId, phone },
      { $set: { isEmailSentOnClosed: value } },
      { new: true }
    );

    return serviceResponse(true, "Close email flag updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};