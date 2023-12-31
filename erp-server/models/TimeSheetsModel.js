import TimeSheets from "../schemas/TimeSheetSchema.js";
import * as CONSTANTS from "../constants/CONSTANTS.js";

const ERRORS = CONSTANTS.ERRORS;
export const upsertTimeSheet = async (postData) => {
    let response = {};
    try {
        const data = await TimeSheets.findOneAndUpdate({user_id : postData.user_id , date : postData.date},postData,{new:true , upsert : true});
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