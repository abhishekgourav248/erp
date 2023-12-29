import mongoose from "mongoose";


const schema = mongoose.Schema({
    user_id : {
        type : String
    },
    date : {
        type : String
    },
    check_in : {
        type : Date,
        default : 0
    },
    check_out : {
        type : Date,
        default : null
    },
    total : {
        type : Number
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})


const CheckInOutLogs = mongoose.model('check_in_out_logs',schema);

export default CheckInOutLogs;