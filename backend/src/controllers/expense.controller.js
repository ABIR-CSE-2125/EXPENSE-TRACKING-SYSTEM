import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Expense } from "../models/expense.model.js";
import { Debt } from "../models/debt.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import mongoose from "mongoose";
export const addExpense = asyncHandler(async (req, res) => {
  try {
    const { isSplit, groupId } = req.query;
    let group;
    if (groupId) group = new mongoose.Types.ObjectId(groupId + "");
    const { shares, description, type, date, amount } = req.body;
    const paidBy = req.user?._id;

    // When there is no bill splitting
    if (isSplit == 0) {
      console.log(isSplit);
      const expense = await Expense.create({
        paidBy,
        description: description || " ",
        type: type || "General",
        amount,
        isSplit: false,
        date,
      });
      if (!expense) {
        return res
          .status(400)
          .json(new ApiError(400, "Mongo Error in creating expense"));
      }
      return res
        .status(201)
        .json(new ApiResponse(201, expense, "Expnse Added Successfully"));
    }
    // when there is bill splitting
    if (!shares) {
      return res.status(400).json(new ApiError(400, "No Splitting Data Found"));
    }
    const splitInfo = shares.map((share) => ({
      member: new mongoose.Types.ObjectId(share.id + ""),
      splitAmount: share.amount,
      paid: false,
    }));

    const expense = await Expense.create({
      paidBy,
      description: description || " ",
      type: type || "General",
      amount,
      isSplit: true,
      date,
      splitInfo,
      group: group || null,
    });
    if (!expense) {
      return res
        .status(500)
        .json(new ApiError(500, "Mongo Error in creating expense"));
    }

    for (const splitObj of splitInfo) {
      const debtInfo = await Debt.create({
        creditor: paidBy,
        debtor: splitObj.member,
        amount: splitObj.splitAmount,
        splitId: expense._id,
      });
      //   console.log(debtInfo);
      if (!debtInfo) {
        return res
          .status(500)
          .json(new ApiError(500, "Issue in Creating Debt record"));
      }
    }
    return res
      .status(201)
      .json(new ApiResponse(201, expense, "Expnse Added Successfully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Adding Expense"),
      message: error.message,
    });
  }
});
