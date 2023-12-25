import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    email: {
        type: String,
        maxlength : 50,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        maxlength: 1000
    },
    name : {
        type : String,
        required : true,
        maxlength : 50
    },
    profile_image : {
        type : String,
        default : "",
    },
    contact : {
        type : String,
        default : "",
        maxlength : 10,
    },
    user_type : {
        type : Number,
        default : 2,
        description : "1 - Admin / 2 - Employee / 3 - HR"
    },
    is_checked_in : {
        type : Number,
        default : 2,
        description : "1 - > yes / 2 - > no"
    }
})

const User = mongoose.model('User',userSchema);

export default User;