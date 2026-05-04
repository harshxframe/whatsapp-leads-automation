import { Queue } from "bullmq";
import { redisConnection, configuration } from "../../config/redis.js";

const leadsDbQueue = new Queue("leads-DB-queue", {
  connection: redisConnection,
  defaultJobOptions: configuration,
});

export { leadsDbQueue };
