import { Schema, model } from "mongoose";
import { GROUP_TYPE_ENUM } from "../config.js";
import { Expense } from "./expense.model.js";
const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: GROUP_TYPE_ENUM,
      required: true,
    },
    groupPic: {
      type: String,
    },
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  {
    // Define the unique compound index using an object notation
    unique: true,
    index: { name: 1, creator: 1 },
  },
  { timestamps: true }
);
groupSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      // Delete all debts related to this group
      const expenses = await Expense.find({ group: this._id });
      for (const element of expenses) {
        await Debt.deleteMany({ splitId: element?._id });
      }
      await Expense.deleteMany({ group: this._id });

      // Delete all expenses related to this group

      next();
    } catch (error) {
      next(error); // Pass errors to the next middleware or handler
    }
  }
);
export const Group = model("Group", groupSchema);
