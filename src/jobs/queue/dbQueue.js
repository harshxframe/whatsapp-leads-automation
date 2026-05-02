import { Queue } from "bullmq";
import { redisConnection, configuration } from "../../config/redis.js";

const leadsDbOperation = new Queue("leads-DB-queue", {
  connection: redisConnection,
  defaultJobOptions: configuration,
});

export { leadsDbOperation };
