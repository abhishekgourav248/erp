import mongoose from "mongoose";

const schema = mongoose.Schema({
    user_id  : {
        type : String
    },
    timesheet_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'timesheets',
        required : true
    },
    to : {
        type  : Array,
        required  :true
    },
    from : {
        type : String,
        required : true
    },
    cc : {
        type : Array,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    is_sent : {
        type : Boolean,
        default : false
    },
    sent_at : {
        type : Date,
        required :false
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})


const TimeSheetEmail = mongoose.model('timesheet_email',schema);
export default TimeSheetEmail;