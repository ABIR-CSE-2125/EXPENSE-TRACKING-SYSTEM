import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
// const app = express();

dotenv.config({
  path: "./env",
});
connectDB();
