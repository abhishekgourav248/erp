import mongoose from 'mongoose';


const schema = mongoose.Schema({
    user_id : {
        type : String
    },
    date : {
        type : Date,
        default : (new Date()).getDate()
    },
    hours : {
        type  : String,
        default : ""
    },
    project : {
        type : String,
        default : ""
    },
    task : {
        type : String,
        default : ""
    },
    is_mail_sent : {
        type : Boolean,
        default : false
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})

const TimeSheets = mongoose.model('timesheets' , schema);
export default TimeSheets;