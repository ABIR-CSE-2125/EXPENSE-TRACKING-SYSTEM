import mongoose from "mongoose";
import { MONGO_URI, DB_NAME } from "../config.js";
const connectDB = async () => {
  try {
    const connectionInsatcne = await mongoose.connect(
      `${MONGO_URI}/${DB_NAME}`
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
