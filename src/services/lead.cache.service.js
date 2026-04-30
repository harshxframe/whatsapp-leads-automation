import { redis } from "../config/redis.js";
import { getLeadKey } from "../utils/getLeadKey.js";


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

      extractedData: JSON.stringify(
        Object.fromEntries(lead.extractedData || [])
      ),

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

      extractedData: new Map(
        Object.entries(JSON.parse(data.extractedData || "{}"))
      ),

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

// UPSERT (BEST PRACTICE)
export const getLeadWithCache = async (
  clientId,
  phone,
  LeadModel
) => {
  try {
    // 1. Redis check
    let lead = await getCachedLead(clientId, phone);

    if (lead) {
      console.log("⚡ Lead Cache HIT");
      return lead;
    }

    console.log("🐢 Lead Cache MISS");

    // 2. DB fetch
    lead = await LeadModel.findOne({ clientId, phone }).lean();

    if (!lead) return null;

    // 3. Save to Redis
    await cacheLead(lead);

    return lead;
  } catch (e) {
    console.log("Redis fallback error:", e.message);
    return null;
  }
};



// 1. After DB update → invalidate cache
// await deleteCachedLead(clientId, phone);

// 2. Always use cache wrapper
// const lead = await getLeadWithCache(clientId, phone, Leads);