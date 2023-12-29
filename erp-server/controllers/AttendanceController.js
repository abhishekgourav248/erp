import createLogger from "../Logger/logger.js";
import * as UserModel from "../models/UserModel.js";
import * as CheckInOutModel from "../models/CheckInOutModel.js";
import * as AttendanceModel from "../models/AttendanceModel.js";

const logger = createLogger("AttendanceController");

export const upsertUserAttendence = async(req,res) => {
    let response = {};
    logger.log("info" , "===============================LOG START==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.body)}`);
    try{

        const {user_id} = req.body;
        const prevUserData = await UserModel.getUserDetails(user_id);
        if(!prevUserData.status) {
            response = {status :false , code :400 , errCode : prevUserData.errCode , error : prevUserData.error}
            logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
            logger.log("info" , "================================LOG END===============================");
            return res.status(response.code).json(response);
        }


        let postData = {
            user_id : prevUserData.data.user_id,
            is_checked_in : req.body.is_checked_in ? req.body.is_checked_in : prevUserData.data.is_checked_in,
        }

        // attendance creating for check in
        const updateAttendance = await AttendanceModel.upsertUserAttendence(postData);
        if(!updateAttendance.status) {
            logger.log("error" , "======ATTENDANCE UPDATE FAILED=======")
            console.log(updateAttendance);
            response = {status :false , errCode : updateAttendance.errCode , error : updateAttendance.error , msg : updateAttendance.msg , code : updateAttendance.code}
            logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
            logger.log("info" , "================================LOG END===============================");
            return res.status(response.code).json(response);
        }


        logger.log("info" , "===Attendance Response==="+JSON.stringify(updateAttendance))
        postData = {...postData , date : updateAttendance.data.date};
        const createLog = await CheckInOutModel.upsertLog(postData);
        if(!createLog.status) {
            logger.log("error" , "======CHECK IN / OUT LOGGING FAILED. ROLLING BACK ATTENDANCE DATA=======")
            if(postData.is_checked_in == 1) {
                await AttendanceModel.rollBack(updateAttendance.data._id);
            }
            response = {status :false , errCode : createLog.errCode , error : createLog.error , msg : createLog.msg , code : createLog.code}
            logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
            logger.log("info" , "================================LOG END===============================");
            return res.status(response.code).json(response);
        }
        const updateUser = await UserModel.updateUserAttendence(postData);

        if (!updateUser.status) {
            logger.log("error" , "=====FAILED TO MARK USER AS CHECK-IN OR OUT=====");
            if (postData.is_checked_in == 1) {
                await AttendanceModel.rollBack(updateAttendance.data._id);
            }
            await CheckInOutModel.rollBack(createLog.data._id);
            response = {status :false , errCode : createLog.errCode , error : createLog.error , msg : createLog.msg , code : createLog.code}
            logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
            logger.log("info" , "================================LOG END===============================");
            return res.status(response.code).json(response);
        }

        response = {status : true ,code : 200 , msg : updateUser.msg , data : updateUser.data}
    }catch(error) {
        logger.log("error",`===ERROR=== > ${error.message}`);
        response = {status : false , code : 500 , error : "Something went wrong", msg : error.message};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}