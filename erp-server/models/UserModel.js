
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
                    user_type : user.user_type
                }
            }
            response = {status : true , data : user};
        }else {
            response = {status : true , error : "No data found" , errCode : 1002}
        }
    }catch(error) {
        response = {status :false , msg : error, code : 500}
    }
    return response
}