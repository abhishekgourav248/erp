import createLogger from "../Logger/logger.js";
import * as Helper from '../helpers/Helpers.js';
import bcrypt from "bcryptjs";
import "dotenv/config";
import * as UserModel from "../models/UserModel.js";
import User from "../schemas/UserSchema.js";

const logger = createLogger("AuthControllerLog");

export const loginUser = async (req,res) => {
    let response = {};
    const KEY = process.env.KEY;
    const SALT = parseInt(process.env.SALT);
    let forAuthentication = true;
    let validationError = false;
    let errorMsgs = [];
    logger.log("info",`========================================================NEW ENTRY========================================================`);
    logger.log("info",`request payload => { user_id : ${req.body.user_id} , password : ${req.body.password}}`);
    try{
        const {user_id , password} = req.body ;
        if(user_id.length == 0) {
            validationError = true;
            errorMsg.push("user_id field is required");
        }
        if(password.length == 0) {
            validationError = true;
            errorMsg.push("password field is required");
        }

        if(validationError) {
            logger.log("error" , "======Validation Error Message Start======")
            errorMsgs.forEach ( (msg) => {
                logger.log("error" , msg);
            })
            logger.log("error" , "======Validation Error Message End======")
            response = {status : false , error : errorMsg , errCode : 1001};
            return res.status(response.code).json(response);
        }

        const userData = await UserModel.getUserDetails(user_id , forAuthentication);
        logger.log('info',"=====User data response=====");
        logger.log('info',JSON.stringify(userData));

        if( userData.status && userData.hasOwnProperty('errCode') ) {
            response = {
                ...userData,
                code : 200
            }
        }else {
            const user = userData.data;
            const pepperedPassword = password+KEY;
            const isMatch = await bcrypt.compare(pepperedPassword, user.password)
            if(isMatch) {
                const jwt = await Helper.generateJWT(user.user_id);
                if (jwt.status) {
                    logger.log("info", "=====Password Compare success and Jwt success");
                    response = {status: true, data: {_token: jwt.token, user_id: user.user_id}, code: 200, msg: "User logged in successfully"};
                } else {
                    logger.log("error", "=====JWT generation failure=====");
                    logger.log('info', JSON.stringify(jwt));
                    response = jwt;
                }
            }else {
                logger.log("info", "=====Authentication Response=====");
                response = {status: false, error: "Invalid credentials", errCode: 1003, code: 401};
                logger.log("info", JSON.stringify(response));
            }
        }
    }catch (error){
        console.log(error)
        response={status : false , error : error , code : 500};
    }
    logger.log("info","=====Final response returned=====");
    logger.log("info" , JSON.stringify(response));
    logger.log("info",`========================================================ENTRY END========================================================`);
    return res.status(response.code).json(response);

}

export const registerUser = async(req,res) => {
    let response = {};
    try{
        const {user_id, password,name,contact,email} = req.body;
        const KEY = process.env.KEY;
        const SALT = parseInt(process.env.SALT);
        const pepperedPassword = password+KEY;
        const hashedPassword = await bcrypt.hash(pepperedPassword,SALT);
        await User.create({user_id : user_id , email: email, password : hashedPassword, name : name , contact : contact}).then( () => {
            response = {status : true , msg : "registered successfully" , code : 200};
        }).catch((err) => {
            logger.log("error" , err);
            response = {status : false , msg : "registration failed here" ,code : 500};
        })
    }catch(err) {
        logger.log("error" , err);
        response = {status : false , msg : "registration failed" ,code : 500};
    }
    return res.status(response.code).json(response);
}