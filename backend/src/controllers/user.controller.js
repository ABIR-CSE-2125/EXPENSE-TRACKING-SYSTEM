import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import validator from "validator";
import { User } from "../models/user.model.js";
const options = {
  httpOnly: true,
  // when we push in production make secure true
  //   secure: true,
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Issue in Access and Refresh Token Generation"));
  }
};

export const register = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password, firstName, lastName, currency } =
      req.body;

    console.log(req.body);
    if (
      [userName, email, password, firstName, lastName, currency].some(
        (field) => field === ""
      )
    ) {
      return res.status(400).json(new ApiError(400, "All Fields are required"));
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json(new ApiError(400, "Not a valid Email Id"));
    }

    const username = userName.toLowerCase();
    const user = await User.findOne({
      $or: [{ userName: username }, { email }],
    });
    console.log("Into the controller");

    if (user) {
      return res
        .status(409)
        .json(new ApiError(409, "User with username or email already exists"));
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
    // console.log("User Creation start");
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
    // console.log("User Creation complete");
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong while registering the user")
        );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error?.message || "Registration Error"));
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    // console.log(req.body);
    // console.log("inside login");
    if (!(userName || email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Email or Username is requiered"));
    }

    if (!password) {
      return res.status(400).json(new ApiError(400, "Password is required"));
    }
    const user = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }
    const isValid = await user.isPasswordCorrect(password);
    console.log(isValid);
    if (!isValid) {
      return res.status(401).json(new ApiError(401, "Password Invalid"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "Login Successfull"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Issue in Login"));
  }
});
