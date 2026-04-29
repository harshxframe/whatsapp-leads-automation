import express from "express";
import { whatsappHandShake, whatsappWebHook } from "../controller/whatsapp.controller.js";
const handShakeRouter = express.Router();


handShakeRouter.get("/webhook", whatsappHandShake);
handShakeRouter.post("/webhook", whatsappWebHook);


export default handShakeRouter;
