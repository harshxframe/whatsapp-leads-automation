import { responseBody } from "../utils/responseBody.js";
import os from "os";

export const healthMiddleware = (req, res, next) => {
  res.status(200).send(
    responseBody(
      200,
      false,
      true,
      "Server Health is OK",
      {
        status: "ok",
        uptime: process.uptime(),
        memmory: process.memoryUsage(),
        cpu: os.loadavg()
      }
    )
  );
};