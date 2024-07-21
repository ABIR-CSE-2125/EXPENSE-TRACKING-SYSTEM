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
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Enums
constEXPENSE_TYPE_ENUM = [
  "Games",
  "Movies",
  "Music",
  "Sports",
  "Dining Out",
  "Groceries",
  "Liquor",
  "Electronics",
  "Furniture",
  "Rent",
  "Pets",
  "Maintenance",
  "Childcare",
  "Taxes",
  "Clothing",
  "Education",
  "Gifts",
  "Medical",
  "Insurance",
  "Bus",
  "Train",
  "Car",
  "Fuel",
  "Hotel",
  "Praking",
  "Taxi",
  "Flight",
  "General",
  "WIFI/Internet",
  "Water",
  "Electricty",
  "Heat",
  "Cleaning",
  "Trash",
];

const GROUP_TYPE_ENUM = ["Home", "Trip", "Couple", "Other"];
export {
  PORT,
  MONGO_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  DB_NAME,
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  EXPENSE_TYPE_ENUM,
  GROUP_TYPE_ENUM,
};
