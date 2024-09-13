import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { ApiError } from "../utils/apiError.util.js";
import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { Debt } from "../models/debt.model.js";
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
      // console.log(isSplit);
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
      paid: share.paid,
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
      if (splitObj.member.toString() === req.user?._id.toString()) continue;
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
    const { friend_id, group_id, expense_id } = req.query;
    const userId = req.user?._id;
    let expenses;
    if (friend_id) {
      const { debtEntries, totalDebt, credEntries, totalCredit } =
        await friendWiseExpenses(friend_id, userId);
      // console.log("debts : ", debtEntries);
      // console.log("creds : ", credEntries);
      // console.log(data);
      const s1 = debtEntries.map((i) => i.splitId);
      const s2 = credEntries.map((i) => i.splitId);
      expenses = [...s1, ...s2];
    } else if (group_id) {
      const group = new mongoose.Types.ObjectId(group_id + "");
      expenses = await Expense.find({ group: group_id })
        .sort({ updatedAt: -1 })
        .populate([
          { path: "paidBy", select: "_id firstName" },
          { path: "splitInfo.member", select: "_id firstName" },
        ]);
    } else if (expense_id) {
      expenses = await Expense.findById(expense_id).populate([
        { path: "paidBy", select: "_id firstName" },
        { path: "splitInfo.member", select: "_id firstName" },
      ]);
    } else {
      expenses = await Expense.find({
        $or: [{ paidBy: userId }, { "splitInfo.member": userId }], // Include expenses where user is payer or in splitInfo
      })
        .sort({ updatedAt: -1 })
        .populate([
          { path: "paidBy", select: "_id firstName" },
          { path: "splitInfo.member", select: "_id firstName" },
        ]);
    }

    if (!expenses || expenses.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "No expneses with these Credentials"));
    }
    // console.log(expenses);
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
    const { shares, description, type, date, amount, groupId, expenseId } =
      req.body;
    let splitInfo = [];
    if (shares) {
      splitInfo = shares.map((share) => ({
        member: new mongoose.Types.ObjectId(share.id + ""),
        splitAmount: share.amount,
        paid: share.paid,
      }));
    }

    const oldExpense = await Expense.findById(expenseId);
    if (!oldExpense) {
      return res
        .status(500)
        .json(new ApiError(500, "Expense Record not found"));
    }
    // console.log(oldExpense);
    const session = await mongoose.startSession();
    session.startTransaction();
    for (const splitObj of splitInfo) {
      if (splitObj.member.toString() === req.user?._id.toString()) continue;
      const updateddebtInfo = await Debt.findOneAndUpdate(
        {
          $and: [{ splitId: oldExpense?._id }, { debtor: splitObj.member }],
        },
        {
          $set: {
            amount: splitObj.splitAmount,
          },
        },
        {
          $new: true,
          session,
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
      expenseId,
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
      { $new: true, session }
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
    console.log(req.user._id);

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

const friendWiseExpenses = async (friendId, userId) => {
  try {
    const friend = new mongoose.Types.ObjectId(friendId + "");
    const user = new mongoose.Types.ObjectId(userId + "");
    const relevantEntries = await Debt.find({
      $or: [
        {
          $and: [{ debtor: friend }, { creditor: user }],
        },
        {
          $and: [{ debtor: user }, { creditor: friend }],
        },
      ],
    }).populate({
      path: "splitId",
      populate: [
        { path: "paidBy", select: "_id firstName" }, // Populate splitId.paidBy
        { path: "splitInfo.member", select: "_id firstName" }, // Populate splitId.splitInfo.member
      ],
    });
    if (!relevantEntries || relevantEntries.length === 0) {
      return {
        debtEntries: [],
        totalDebt: 0,
        credEntries: [],
        totalCredit: 0,
      };
    }
    console.log("rek", relevantEntries);

    const debtEntries = relevantEntries.filter((i) =>
      i.creditor.equals(friend)
    );
    const credEntries = relevantEntries.filter((i) => i.creditor.equals(user));
    const totalDebt = debtEntries.reduce((acc, i) => acc + i.amount, 0);
    const totalCredit = credEntries.reduce((acc, i) => acc + i.amount, 0);
    // console.log("debts : ", debtEntries);
    // console.log("creds : ", credEntries);
    // console.log("td : ", totalDebt);
    // console.log("tc : ", totalCredit);
    if (!credEntries) {
      console.log("2");
      return null;
    }

    if (!debtEntries) {
      console.log("1");
      return null;
    }
    console.log("hi");
    return {
      debtEntries,
      totalDebt,
      credEntries,
      totalCredit,
    };
  } catch (error) {
    return {
      debtEntries: [],
      totalDebt: 0,
      credEntries: [],
      totalCredit: 0,
    };
  }
};
