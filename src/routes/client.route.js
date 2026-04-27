import express from "express";
import { createClient, getClient, updateClient } from "../controller/client.controller.js";

const clientRouter = express.Router();



clientRouter.post("/createClient",createClient);
clientRouter.post("/getClient",getClient);
clientRouter.post("/updateClient",updateClient);


export default clientRouter;