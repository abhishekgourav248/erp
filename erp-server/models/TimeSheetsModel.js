import TimeSheets from "../schemas/TimeSheetSchema.js";
import * as CONSTANTS from "../constants/CONSTANTS.js";
import TimeSheetEmail from "../schemas/TimesheetEmailSchema.js";

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
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500 ,data : {}};
    }
    return response;
}

export const getTimesheetMail = async (timesheetId) => {
    let response = {} ;
    try {
        const data = await TimeSheetEmail.findOne({timesheet_id : timesheetId});
        if(data) {
            response = {status : true , data : data , code : 200};
        }else {
            response = {status : false , data : {} , code : 200};
        }
    } catch (error) {
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500};
    }
    return response;
}

export const saveTimesheetMail = async (postData) => {
    let response = {status :false , data : {} , code : 400};
    try {
        if(postData._id) {
            const update = await TimeSheetEmail.findOneAndUpdate({_id : postData._id} , postData , {new:true});
            if(update) {
                response = {status : true , data : update , code : 200}
            }
        } else {
            delete postData._id;
            const save = await TimeSheetEmail.create(postData);
            if(save) {
                response = {status : true , data : save , code : 200}
            }
        }
    } catch (error) {
        response = {status : false , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , error : error.message, code : 500};
    }
    return response;
}