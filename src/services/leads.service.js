import Leads from "../models/Leads.js";
import { serviceResponse } from "../utils/serviceResponseBody.js";
import { getClientId } from "./client.service.js";
import { getExpireDate } from "../utils/getExpireDate.js";

// CREATE LEAD
export const createLead = async (senderNumber, clientId) => {
  try {
    // const clientId = await getClientId(clientNumber);
    if (!clientId) return serviceResponse(false, "ClientID not found", {});

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
    if (!clientId) return serviceResponse(false, "Client not found", {});

    const lead = await Leads.findOne({ clientId, phone: senderNumber });

    if (!lead) return serviceResponse(false, "Lead not found", {});

    return serviceResponse(true, "Lead found", lead);
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};

export const updateLead = async (senderNumber, clientId, updateObj) => {
  try {
    if (!updateObj || Object.keys(updateObj).length === 0) {
      return serviceResponse(false, "No updates find to update", {});
    }
    const updateLeadDB = await Leads.findOneAndUpdate(
      { clientId, phone: senderNumber },
      {
        $set: updateObj,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updateLeadDB) {
      return serviceResponse(false, "Lead not found", {});
    }
    return serviceResponse(true, "Lead update successfully", updateLeadDB);
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};

export const updateLeadChatHistroy = async (
  senderNumber,
  clientId,
  history,
) => {
  try {
    if (history.length === 0) {
      return serviceResponse(false, "History items not found", {});
    }
    const updateHistory = await Leads.findOneAndUpdate(
      {
        clientId,
        phone: senderNumber,
      },
      {
        $push: {
          chatHistory: {
            $each: history,
            $slice: -15,
          },
        },
      },
      {
        new: true,
      },
    );
    if (!updateHistory) {
      return serviceResponse(false, "Failed to update chat history", {});
    }
    return serviceResponse(true, "Chat history updated successfully", {});
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};

export const updateLeadsExtractedFact = async (senderNumber, clientId, facts) => {
  try {
    console.log("Getted fact: "+facts);
    const updated = await Leads.findOneAndUpdate(
      { 
        clientId, 
        phone: senderNumber,
        extractedData: { $ne: facts } // Only update if the fact doesn't already exist (simulates $addToSet)
      },
      {
        $push: {
          extractedData: {
            $each: [facts],
            $slice: -15, // Keeps only the last 15 items
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return serviceResponse(false, "Fact already exists or Lead not found", {});
    }

    return serviceResponse(true, "Extracted facts updated and trimmed", updated);
  } catch (e) {
    return serviceResponse(false, e.message || "DB ERROR", {});
  }
};
