import DailyStats from "../models/DailyStats.js";
import { serviceResponse } from "../utils/serviceResponseBody.js";
import { getStartOfDay } from "../utils/getStartOfDay.js";

// INCREMENT NEW LEAD
export const incrementDailyLead = async (clientId) => {
  try {
    const date = getStartOfDay();

    const updated = await DailyStats.findOneAndUpdate(
      { clientId, date },
      {
        $inc: { "metrics.newLeads": 1 },
      },
      { upsert: true, new: true },
    );

    return serviceResponse(true, "Lead incremented", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// INCREMENT CONVERSION
export const incrementDailyConversion = async (clientId) => {
  try {
    const date = getStartOfDay();

    const updated = await DailyStats.findOneAndUpdate(
      { clientId, date },
      {
        $inc: { "metrics.conversions": 1 },
      },
      { upsert: true, new: true },
    );

    return serviceResponse(true, "Conversion incremented", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// INCREMENT MESSAGES + TOKENS
export const incrementMessagesAndTokens = async (clientId, tokens = 0, inputToken = 0, outputToken = 0) => {
  try {
    const date = getStartOfDay();

    const updated = await DailyStats.findOneAndUpdate(
      { clientId, date },
      {
        $inc: {
          "metrics.messagesHandled": 2,
          "metrics.tokenUsed": tokens,
          "metrics.inputToken": inputToken,
          "metrics.outputToken": outputToken,
        },
      },
      { upsert: true, new: true },
    );

    return serviceResponse(true, "Message stats updated", updated);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};

// GET STATS (RANGE QUERY)
export const getClientStats = async (clientId, startDate, endDate) => {
  try {
    const start = getStartOfDay(new Date(startDate));
    const end = getStartOfDay(new Date(endDate));

    const stats = await DailyStats.find({
      clientId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    return serviceResponse(true, "Stats fetched", stats);
  } catch (e) {
    return serviceResponse(false, e.message, {});
  }
};
