import express from "express";
import * as AuthController from "../controllers/AuthController.js";
import * as UserController from "../controllers/UserController.js";
import authenticate from "../middlewares/Authenticate.js";

const router = express.Router();
// get routes -----------------------------------------------------------------------------------------------------------------------------------------
router.get('/get_user_details' , authenticate , UserController.getUserDetails);
router.get('/get_user_attendance_list',authenticate,UserController.getUserAttendenceList);


//post routes -----------------------------------------------------------------------------------------------------------------------------------------
router.post("/login",AuthController.loginUser);
router.post("/register",AuthController.registerUser);
router.post("/update_user_details",authenticate,UserController.updateUserDetails);

export default router;