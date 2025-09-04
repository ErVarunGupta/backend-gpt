import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const dbConnection = ()=>{
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri).then(()=>{
        console.log('Database connected successfully!')
    }).catch((err) => {
        console.log('Error during database connection: ', err);
    })
}