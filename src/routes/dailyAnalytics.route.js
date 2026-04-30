import express from "express";
import { getAnalytics } from "../controller/dailyAnalytics.controller.js";


const analyticsRouter = express.Router();


analyticsRouter.get("/getAnalytics", getAnalytics);


export default analyticsRouter;