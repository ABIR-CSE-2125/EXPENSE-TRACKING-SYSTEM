import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config.js";
const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// route imports
import userRouter from "./routes/user.route.js";
// import friendsRouter from "./routes/friends.route.js";
import expenseRouter from "./routes/expense.route.js";
// routings

const v1ApiRootUrl = "/api/v1";

app.use(v1ApiRootUrl + "/user", userRouter);
// app.use(v1ApiRootUrl + "/api/v1/friends", friendsRouter);
app.use(v1ApiRootUrl + "/expense", expenseRouter);
export default app;
