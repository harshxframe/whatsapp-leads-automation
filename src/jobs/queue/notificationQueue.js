import { Queue } from "bullmq";
import { configuration, redisConnection } from "../../config/redis";

const notificationQueue = new Queue("notification-queue", {
  connection: redisConnection,
  defaultJobOptions: configuration,
});

export { notificationQueue };
