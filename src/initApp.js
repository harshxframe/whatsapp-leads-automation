import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import { responseBody } from "./utils/responseBody.js";
import cors from "cors";
import { invalidRouteHandler, lastErrorHandler } from "./middlewares/errorHandler.js";
import { healthMiddleware } from "./middlewares/health.js";
import clientRouter from "./routes/client.route.js";
import handShakeRouter from "./routes/handshake.route.js";


const initApp = async () => {
    await connectDB();
    const app = express();
    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/health", healthMiddleware);
    app.use("/app/v1", clientRouter);
    app.use("/handShake", handShakeRouter);
    app.use(invalidRouteHandler);
    app.use(lastErrorHandler);
    return app;
}



export default initApp;