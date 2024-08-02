import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () =>{
    try {
      const DatabaseInstance = await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
      console.log(`\n MongoDB connected successfully !! DB HOST: ${DatabaseInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection failed" , error);
        process.exit(1);
    }

}
export default connectDB