import express from "express";
import { exportLeads, getLeads } from "../controller/leads.controller.js";
const leadsRouter = express.Router();

leadsRouter.get("/getLeads", getLeads);
leadsRouter.get("/exportLeads", exportLeads);

export default leadsRouter;
