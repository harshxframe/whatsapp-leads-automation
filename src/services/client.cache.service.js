import { redis } from "../config/redis.js";

const TTL = 60 * 60 * 10; // 10 hours

// Flatten function (NO nested object storage)
const flattenClient = (client) => ({
  _id:client._id,
  ownerName: client.ownerName,
  email: client.email,
  businessName: client.businessName,
  industry: client.industry,

  businessContext: client.businessContext || "",
  businessDetails: client.businessDetails || "",
  services: client.services || "",

  // store nested as string (controlled)
  aiTone: client.aiSettings?.tone || "professional",
  aiLanguage: client.aiSettings?.language || "English",
  aiResponseStyle: client.aiSettings?.responseStyle || "short",

  conversionGoal: client.conversionGoal,

  whatsappNumberID: client.whatsapp?.numberID,

  totalMessages: String(client.analytics?.totalMessages || 0),
  leadsGenerated: String(client.analytics?.leadsGenerated || 0),
  conversions: String(client.analytics?.conversions || 0),

  googleSheetID: client.automation?.googleSheetID || "",
  notifyOwner: String(client.automation?.notifyOwner ?? true),

  active: String(client.active ?? true),
  adminAllowed: String(client.adminAllowed ?? false),
});

// 1. CREATE / SET (cache client)
export const cacheClient = async (client) => {
  const numberID = client.whatsapp?.numberID;
  if (!numberID) throw new Error("Missing numberID");

  const key = `client:number:${numberID}`;

  const flatData = flattenClient(client);

  await redis.hset(key, flatData);
  await redis.expire(key, TTL);

  return true;
};

// 2. GET (by numberID)
export const getCachedClient = async (numberID) => {
  const key = `client:number:${numberID}`;

  const data = await redis.hgetall(key);

  if (!data || Object.keys(data).length === 0) return null;

  return {
    _id:data._id,
    ownerName: data.ownerName,
    email: data.email,
    businessName: data.businessName,
    industry: data.industry,

    businessContext: data.businessContext,
    businessDetails: data.businessDetails,
    services: data.services,

    aiSettings: {
      tone: data.aiTone,
      language: data.aiLanguage,
      responseStyle: data.aiResponseStyle,
    },

    conversionGoal: data.conversionGoal,

    whatsapp: {
      numberID: data.whatsappNumberID,
    },

    analytics: {
      totalMessages: Number(data.totalMessages),
      leadsGenerated: Number(data.leadsGenerated),
      conversions: Number(data.conversions),
    },

    automation: {
      googleSheetID: data.googleSheetID,
      notifyOwner: data.notifyOwner === "true",
    },

    active: data.active === "true",
    adminAllowed: data.adminAllowed === "true",
  };
};

// 3. DELETE (by numberID)
export const deleteCachedClient = async (numberID) => {
  const key = `client:number:${numberID}`;
  await redis.del(key);
};

// Get Client(DB and Redis)
export const getClientWithCache = async (numberID, ClientModel) => {
  try {
    let client = await getCachedClient(numberID);

    if (client) {
      console.log("Cache HIT");
      return client;
    }

    console.log("Cache MISS");

    client = await ClientModel.findOne({
      "whatsapp.numberID": numberID,
    }).lean();

    if (!client) return null;

    await cacheClient(client);

    return client;
  } catch (error) {
    console.log("Error in getClientWithCache:", error.message);
    return null; // safe fallback
  }
};
