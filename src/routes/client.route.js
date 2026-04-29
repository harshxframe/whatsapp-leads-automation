import express from "express";
import { createClient, getClient, updateClient, blockClient, getClients } from "../controller/client.controller.js";

const clientRouter = express.Router();



clientRouter.post("/createClient",createClient);
clientRouter.post("/getClient",getClient);
clientRouter.post("/updateClient",updateClient);
clientRouter.post("/blockClient", blockClient);
clientRouter.get("/getClients", getClients)


export default clientRouter;