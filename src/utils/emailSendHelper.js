import { getClosedLeadSubject, getLeadSubjectOnHot } from "./emailSubject.js";
import sendEmail from "../libs/emailService.js";
import { values } from "../config/values.js";
import { hotLeadTemplate, closedDealTemplate } from "./emailTamplates.js";
import logger from "../utils/logger.js";

//NOTIFICATION_TYPE> "ON_HOT" or "ON_CLOSED"

export const sendNotification = async (
  leadName,
  leadPhone,
  leadInterest,
  leadExtractedData,
  leadStage,
  clinetEmail,
  clientName,
  NOTIFICATION_TYPE,
) => {
  const adminEmail = values?.adminEmail;
  const adminName = values?.adminName;
  try {
    // now prapare the payload to send email
    // prapare email boy
    if (NOTIFICATION_TYPE === "ON_HOT") {
      const emailSubject = getLeadSubjectOnHot(leadInterest);
      const emailBody = hotLeadTemplate(
        leadName,
        leadPhone,
        leadInterest,
        leadExtractedData,
      );
      const sendEmailService = await sendEmail(
        adminEmail,
        adminName,
        clinetEmail,
        emailSubject,
        clientName,
        emailBody,
      );
      if (sendEmailService.success) {
        return true;
      } else {
        logger.error("Failed to send email", { metadata: sendEmailService });
        return false;
      }
    }

    if (NOTIFICATION_TYPE === "ON_CLOSED") {
      const emailSubject = getClosedLeadSubject(leadInterest);
      const emailBody = closedDealTemplate(
        leadName,
        leadPhone,
        leadInterest,
        leadExtractedData,
        leadStage,
      );
      const sendEmailService = await sendEmail(
        adminEmail,
        adminName,
        clinetEmail,
        emailSubject,
        clientName,
        emailBody,
      );
      if (sendEmailService.success) {
        return true;
      } else {
        logger.error("Failed to send email", { metadata: sendEmailService });
        return false;
      }
    }
    logger.error("Failed to identify email operation", { metadata: {} });
    return false;
  } catch (e) {
    logger.error("Failed to send email", { metadata: e });
    return false;
  }
};
