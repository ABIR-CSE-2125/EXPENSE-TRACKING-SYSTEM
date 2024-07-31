import { Schema, model } from "mongoose";
import { EXPENSE_TYPE_ENUM } from "../config.js";

const splitDataSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splitAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const expenseSchema = new Schema(
  {
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      //The broader catagories will be taken care of using a map while writting te conrtollers
      type: String,
      enum: EXPENSE_TYPE_ENUM,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    isSplit: {
      type: Boolean,
      required: true,
      default: false,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    date: {
      type: String,
      required: true,
    },
    splitInfo: { type: [splitDataSchema] },
  },
  { timestamps: true }
);
export const Expense = model("Expense", expenseSchema);
