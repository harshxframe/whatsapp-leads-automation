import { cli } from "winston/lib/winston/config/index.js";
import { leadsDbQueue } from "../jobs/queue/dbQueue.js";
import { isMissing } from "../utils/fieldValidation.js";
import {
  updateCachedLead,
  updateExtractedFacts,
} from "./lead.cache.service.js";

export const handleLeadActions = async (data, cliendId, phone) => {
  try {
    let updateToCache = {
      metaData: { clientId: cliendId, senderNumber: phone },
    };

    if (data.name) {
      updateToCache.name = data.name;
      console.log("Update Name:", data.name);
    }

    if (data.interest) {
      updateToCache.interest = data.interest;
      console.log("Update Interest:", data.interest);
    }

    if (data.extractedFact) {
      updateToCache.extractedData = data.extractedFact;
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

    if (updateToCache) {
      await updateCachedLead(cliendId, phone, updateToCache); // To publish in cache for speed
      await leadsDbQueue.add("perform DB leads DB operations", updateToCache); // To publish updated in DB in worker
    }
    if (updateToCache.extractedData) {
      await updateExtractedFacts(cliendId, phone, updateToCache.extractedData); // Top publish in cache
    }
    return true;
  } catch (e) {
    console.error("Service Error:", e.message);
    return false;
  }
};
