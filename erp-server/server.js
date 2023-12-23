import Express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import createLogger from "./Logger/logger.js";
import cors from "cors";
import router from "./routes/api.js";

const app = Express();
const DB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const logger = createLogger("server");
app.use(Express.json());
app.use(cors());
app.use('/api/v1',router)


mongoose.connect(DB_URL).then( ()=>{
    app.listen(PORT,() => {logger.log("info" , "===Server up on 5000===")});
}).catch(error => {
    logger.log("error" , error)
})