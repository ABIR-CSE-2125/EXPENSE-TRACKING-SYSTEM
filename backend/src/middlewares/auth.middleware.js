import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.util.js";
import { ACCESS_TOKEN_SECRET } from "../config.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";

export const isAuthenicated = asyncHandler(async (req, res, next) => {
  try {
    const accesToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!accesToken) {
      return res.status(401).json(new ApiError(401, "No Authorization"));
    }

    const decodedAccessToken = jwt.verify(accesToken, ACCESS_TOKEN_SECRET);
    const verifiedUser = await User.findById(decodedAccessToken?._id).select(
      "-password -refreshToken"
    );

    if (!verifiedUser) {
      return res.status(404).json(new ApiError(404, "Invalid Acces Token"));
    }

    req.user = verifiedUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message + "\nIssue in Authentication"));
  }
});
