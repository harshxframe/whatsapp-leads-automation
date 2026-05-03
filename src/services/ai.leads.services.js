import { isMissing } from "../utils/fieldValidation.js";
import { updateCachedLead } from "./lead.cache.service.js";

export const handleLeadActions = async (data, cliendId, phone) => {
  try {
    let updateToCache = {};
    if (data.name) {
      updateToCache.name = data.name;
    }

    if (data.interest) {
      updateToCache.interest = data.interest;
      console.log("Update Interest:", data.interest);
    }

    if (data.extractedFact) {
      updateToCache.extractedFact = data.extractedFact;
      console.log("Save Extracted Data:", data.extractedFact);
    }

    if (data.stage) {
      updateToCache.stage = data.stage;
      console.log("Update Stage:", data.stage);
    }

    if (data.goalReached) {
      updateToCache.goalReached = data.goalReached;
      console.log("Goal Reached");
    }

    if (data.dealHotSendEmailToClient) {
      updateToCache.dealHotSendEmailToClient = String(
        data.dealHotSendEmailToClient,
      );
      console.log("Send HOT email");
    }

    if (data.dealClosedSendEmailToClient) {
      updateToCache.dealClosedSendEmailToClient = String(
        data.dealClosedSendEmailToClient,
      );
      console.log("Send CLOSED email");
    }

    await updateCachedLead(cliendId, phone, updateToCache);
    return true;

  } catch (e) {
    console.error("Service Error:", e.message);
    return false;
  }
};
