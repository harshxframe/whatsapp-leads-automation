import express from "express";
import { createClient, getClient, updateClient, blockClient, getClients, clientLogin } from "../controller/client.controller.js";

const clientRouter = express.Router();



clientRouter.get("/clientLogin",clientLogin);
clientRouter.post("/createClient",createClient);
clientRouter.post("/getClient",getClient);
clientRouter.post("/updateClient",updateClient);
clientRouter.post("/blockClient", blockClient);
clientRouter.get("/getClients", getClients)


export default clientRouter;