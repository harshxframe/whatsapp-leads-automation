import { Queue } from "bullmq";
import { configuration, redisConnection } from "../../config/redis.js";

const anylaticsQueue = new Queue("anylatics-DB-queue", {
  connection: redisConnection,
  defaultJobOptions: configuration,
});

export { anylaticsQueue };
