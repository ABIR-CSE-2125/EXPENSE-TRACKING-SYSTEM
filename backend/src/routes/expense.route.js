import { Router } from "express";
import { isAuthenicated } from "../middlewares/auth.middleware.js";
import { addExpense } from "../controllers/expense.controller.js";
const router = Router();
router.route("/add-expense").post(isAuthenicated, addExpense);
export default router;
