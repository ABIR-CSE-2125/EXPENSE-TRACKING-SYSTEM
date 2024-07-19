import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const DB_NAME = "ETS";

export {
  PORT,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  DB_NAME,
};
