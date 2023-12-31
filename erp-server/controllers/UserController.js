import createLogger from "../Logger/logger.js";
import * as UserModel from "../models/UserModel.js";
import * as TimeSheetsModel from "../models/TimeSheetsModel.js";

const logger = createLogger("UserController");
export const getUserDetails = async (req,res) => {
    logger.log("info" , "===============================LOG START==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.query)}`);
    let response = {};
    try {
        const { user_id } = req.query ;
        const user = await UserModel.getUserDetails(user_id);
        if(user.status) {
            response = {...user , code : 200};
        }else {
            response = {...user};
        }
    }catch(error) {
        logger.log("error",`===ERROR=== > ${error}`);
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}

export const upsertTimeSheet = async(req,res) => {
    logger.log("info" , "===============================LOG START==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.body)}`);
    let response = {};
    try {
        const timesheet = await TimeSheetsModel.upsertTimeSheet(req.body);
        response = timesheet;
    }catch (error) {
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}