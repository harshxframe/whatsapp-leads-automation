import express from "express";
import { createClient, getClient, updateClient, blockClient } from "../controller/client.controller.js";

const clientRouter = express.Router();



clientRouter.post("/createClient",createClient);
clientRouter.post("/getClient",getClient);
clientRouter.post("/updateClient",updateClient);
clientRouter.post("/blockClient", blockClient);


export default clientRouter;