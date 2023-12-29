import mongoose from "mongoose";

const schema = mongoose.Schema({
    user_id : {
        type : String,
    },
    date : {
        type : String,
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})


const Attendance = mongoose.model("attendance",schema);

export default Attendance;