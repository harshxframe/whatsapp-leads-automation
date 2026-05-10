import express from "express";
const authRouter = express.Router();
import { sendCode } from "../controller/sendCode.controller.js";



authRouter.post("/sendCode", sendCode);



export default authRouter;