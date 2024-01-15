import dotenv from 'dotenv'
import connectDB from "./db/dbConn.js";

dotenv.config({
    path:'./env'
})

connectDB();