import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";
import { PORT } from "./config.js";
dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.listen(PORT || 3000, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
