import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Expense } from "../models/expense.model.js";
import { Debt } from "../models/debt.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import mongoose from "mongoose";
import { LATESTENTRIESCOUNT } from "../config.js";
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

export const getExpenses = asyncHandler(async (req, res) => {
  try {
    const { friend_id, group_id } = req.query;
    const userId = req.user?._id;
    const friend = new mongoose.Types.ObjectId(friend_id + "");
    const group = new mongoose.Types.ObjectId(group_id + "");
    let expenses;
    if (friend_id !== null) {
      expenses = await Expense.find({
        $or: [{ paidBy: friend }, { "splitInfo.member": friend }], // Include expenses where user is payer or in splitInfo
      });
    } else if (group_id !== null) {
      expenses = await Expense.find({ group });
    } else {
      expenses = await Expense.find({
        $or: [{ paidBy: userId }, { "splitInfo.member": userId }], // Include expenses where user is payer or in splitInfo
      });
    }

    if (!expenses || expenses.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "No expneses with these Credentials"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, expenses, "Expense Data Fetched Successfully")
      );
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Retriving Expense Data"),
      message: error.message,
    });
  }
});

export const editExpense = asyncHandler(async (req, res) => {
  try {
    const { shares, description, type, date, amount, groupId, eId } = req.body;
    const splitInfo = shares.map((share) => ({
      member: new mongoose.Types.ObjectId(share.id + ""),
      splitAmount: share.amount,
      paid,
    }));

    const oldExpense = await Expense.findById(eId);
    if (!oldExpense) {
      return res
        .status(500)
        .json(new ApiError(500, "Expense Record not found"));
    }
    console.log(oldExpense);
    const session = new mongoose.startSession();
    await session.startTransaction();
    for (const splitObj of splitInfo) {
      const updateddebtInfo = await Debt.findOneAndUpdate(
        {
          $or: [{ splitId: oldExpense?._id }, { debtor: splitObj.member }],
        },
        {
          $set: {
            amount: splitObj.splitAmount,
          },
        },
        {
          $new: true,
        }
      );
      if (!updateddebtInfo) {
        await session.abortTransaction();
        return res
          .status(500)
          .json(
            new ApiError(500, "Mongo Error in updaing the Debt Collection")
          );
      }
    }
    const newExpense = await Expense.findByIdAndUpdate(
      oldExpense?._id,
      {
        $set: {
          description,
          type,
          amount,
          date,
          splitInfo,
          group: groupId || null,
        },
      },
      { $new: true }
    );

    if (!newExpense) {
      await session.abortTransaction();
      return res
        .status(500)
        .json(
          new ApiError(500, "Mongo Error in Updating the Expense Colleciton")
        );
    }
    await session.commitTransaction();
    await session.endSession();
    return res
      .status(200)
      .json(new ApiResponse(200, newExpense, "Expense Updated Successfully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Expense Edditng"),
      message: error.message,
    });
  }
});
export const totalDebt = asyncHandler(async (req, res) => {
  try {
    let debit = await Debt.aggregate([
      {
        $match: {
          debtor: req.user?._id,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
        },
      },
    ]);

    if (!debit || debit.length === 0) debit = 0;
    return res
      .status(200)
      .json(new ApiResponse(200, { debtAmount: debit }, "Debitable amount"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Fetching Debitable Amount"),
      message: error.message,
    });
  }
});

export const totalCredit = asyncHandler(async (req, res) => {
  try {
    let credit = await Debt.aggregate([
      {
        $match: {
          creditor: req.user?._id,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
        },
      },
    ]);

    if (!credit || credit.length === 0) credit = 0;
    return res
      .status(200)
      .json(
        new ApiResponse(200, { creditAmount: credit }, "Creditable amount")
      );
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Fetching Creditable Amount"),
      message: error.message,
    });
  }
});

export const getLatestEpenses = asyncHandler(async (req, res) => {
  try {
    const entryCount = LATESTENTRIESCOUNT;
    const userId = req.user?._id;
    const expenses = await Expense.find({
      $or: [{ paidBy: userId }, { "splitInfo.member": userId }], // Include expenses where user is payer or in splitInfo
    })
      .sort({ updatedAt: -1 }) // Sort by createdAt in descending order
      .limit(entryCount);

    if (!expenses) {
      return res.status(400).json(new ApiError(400, "Wrong Credentials"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, expenses, `Last ${entryCount} expenses fetched`)
      );
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Latest Expenses"),
      message: error.message,
    });
  }
});