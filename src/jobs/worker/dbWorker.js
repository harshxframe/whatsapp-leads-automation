import mongoose from "mongoose";
import { redisConnection, workerConcurreny } from "../../config/redis.js";
import { Worker } from "bullmq";
import logger from "../../utils/logger.js";
import { withTimeout } from "../../utils/timeOutHandler.js";
import {
  updateLead,
  updateLeadChatHistroy,
  updateLeadsExtractedFact,
} from "../../services/leads.service.js";
import { isMissing } from "../../utils/fieldValidation.js";
import { env } from "../../config/env.js";
import { toBool } from "../../utils/boolValidator.js";

const DBConnectionUrl = env.DB_URL;
// 1. Register listeners ONCE at the top level
mongoose.connection.on("connected", () =>
  logger.info("DB connection successful with DB worker"),
);
mongoose.connection.on("error", (err) =>
  logger.error("Error in DB connection in DB worker", { error: err.message }),
);
mongoose.connection.on("disconnected", () =>
  logger.info("DB disconnected with DB worker"),
);

const DB_TIMEOUT = 15000;
async function dbWorker() {
  try {
    await mongoose.connect(DBConnectionUrl, {
      maxPoolSize: 10, // Adjust this based on your workerConcurreny
    });

    const worker = new Worker(
      "leads-DB-queue",
      async (job) => {
        try {
                console.log("Processing Job ID:", job.id, "Data:", JSON.stringify(job.data));

          const metaData = job?.data.metaData || {};
          const { clientId = null, senderNumber = null } = metaData;
          if (isMissing(clientId) || isMissing(senderNumber)) {
            throw new Error("Metadata not found");
          }

          const {
            name,
            interest,
            stage,
            goalReached,
            isEmailSentOnHot,
            isEmailSentOnClosed,
          } = job?.data;
          console.log("Worker log:" + JSON.stringify(job?.data));

          const finalDataObj = {};
          if (name) finalDataObj["name"] = name;
          if (interest) finalDataObj["interest"] = interest;
          if (stage) finalDataObj["stage"] = stage;
          if (goalReached) finalDataObj["goalReached"] = goalReached;
          if (isEmailSentOnHot !== undefined)
            finalDataObj["isEmailSentOnHot"] = toBool(
              isEmailSentOnHot,
            );
          if (isEmailSentOnClosed !== undefined)
            finalDataObj["isEmailSentOnClosed"] = toBool(
              isEmailSentOnClosed,
            );
          logger.info("Operation 1 processing:");
          for (let key in job?.data) {
            logger.info(`${key}: ${job?.data[key]}`);
          }
          if (finalDataObj && Object.keys(finalDataObj).length != 0) {
            const updateData = await withTimeout(
              updateLead(senderNumber, clientId, finalDataObj),
              DB_TIMEOUT,
            );
            if (updateData.success) {
              //Continue
            } else {
              throw new Error(updateData.message);
            }
          }

          const { extractedData } = job?.data;

          if (extractedData) {
            const updateFact = await withTimeout(
              updateLeadsExtractedFact(senderNumber, clientId, extractedData),
              DB_TIMEOUT,
            );
            if (updateFact.success) {
              //Continue
            } else {
              throw new Error(updateFact.message);
            }
          }

          const { history = [] } = job?.data;

          if (Array.isArray(history) && history.length > 0) {
            const updateHistory = await withTimeout(
              updateLeadChatHistroy(senderNumber, clientId, history),
              DB_TIMEOUT,
            );
            if (updateHistory.success) {
              return;
            } else {
              throw new Error(updateHistory.message);
            }
          }
        } catch (e) {
          logger.error("Data update operation failed", {
            jobId: job?.id,
            error: e.message,
          });
          throw e;
        }
      },
      {
        connection: redisConnection,
        concurrency: workerConcurreny || 5,
      },
    );

    worker.on("failed", (job, e) => {
      logger.error("Job failed ID", { jobId: job?.id, error: e });
    });

    worker.on("error", (e) => {
      logger.error("DB worker runtime error", { error: e });
    });

    const shutDown = async () => {
      logger.info("Shutting down DB update worker");
      try {
        await worker.close();
        await mongoose.disconnect();
        logger.info("Worker shutdown successfull");
        process.exit(1);
      } catch (e) {
        logger.info("Wrror while worker shutdown");
        process.exit(1);
      }
    };
    process.on("SIGINT", shutDown);
    process.on("SIGTERM", shutDown);
  } catch (e) {
    console.log(`Error in worker start ${e.message || "Worker error"}`);
  }
}

dbWorker();
