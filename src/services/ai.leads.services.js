import { cli } from "winston/lib/winston/config/index.js";
import { leadsDbQueue } from "../jobs/queue/dbQueue.js";
import { isMissing } from "../utils/fieldValidation.js";
import {
  updateCachedLead,
  updateExtractedFacts,
} from "./lead.cache.service.js";
import { incrementDailyConversion } from "./dailyAnalytics.service.js";
import { sendNotification } from "../utils/emailSendHelper.js";

export const handleLeadActions = async (
  data,
  cliendId,
  phone,
  lead,
  ownerName,
  email,
) => {
  try {
    let updateToCache = {
      metaData: { clientId: cliendId, senderNumber: phone },
    };

    if (data.name) {
      if (lead.name !== data.name) {
        updateToCache.name = data.name;
      }
    }

    if (data.interest) {
      if (lead.interest !== data.interest) {
        updateToCache.interest = data.interest;
      }
    }

    if (data.extractedFact) {
      if (!lead.extractedData.includes(data.extractedFact)) {
        updateToCache.extractedData = data.extractedFact;
      }
    }

    if (data.stage) {
      if (lead.stage !== data.stage) {
        updateToCache.stage = data.stage;
      }
    }

    if (data.goalReached) {
      if (lead.goalReached !== data.goalReached) {
        updateToCache.goalReached = data.goalReached;
        incrementDailyConversion(cliendId)
          .then(() => {})
          .catch((e) => {});
      }
    }

    if (data.dealHotSendEmailToClient) {
      if (
        String(data.dealHotSendEmailToClient) !== String(lead.isEmailSentOnHot)
      ) {
        updateToCache.isEmailSentOnHot = String(data.dealHotSendEmailToClient);
        //Send Notifcation when lead seems hot
        sendNotification(
          lead.name || data.name,
          lead.phone,
          lead.interest || data.interest,
          lead.extractedData,
          lead.stage || data.stage,
          email,
          ownerName,
          "ON_HOT",
        )
          .then(() => {})
          .catch((e) => {});
      }
    }

    if (data.dealClosedSendEmailToClient) {
      if (
        String(data.dealClosedSendEmailToClient) !==
        String(lead.isEmailSentOnClosed)
      ) {
        updateToCache.isEmailSentOnClosed = String(
          data.dealClosedSendEmailToClient,
        );
        sendNotification(
          lead.name || data.name,
          lead.phone,
          lead.interest || data.interest,
          lead.extractedData,
          lead.stage || data.stage,
          email,
          ownerName,
          "ON_CLOSED",
        )
          .then(() => {})
          .catch((e) => {});
      }
    }

    if (updateToCache && Object.keys(updateToCache).length > 0) {
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
