import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import validator from "validator";
import { User } from "../models/user.model.js";

export const register = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password, firstName, lastName, currency } =
      req.body;
    if ([userName, email, password].some((field) => field?.trim === "")) {
      throw new ApiError(400, "All Fields are required");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Not a valid Email Id");
    }

    const username = userName.toLowerCase();
    const user = await User.findOne({
      $or: [{ userName: username }, { email }],
    });
    console.log("Into the controller");

    if (user) {
      throw new ApiError(400, "User with username or email already exists");
    }

    let profilePicLocalPath;

    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      profilePicLocalPath = req.files?.image[0].path;
    }

    const profilePic = await uploadOnCloudinary(profilePicLocalPath);
    console.log("User Creation start");
    const newUser = await User.create({
      userName: username,
      password,
      currency,
      firstName,
      lastName,
      email,
      profilePic:
        profilePic?.url ||
        "https://res.cloudinary.com/djdovu3h2/image/upload/v1721574760/user_s1tu6k.png",
    });
    console.log("User Creation complete");
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Registration Error");
  }
});
