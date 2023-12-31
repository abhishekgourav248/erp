import express from "express";
import * as AuthController from "../controllers/AuthController.js";
import * as UserController from "../controllers/UserController.js";
import * as AttendanceController from "../controllers/AttendanceController.js";
import authenticate from "../middlewares/Authenticate.js";

const router = express.Router();
// get routes -----------------------------------------------------------------------------------------------------------------------------------------
router.get('/get_user_details' , authenticate , UserController.getUserDetails);
router.get('/get_user_attendance_list',authenticate,AttendanceController.getUserAttendenceList);
router.get('/get_user_timesheets', UserController.getUserTimeSheets);
router.get('/get_timesheet_details', UserController.getTimesheetDetails);


//post routes -----------------------------------------------------------------------------------------------------------------------------------------
router.post("/login",AuthController.loginUser);
router.post("/register",AuthController.registerUser);
router.post("/upsert_user_attendance",authenticate,AttendanceController.upsertUserAttendence);
router.post('/upsert_timesheet',authenticate,UserController.upsertTimeSheet);

export default router;