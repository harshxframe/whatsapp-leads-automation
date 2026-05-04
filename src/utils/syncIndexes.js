import Clients from "../models/Clients.js";
import Leads from "../models/Leads.js";
import DailyStats from "../models/DailyStats.js";

export const syncAllIndex = async () => {
  await Clients.syncIndexes();
  await Leads.syncIndexes();
  await DailyStats.syncIndexes();
  console.log("DB indexes synced successfully");
};
