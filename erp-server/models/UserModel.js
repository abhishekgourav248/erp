import User from "../schemas/UserSchema.js";


export const getUserDetails  = async (userId, forAuthentication = false) => {
    let response = {};
    try {
        const user = await User.findOne({user_id : userId});
        if (user) {
            //retrieve password field only while authentication
            if(!forAuthentication) {
                delete user.password;
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