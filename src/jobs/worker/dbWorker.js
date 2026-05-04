import mongoose from "mongoose";
import { redisConnection } from "../../config/redis,js";
import { Worker, Worker } from "bullmq";
import dotenv from "dotenv";
import logger from "../../utils/logger.js";
import { withTimeout } from "../../utils/timeOutHandler.js";
import {
  updateLead,
  updateLeadChatHistroy,
  updateLeadsExtractedFact,
} from "../../services/leads.service.js";
import { isMissing } from "../../utils/fieldValidation.js";
import { error, log } from "winston";
dotenv.config();

const DBConnectionUrl = process.env.DB_URL || "";

async function dbWorker() {
  try {
    //Establish DB connection
    await mongoose.connect(DBConnectionUrl);
    mongoose.connection.on("connected", () =>
      logger.info("DB connection successful with DB wroker"),
    );
    mongoose.connection.on("error", () =>
      logger.error("Error in DB connection in DB worker"),
    );
    mongoose.connection.on("disconnected", () =>
      logger.info("DB disconnected with DB wroker"),
    );

    const DB_TIMEOUT = 15000;

    const worker = new Worker("", async (job) => {
      try {
        const { clientId, senderNumber } = job?.data.metaData;
        if (isMissing(clientId) || isMissing(senderNumber)) {
          throw new Error("Metadata not found");
        }

        const {
          name = null,
          interest = null,
          stage = null,
          goalReached = null,
          dealHotSendEmailToClient = null,
          dealClosedSendEmailToClient = null,
        } = job?.data;

        const finalDataObj = {};
        if (name) finalDataObj["name"] = name;
        if (interest) finalDataObj["interest"] = interest;
        if (stage) finalDataObj["stage"] = stage;
        if (goalReached) finalDataObj["goalReached"] = goalReached;
        if (dealHotSendEmailToClient !== undefined)
          finalDataObj["dealHotSendEmailToClient"] = dealHotSendEmailToClient;
        if (dealClosedSendEmailToClient !== undefined)
          finalDataObj["dealClosedSendEmailToClient"] =
            dealClosedSendEmailToClient;

        if (finalDataObj && Object.keys(finalDataObj).length != 0) {
          const updateData = await withTimeout(
            updateLead(senderNumber, clientId, finalDataObj),
            DB_TIMEOUT,
          );
          if (updateData.success) {
            return;
          }
        }

        const { extractedFact = null } = job?.data;

        if (extractedFact) {
          const updateFact = await withTimeout(
            updateLeadsExtractedFact(senderNumber, clientId, extractedFact),
            DB_TIMEOUT,
          );
          if (updateFact.success) {
            return;
          }
        }

        const { history = [] } = job?.data;

        if (history != 0) {
          const updateHistory = await withTimeout(
            updateLeadChatHistroy(senderNumber, clientId, history),
            DB_TIMEOUT,
          );
          if (updateHistory.success) {
            return;
          }
        }
      } catch (e) {
        logger.error("Data update operation failed", {
          jobId: job?.id,
          error: e.message,
        });
      }
    });

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
