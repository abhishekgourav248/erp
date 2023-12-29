import "dotenv/config";
import Jwt from "jsonwebtoken";
import UserToken from "../schemas/UserTokens.js";
import { response } from "express";

export const generateRandomToken =async ()=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    let token = "" ;
    let unique = false;
    const lENGTH = process.env.JWT_ID_LENGTH;
    const BASE = process.env.RADIX_BASE;
    while(!unique) {
        const uniqueSubStr = (Date.now()).toString(BASE); //base n encoding 
        for (let i = 0; i < lENGTH/2; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        token = randomString+"."+uniqueSubStr;
        unique = (await UserToken.exists({id : token})) ? false : true;
    }
    return token;
}

export const generateJWT = async (userId) => {
    const uniqueToken = await generateRandomToken();
    const currentTimeStamp = Date.now();
    const expiryPeriod = parseInt(process.env.JWT_TOKEN_VALIDITY_PERIOD);
    const expiryTime = currentTimeStamp + expiryPeriod;
    const KEY = process.env.KEY;
    let response = {}
    let jwtPayload = {
        token_id : uniqueToken,
        user_id : userId,
        issued_at : currentTimeStamp,
        expires_in : expiryTime
    }
    try {
        const userToken = await UserToken.create(jwtPayload);
        console.log(jwtPayload);
        delete jwtPayload.expires_in;
        const JWTToken = Jwt.sign(jwtPayload,KEY, {expiresIn: expiryTime});
        if(JWTToken.length == 0) {
            const invalidateToken = await UserToken.findOneAndUpdate({id : uniqueToken} , {is_expired : true});
            response = {status :false , error : "Failed to generate JWT token",errCode : 100, code : 500};
        }else {
            response = {status :true , msg : "JWT token generated successfully",token : JWTToken ,code : 200};
        }
    }catch (error) {
        console.log(error);
        response = {status : false, error : "Something went wrong", code : 500};
    }
    return response;
}
/**
 * @param formatType 1 - YYYY-MM-DD , 2 -> MM-DD-YYYY , 3 -> DD-MM-YYYY
 * @default YYYY-MM-DD
 * @returns string
 */
export const getDate = (formatType=1) => {
    // Get today's date
    const today = new Date();

    // Get the year, month, and day
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is zero-based
    const day = today.getDate();

    // Create a formatted string
    const date_ymd = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}`; // YYYY-MM-DD
    const date_mdy = `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`; // MM-DD-YYYY
    const date_dmy = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`; // DD-MM-YYYY

    switch (formatType) {
        case 1  : return date_ymd;
        case 2  : return date_mdy;
        case 3  : return date_dmy;
        default : return date_ymd;
    }
}