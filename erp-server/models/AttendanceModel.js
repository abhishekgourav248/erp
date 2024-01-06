import Attendance from "../schemas/AttendanceSchema.js";
import * as Helper from "../helpers/Helpers.js";
import * as CONSTANTS from "../constants/CONSTANTS.js";
import CheckInOutLogs from "../schemas/CheckInOutLogs.js";

const ERRORS = CONSTANTS.ERRORS;
export const upsertUserAttendence = async (postData) => {
    let response = {}
    try {
        const date = Helper.getDate(CONSTANTS.DATE_FORMAT.DMY);
        const attendance = await getAttendenceByDate({date:date , user_id : postData.user_id});
        if(attendance.status) {
            if(attendance.data._id) {
                //update
                response = {status : true , data : attendance.data, code : 200}
            }else {
                //create
                const currentTimeStamp = Date.now();
                const payload = {
                    user_id : postData.user_id,
                    date : date,
                }
                await Attendance.create(payload).then( (data) => {
                    response = {status : true , data : data , msg : "Attendence generated.",code : 200}
                }).catch( (error) => {
                    response = {status : false , errCode : ERRORS.ERR1005.code , error : error.msg , msg : ERRORS.ERR1005.msg, code : 500}
                })
            }
        } else {
            response = {status : false , code : 500 , errCode : ERRORS.ERR1000.code , msg : ERRORS.ERR1000.msg}
        }
    }catch (error) {
        response = {status : false , errCode : ERRORS.ERR1000.code , error : error.msg , msg : ERRORS.ERR1000.msg, code : 500}
    }
    return response ;
}


export const getAttendenceByDate = async(postData)=> {
    let response = {};

    try {
        const data = await Attendance.findOne({user_id : postData.user_id , date : postData.date});
        if(data) {
            return {status : true , data : data}
        }
        response = {status : true , data : {_id : null}, code : 200}
    }catch(error) {
        response = {status : false , data : {} , code : 500}
        console.log(error.message);
    }
    return response;
}

export const getUserAttendenceList = async(userId) => {
    let response;
    let data = [];
    try {
        let attendance = await Attendance.find({user_id  : userId}).sort({created_at : -1});
        data =await Promise.all( attendance.map( async(value) => {
            const log = await CheckInOutLogs.find({user_id : userId , date : value.date});
            let total = 0;
            log.map( value => {
                total += value.total;
            })
            value = {
                ...value._doc , 
                check_in : Helper.formatDateTimeToTime(log[0].check_in),
                check_out : Helper.formatDateTimeToTime(log[log.length - 1].check_out),
                total : Helper.msToHMS(total)
            }
            return value;
        }));
        console.log(data);
        response = {status : true , data: data , code : 200}
    } catch(error) {
        response = {status : false , error : error.message , code : 500 , msg : ERRORS.ERR1000.msg , errCode : ERRORS.ERR1000.code , data : []}
    }
    return response ;
}


export const rollBack = async (id) => {
    try {
        await Attendance.deleteOne({_id : id});
    }catch(error) {

    }
}