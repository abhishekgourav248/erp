import Express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import createLogger from "./Logger/logger.js";

const app = Express();
const DB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const logger = createLogger("server");
app.use(Express.json());


mongoose.connect(DB_URL).then( ()=>{
    app.listen(PORT,() => {logger.log("info" , "===Server up on 5000===")});
}).catch(error => {
    logger.log("error" , error)
})