import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInsatcne = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\nDataBase Connected !! DB Host at ${connectionInsatcne.connection.host}`
    );
  } catch (error) {
    console.log("!! DATABASE CONNECTION ERROR !!");
    throw error;
  }
};
export default connectDB;
