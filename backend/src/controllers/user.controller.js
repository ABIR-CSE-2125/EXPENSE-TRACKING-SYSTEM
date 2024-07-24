import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config.js";
import { deleteFromCloudinary } from "../utils/deleteFile.util.js";
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
    console.log(accessToken);
    console.log(refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return {};
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
      "-password -refreshToken -friends -groups"
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

    if (!accessToken) {
      return res
        .status(500)
        .json(new ApiError(500, "Issue in Token Generation"));
    }
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken -friends -groups"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {
          userDate: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    return res.status(500).json({
      Error: new ApiError(500, "Issue in Login"),
      message: error.message,
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findOneAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export const refershAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "No Auth Token recieved from Cookies"));
    }

    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET
    );

    const currentUser = await User.findById(decodedRefreshToken?._id).select(
      "-password -friends -groups"
    );
    if (!currentUser) {
      return res.status(401).json(new ApiError(401, "Invalid Refresh Token"));
    }

    if (currentUser.refreshToken !== incomingRefreshToken) {
      return res.status(401).json(new ApiError(401, "Refresh Token Expired"));
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(currentUser._id);
    console.log("Just Before Res");
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        Error: new ApiError(400, "Session Has Expired. Log in to continue"),
      });
    }
    return res.status(500).json({
      Error: new ApiError(500, "Issue in Refreshing Access Token"),
      message: error.message,
    });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json(new ApiError(400, "All Fields are required"));
    }
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json(new ApiError(401, "Unauthorised Access"));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "Password Changed Successfully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Change Password"),
      errorMessage: error.message,
    });
  }
});
export const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Data Fetched Successfully"));
});
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const updatableFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "sex",
      "city",
      "currency",
    ];
    const toSet = {};
    for (const field of updatableFields) {
      // console.log("Checking Field", field);
      if (!req.body[field]) {
        continue;
      }
      toSet[field] = req.body[field];
    }

    if (Object.keys(toSet).length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "No Fields Found to Update"));
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: toSet,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken -friends -groups");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Details updated successfully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Change Profile"),
      Message: error.message,
    });
  }
});
export const updateProfilePic = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    return res.status(400).json(new ApiError(400, "Image file is missing"));
  }

  const profilePic = await uploadOnCloudinary(imageLocalPath);

  if (!profilePic.url) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while uploading on image"));
  }

  const user = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      profilePic: profilePic.url,
    },
  }).select("-password -refreshToken -friends -groups");
  const oldUrl = user.profilePic;
  const liSlash = oldUrl.lastIndexOf("/");
  const liDot = oldUrl.lastIndexOf(".");

  const publicId = oldUrl.substring(liSlash + 1, liDot);
  const response = await deleteFromCloudinary(publicId);
  if (!response) {
    return res
      .status(500)
      .json(new ApiError(500, "Cloudinary Error : Removal"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "profile pic updated successfully"));
});
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const results = await User.findByIdAndDelete(req.user?._id);
    if (!results) {
      return res.status(400).json(new ApiError(400, "Issue In Credentials"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User Delted Succssfully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in User deletion"),
      message: error.message,
    });
  }
});
export const updateGroupsList = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Updating Groups"),
      message: error.message,
    });
  }
});

export const addFriends = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const userFriends = user.friends;
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json(new ApiError(400, "Email Has to be provided"));
    }

    if (email === user.email) {
      return res.status(400).json(new ApiError(400, "Try With Another Email"));
    }
    const friend = await User.findOne({ email }).select(
      "-password -refreshToken"
    );
    if (!friend) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Wrong Friend's Email Address! No such User Exists")
        );
    }
    userFriends.push(friend);
    user.friends = userFriends;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, friend, "Friend Added SuccessFully"));
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Updating Friends"),
      message: error.message,
    });
  }
});

export const getFriends = asyncHandler(async (req, res) => {
  const friendsIds = req.user.friends;
  const friends = await User.find({
    _id: {
      $in: friendsIds,
    },
  }).select("-password -refreshToken -friends -groups");
  return res
    .status(200)
    .json(new ApiResponse(200, friends, "Freinds Data Fetched"));
});
export const deleteFriend = asyncHandler(async (req, res) => {
  //   Reconfirmation of deletion will be handled from frontend
  try {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json(new ApiError(400, "UserName Required"));
    }
    const user = req.user;
    const currentFriendsIds = user?.friends;
    if (currentFriendsIds.length === 0) {
      return res.status(400).json(new ApiError(400, "No Friends"));
    }
    const currentFriends = await User.find(
      {
        _id: {
          $in: currentFriendsIds,
        },
      },
      {
        userName: 1,
      }
    );
    const updatedFriends = currentFriends
      .filter((friend) => friend.userName !== userName)
      .map((friend) => friend._id);

    if (updatedFriends.length === currentFriends.length) {
      return res
        .status(400)
        .json(new ApiError(400, "This Person is not your Friend"));
    }
    const newUser = await User.findOneAndUpdate(
      user._id,
      {
        $set: {
          friends: updatedFriends,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    if (!newUser) {
      return res.status(500).json(new ApiError(500, "Issue in Saving Data"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, newUser, `Friend ${userName} Deleted Successfully`)
      );
  } catch (error) {
    return res.status(500).json({
      apiError: new ApiError(500, "Issue in Friend Deletion"),
      message: error.message,
    });
  }
});
