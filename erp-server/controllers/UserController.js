import { response } from "express";
import createLogger from "../Logger/logger.js";
import * as UserModel from "../models/UserModel.js";

const logger = createLogger("UserController");
export const getUserDetails = async (req,res) => {
    logger.log("info" , "===============================LOG START==============================");
    logger.log("info" , `===Payload=== > ${JSON.stringify(req.body)}`);
    let response = {};
    try {
        const { user_id } = req.body ;
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

export const updateUserDetails = async(req,res) => {
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

        const postData = {
            user_id : prevUserData.data.user_id,
            name : (req.body.name) ? req.body.name : prevUserData.data.name,
            contact : req.body.contact ? req.body.contact : prevUserData.data.contact,
            is_checked_in : req.body.is_checked_in ? req.body.is_checked_in : prevUserData.data.is_checked_in,
            user_type : req.body.user_type ? req.body.user_type : prevUserData.data.user_type,
            profile_image : req.body.profile_image ? req.body.profile_image : prevUserData.data.profile_image
        }

        const updateUser = await UserModel.updateUserDetails(postData);
        if(updateUser.status) {
            response = {status : true , data : updateUser.data , msg : updateUser.msg , code : 200}
        }else {
            response = {status : false , code : updateUser.data.code , error : updateUser.data.code};
            if(updateUser.errCode) {
                response = {...response , errCode : updateUser.data.errCode};
            }
        }
        
    }catch(error) {
        logger.log("error",`===ERROR=== > ${error.message}`);
        response = {status : false , code : 500 , error : "Something went wrong", msg : error.message};
    }
    logger.log("info" , `===FINAL RESPONSE=== > ${JSON.stringify(response)}`);
    logger.log("info" , "================================LOG END===============================");
    return res.status(response.code).json(response);
}


export const getUserAttendenceList = async(req,res)=>{
    
}