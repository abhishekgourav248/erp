import createLogger from "../Logger/logger.js";
import * as UserModel from "../models/UserModel.js";
import * as TimeSheetsModel from "../models/TimeSheetsModel.js";
import { ERRORS } from "../constants/CONSTANTS.js";

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

export const getUserTimeSheets = async (req,res) => {
    logger.log("info" , "===============================LOG START getUserTimeSheets==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.query)}`);
    let response = {};
    try {
        const {user_id} = req.query;
        if(!user_id) {
            msg = ERRORS.ERR1001.msg;
            errCode = ERRORS.ERR1001.code;
            response = {status : true , code : 400 , errMsg : msg , error : "user_id field is required" , errCode : errCode}
        }
        const timesheets = await TimeSheetsModel.getUserTimeSheets(req.query);
        response = {...timesheets};
    }catch (error) {
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}

export const getTimesheetDetails = async (req,res) => {
    logger.log("info" , "===============================LOG START getTimeSheetDetails==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.query)}`);
    let response = {};
    try {
        const details = await TimeSheetsModel.getTimeSheetDetails(req.query);
        response = {...details};
    } catch (error) {
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}

export const getUsers = async(req,res) => {
    logger.log("info" , "===============================LOG START GET_USERS==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.query)}`);
    let response = {};
    try {
        const users = await UserModel.getUsers(req.query.search_text);
        response = {...users};
    } catch (error) {
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}


export const saveTimesheetMail = async (req,res) => {
    logger.log("info" , "===============================LOG START GET_USERS==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.body)}`);
    let response = {};
    let validationError = false;
    let errMsg = [];
    let to_list = [];
    let cc_list = [];
    let message = "";
    try {
        //validation
        const {timesheet_id , user_id , to ,cc,subject} = req.body;
        if(!timesheet_id) {
            validationError= true;
            errMsg.push("timesheet_id is a required field");
        }
        if(!user_id) {
            validationError= true;
            errMsg.push("user_id is a required field");
        }
        if(!to) {
            validationError= true;
            errMsg.push("to is a required field");
        }
        if(!subject) {
            validationError= true;
            errMsg.push("subject is a required field");
        }
        
        to.forEach(async (data) => {
            let email = (await UserModel.getUserMail(data.user_id)).email;
            to_list.push(email);
        });
        cc.forEach(async (data) => {
            let email = (await UserModel.getUserMail(data.user_id)).email;
            cc_list.push(email);
        });
        let timesheetDetails = await TimeSheetsModel.getTimeSheetDetails(req.body);
        if(timesheetDetails.status) {
            message = `Status update mail for project : ${timesheetDetails.data.project}\nDuration : ${timesheetDetails.data.hours}\nPlease find below the list of tasks worked upon for today :\n${timesheetDetails.data.task}`;
        }
        const previousMailDetails = await TimeSheetsModel.getTimesheetMail(timesheet_id) ;
        let postData = {
            _id : previousMailDetails.status ? previousMailDetails.data._id : null,
            from : (await UserModel.getUserMail(user_id)).email,
            to : Array.from(new Set(to_list)),
            cc : Array.from(new Set(cc_list)),
            subject : subject,
            message : message,
            timesheet_id : timesheet_id
        }

        const result = await TimeSheetsModel.saveTimesheetMail(postData);
        
        response = {...result};
    } catch (error) {
        response = {status : false , code : 500 , error : "Something went wrong"};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}