import { Router } from "express";
import { isAuthenicated } from "../middlewares/auth.middleware.js";
import {
  addExpense,
  getExpenses,
  totalCredit,
  totalDebt,
} from "../controllers/expense.controller.js";
const router = Router();
router.route("/add-expense").post(isAuthenicated, addExpense);
router.route("/").get(isAuthenicated, getExpenses);
router.route("/total-debt-amount").get(isAuthenicated, totalDebt);
router.route("/total-credit-amount").get(isAuthenicated, totalCredit);
export default router;
