import mongoose from "mongoose";

const Token = mongoose.Schema({
    token_id : {
        type : String,
        unique : true,
    },
    user_id : {
        type : String,
    },
    issued_at : {
        type : Date,
        default : Date.now()
    },
    expires_in : {
        type : Date,
    },
    is_expired : {
        type : Boolean,
        default : false
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
})

const UserToken = mongoose.model("UserTokens",Token);

export default UserToken;