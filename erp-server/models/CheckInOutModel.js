import CheckInOutLogs from "../schemas/CheckInOutLogs.js";
import * as CONSTANTS from "../constants/CONSTANTS.js";

const ERRORS = CONSTANTS.ERRORS;

export const upsertLog = async(postData) => {
    let response = {} ;
    try {
        if(postData.is_checked_in == 1) {
            //check in
            const currentTimeStamp = Date.now();
            postData = {...postData , check_in : currentTimeStamp};
            await CheckInOutLogs.create(postData).then((data) => {
                response = {status : true , code : 200 , msg : "Log created" ,data : data};
            }).catch(error => {
                response = {status : false , code : 500, error : error.message , errCode : ERRORS.ERR1005.code , msg : ERRORS.ERR1005.msg};
            })
        }else {
            //check out
            const currentTimeStamp = Date.now();
            console.log(postData);
            const log = await CheckInOutLogs.find({user_id : postData.user_id , date : postData.date }).sort({created_at : -1 }).limit(1);
            const total = currentTimeStamp - log[0].check_in ; 
            console.log( log);
            await CheckInOutLogs.findOneAndUpdate({_id : log[0]._id} , {check_out : currentTimeStamp , total : total} , {new : true}).then( data => {
                response = {status : true , code : 200 , msg : "Log updated. User checked out" ,data : data};
            }).catch(error => {
                response = {status : false , code : 500, error : error.message , errCode : ERRORS.ERR1004.code , msg : ERRORS.ERR1004.msg};
            })
        }
    }catch(error) {
        response = {status : false , code : 500, error : error.message , errCode : ERRORS.ERR1000.code , msg : ERRORS.ERR1000.msg};
    }
    return response ;
}

export const rollBack = async (id) => {
    try {
        const data = await CheckInOutLogs.findOne({_id : id});
        if(data.check_out !== null) {
            await CheckInOutLogs.findOneAndUpdate({_id : id} , {check_out : null , total : 0}, {new : true});
        }
    }catch (error) {
        //
    }
}