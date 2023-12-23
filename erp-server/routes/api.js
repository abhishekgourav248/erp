import express from "express";
import * as AuthController from "../controllers/AuthController.js";

const router = express.Router();


router.post("/login",AuthController.loginUser);
router.post("/register",AuthController.registerUser);


export default router;