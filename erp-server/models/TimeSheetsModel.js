import TimeSheets from "../schemas/TimeSheetSchema.js";
import * as CONSTANTS from "../constants/CONSTANTS.js";

const ERRORS = CONSTANTS.ERRORS;
export const upsertTimeSheet = async (postData) => {
    let response = {};
    try {
        let searchParams = {
            user_id : postData.user_id , date : postData.date
        }
        if(postData.hasOwnProperty("_id")) {
            searchParams = {
                _id : postData._id
            }
        }
        const data = await TimeSheets.findOneAndUpdate(searchParams,postData,{new:true , upsert : true});
        if(data._id) {
            response = {status : true , msg : "Time sheet updated successfully." ,code : 200};
        }else {
            response = {status : false , msg : ERRORS.ERR1004.msg , errCode : ERRORS.ERR1004.code , error : "Failed to update",code : 500};
        }
    }catch (error) {
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500};
    }
    return response;
}

export const getUserTimeSheets = async (postData) => {
    let response = {};
    try {
        let data = await TimeSheets.find({user_id : postData.user_id}).sort({date : -1});
        if(data) {
            data = [...data.map( (value) => {
                const formattedDate = (value.date).toISOString().split("T")[0];
                return { ...value.toObject(), date: formattedDate };
            })]
            response = {status : true , data : data ,code : 200};
        }else {
            response = {status : true , data : [] ,code : 200};
        }
    }catch (error) {
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500};
    }
    return response;
}


export const getTimeSheetDetails = async (postData) => {
    let response = {};
    try {
        let data = await TimeSheets.findOne({_id : postData.timesheet_id});
        if(data) {
            response = {status : true , code : 200 , data : data}
        }else {
            response = {status : true , code : 200 , data : {}}
        }
    } catch (error) {
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500};
    }
    return response;
}