import { redis } from "../config/redis.js";
import { getLeadKey } from "../utils/getLeadKey.js";
import { createLead } from "./leads.service.js";

const TTL = 60 * 60 * 24; // 24 hours

// SAVE LEAD
export const cacheLead = async (lead) => {
  try {
    const key = getLeadKey(lead.clientId, lead.phone);

    // minimal flatten (store only useful fields)
    const data = {
      clientId: String(lead.clientId),
      phone: lead.phone,
      name: lead.name || "",
      interest: lead.interest || "",
      stage: lead.stage,
      goalReached: String(lead.goalReached),

      isBotActive: String(lead.isBotActive),
      isEmailSentOnHot: String(lead.isEmailSentOnHot),
      isEmailSentOnClosed: String(lead.isEmailSentOnClosed),

      lastInteraction: lead.lastInteraction?.toISOString(),

      extractedData: JSON.stringify(lead.extractedData || []),
      chatHistory: JSON.stringify(lead.chatHistory || []),
    };

    await redis.hset(key, data);
    await redis.expire(key, TTL);

    return true;
  } catch (e) {
    console.log("Redis cacheLead error:", e.message);
    return false;
  }
};

// GET LEAD
export const getCachedLead = async (clientId, phone) => {
  try {
    const key = getLeadKey(clientId, phone);

    const data = await redis.hgetall(key);

    if (!data || Object.keys(data).length === 0) return null;

    return {
      clientId: data.clientId,
      phone: data.phone,
      name: data.name,
      interest: data.interest,
      stage: data.stage,
      goalReached: data.goalReached === "true",

      isBotActive: data.isBotActive === "true",
      isEmailSentOnHot: data.isEmailSentOnHot === "true",
      isEmailSentOnClosed: data.isEmailSentOnClosed === "true",

      lastInteraction: new Date(data.lastInteraction),

      extractedData: JSON.parse(data.extractedData || "[]"),

      chatHistory: JSON.parse(data.chatHistory || "[]"),
    };
  } catch (e) {
    console.log("Redis getCachedLead error:", e.message);
    return null;
  }
};

// DELETE LEAD
export const deleteCachedLead = async (clientId, phone) => {
  try {
    const key = getLeadKey(clientId, phone);
    await redis.del(key);
    return true;
  } catch (e) {
    console.log("Redis delete error:", e.message);
    return false;
  }
};

// UPDATE LEAD
export const updateCachedLead = async (clientId, phone, updateData) => {
  try {
    const key = getLeadKey(clientId, phone);
    let tempUpdateObj = {};
    for (let key in updateData) {
      if (key !== "extractedData") {
        tempUpdateObj[key] = updateData[key];
      }
    }

    await redis.hset(key, tempUpdateObj);
    await redis.expire(key, TTL);

    return true;
  } catch (e) {
    console.log("Redis delete error:", e.message);
    return false;
  }
};

//UPDATE EXTRACTED FACTS
export const updateExtractedFacts = async (clientId, phone, newFact) => {
  try {
    const key = getLeadKey(clientId, phone);

    const exsitingEF = await redis.hget(key, "extractedData");
    let facts = exsitingEF ? JSON.parse(exsitingEF) : [];

    if (!facts.includes(newFact)) {
      facts.push(newFact);
    }

    facts = facts.slice(-10);

    await redis.hset(key, { extractedData: JSON.stringify(facts) });

    return true;
  } catch (e) {
    console.log("Redis update error:", e.message);
    return false;
  }
};

//UPDATE AND SAVE CHAT HISTORY
export const saveChatHistory = async (clientId, phone, chats) => {
  // Chat is an object {"role":.., "content":...}
  try {
    const key = getLeadKey(clientId, phone);
    const history = await redis.hget(key, "chatHistory");

    let tempHistory = history ? JSON.parse(history) : [];

    tempHistory.push(...chats);
    tempHistory = tempHistory.slice(-7);

    await redis.hset(key, { chatHistory: JSON.stringify(tempHistory) });
    return true;
  } catch (e) {
    console.log("Redis chat histry update error:", e.message);
    return false;
  }
};

// UPSERT (BEST PRACTICE)
export const getLeadWithCache = async (clientId, phone, LeadModel) => {
  try {
    // 1. Redis check
    let lead = await getCachedLead(clientId, phone);
    console.log("Leads cache cliendId" + clientId);
    console.log("Leads cache phone" + phone);

    if (lead) {
      console.log("Lead Cache HIT");
      return lead;
    }

    console.log("Lead Cache MISS");

    // 2. DB fetch
    //  lead = await LeadModel.findOne({ clientId, phone }).lean();
    lead = await createLead(phone, clientId);
    console.log(lead);
    if (!lead.success) return null;

    // 3. Save to Redis
    await cacheLead(lead.data);

    return lead.data;
  } catch (e) {
    console.log("Redis fallback error:", e.message);
    return null;
  }
};

// 1. After DB update → invalidate cache
// await deleteCachedLead(clientId, phone);

// 2. Always use cache wrapper
// const lead = await getLeadWithCache(clientId, phone, Leads);
