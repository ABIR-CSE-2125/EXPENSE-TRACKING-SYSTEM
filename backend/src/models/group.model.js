import { Schema, model } from "mongoose";
import { GROUP_TYPE_ENUM } from "../config.js";
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
export const Group = model("Group", groupSchema);
