import { Router } from "express";
import { isAuthenicated } from "../middlewares/auth.middleware.js";
import {
  addExpense,
  editExpense,
  getExpenses,
  getLatestEpenses,
  totalCredit,
  totalDebt,
} from "../controllers/expense.controller.js";
const router = Router();
router.route("/add-expense").post(isAuthenicated, addExpense);
router.route("/").get(isAuthenicated, getExpenses);
router.route("/total-debt-amount").get(isAuthenicated, totalDebt);
router.route("/total-credit-amount").get(isAuthenicated, totalCredit);
router.route("/edit-expense").patch(isAuthenicated, editExpense);
router.route("/latest").get(isAuthenicated, getLatestEpenses);
export default router;
