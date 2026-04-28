import express from "express";
import { whatsappHandShake } from "../controller/handshake.controller.js";
const handShakeRouter = express.Router();


handShakeRouter.get("/webhook", whatsappHandShake);

export default handShakeRouter;
