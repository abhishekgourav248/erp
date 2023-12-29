
import User from "../schemas/UserSchema.js";


export const getUserDetails  = async (userId, forAuthentication = false) => {
    let response = {};
    try {
        let user = await User.findOne({user_id : userId});
        if (user) {
            //retrieve password field only while authentication
            if(!forAuthentication) {
                user = {
                    _id : user._id,
                    name : user.name,
                    contact : user.contact,
                    email : user.email,
                    user_id : user.user_id,
                    profile_image : user.profile_image,
                    user_type : user.user_type,
                    is_checked_in : user.is_checked_in
                }
            }
            response = {status : true , data : user};
        }else {
            response = {status : false , error : "User not found.   " , errCode : 1002 , code : 500}
        }
    }catch(error) {
        response = {status :false , msg : error, code : 500}
    }
    return response
}


export const updateUserAttendence = async (postData) => {
    let response = {};
    let options = {
        new:true
    }
    try {
        const updateUser = await User.findOneAndUpdate({user_id : postData.user_id} , {is_checked_in : postData.is_checked_in},options);
        if(!updateUser) {
            response = {status :false , error : "Failed to update. Data may not exist",code : 200 , errCode : 1004}
        }else {
            response = {status : true , data : updateUser , msg : "Attendance updated successfully" , code : 200}
        }
    }catch (error) {
        response = {status :false , code : 500 , error : error.message ,msg : "Something went wrong" }
    }
    return response;
}