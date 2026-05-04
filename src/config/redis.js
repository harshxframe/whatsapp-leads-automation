import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};
 
const workerConcurreny = 5;

const redis = new Redis({
  host: redisConnection.host,
  port: redisConnection.port,

  retryStrategy(times) {
    console.log(`Retry attempt: ${times}`);
    if (times > 5) {
      console.log("Redis max retries reached");
      return null;
    }
    return Math.min(times * 100, 2000);
  },
});

const configuration = {
  attempts: 1,
  backoff: { type: "exponential", delay: 2000 },
  removeOnComplete: true,
  removeOnFail: true,
}; // configuration for Queue Worker

let redisListenersAttached = false;

const onRedis = () => {
  if (redisListenersAttached) return;
  redisListenersAttached = true;

  redis.on("connect", () => {
    //logger.info("Redis connecting...");
    console.log("Redis Connecting...");
  });

  redis.on("ready", () => {
    // logger.info("Redis connected");
    console.log("Redis Connected");
  });

  redis.on("error", (err) => {
    //  logger.error("Redis error", { error: err.message });
    console.log("Redis Error");
  });

  redis.on("reconnecting", () => {
    //  logger.warn("Redis reconnecting...");
    console.log("Redis reConnecting...");
  });
};

export { onRedis, redis, redisConnection, configuration, workerConcurreny };
