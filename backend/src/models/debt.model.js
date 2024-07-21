import { Schema, model } from "mongoose";
const debtSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    splitId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },
  },
  { timestamps: true }
);
export const Debt = model("Debt", debtSchema);
