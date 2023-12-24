import Jwt from "jsonwebtoken";
import UserToken from "../schemas/UserTokens.js";
import 'dotenv/config';

const KEY  = process.env.KEY;

const authenticate = async (req,res,next) => {
    const rawToken = req.headers.authorization;
    let response = {};
    if (!rawToken) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }

    try {
        const token = (rawToken.split(" "))[1];
        const decodedToken = Jwt.verify(token , KEY);
        const userId = req.query.user_id;
        if(!userId) {
            response = {status : false , error : "user_id field is required" , errCode : 1001};
            return res.status(200).json(response);
        }

        const userToken = await UserToken.findOne({token_id : decodedToken.token_id , user_id : userId});
        console.log(userToken);
        if(!userToken) {
            return res.status(401).json({error : "Unauthorized - Token invalid"})
        }

        const timeStamp = Date.now();
        const isTokenExpired = (userToken.expires_in <= timeStamp) ? false : true ;

        if(isTokenExpired) {
            return res.status(401).json({error : "Unauthorized - Token expired. Please login to continue"});
        }
        
        if(req.query) {
            req.body = {...req.query};
            delete req.query;
        }

        next() ;
    }catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Unauthorized - Something went wrong. Failed to authorize user'});
    }
}

export default authenticate;