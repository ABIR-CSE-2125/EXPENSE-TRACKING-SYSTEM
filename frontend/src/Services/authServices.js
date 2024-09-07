import axios from "axios";
import { v1ApiRootUrl } from "../constants";
// createUser Registers a new User and loggs him.\/her in on successful registration
export const registerService = async ({
  userName,
  email,
  password,
  firstName,
  lastName,
  currency,
  image,
}) => {
  try {
    console.log("image ", image[0]);

    const url = v1ApiRootUrl + "/user/register";
    const response = await axios.post(
      url,
      {
        userName,
        email,
        password,
        firstName,
        lastName,
        currency,
        image: image[0],
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response?.data);
    if (response?.data.success === true) {
      return await loginService({ email, password });
      // return response?.data //----- login sends the data
    } else {
      console.error("Registration Failed");
      //   return null;
    }
  } catch (error) {
    console.error("Auth Service Error :: Register Service :: ", error.message);
  }
};
// userLogin send the data of the profile with which the user logged in
export const loginService = async ({ email = null, password }) => {
  try {
    const url = v1ApiRootUrl + "/user/login";
    const response = await axios.post(
      url,
      { email, password },
      { withCredentials: true }
    );
    // console.log("service : ", response.data);

    if (response?.data.success === true) {
      // console.log("service ", response);
      return response?.data.data;
    } else {
      // TODO: Hadeling the 401 reponse is pending
      console.error("Login Failed");
      return null;
    }
  } catch (error) {
    console.error("Auth Service Error :: Login Service :: ", error.message);
  }
};

export const logoutService = async () => {
  try {
    const url = v1ApiRootUrl + "/user/logout";
    const response = await axios.post(url);
    if (response?.data.success === true) {
      console.log("User Logged Out Successfully");
      return;
    } else {
      console.error("Logout Failed");
    }
  } catch (error) {
    console.error("Auth Service Error :: Logout Service :: ", error.message);
  }
};

export const getUserDetailsService = async () => {
  try {
    const url = v1ApiRootUrl + "/user";
    const response = await axios(url);
    if (response?.data.success === true) return response?.data;
    return null;
  } catch (error) {
    console.error("Auth Service Error :: Get Service :: ", error.message);
  }
};

export const editProfileService = async ({
  firstName,
  lastName,
  email,
  phone,
  sex,
  city,
  currency,
}) => {
  try {
    const url = v1ApiRootUrl + "/user/update";
    const response = await axios.patch(url, {
      firstName,
      lastName,
      email,
      phone,
      sex,
      city,
      currency,
    });
    if (response?.data.success === true) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error(
      "Auth Service Error :: Update Profile Service :: ",
      error.message
    );
  }
};
export const editProfilePicService = async ({ image }) => {
  try {
    const url = v1ApiRootUrl + "/user/update-ProfilePic";
    const response = await axios.patch(
      url,
      { image: image[0] },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.data?.success === true) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    console.error(
      "Auth Service Error :: Update Profile Pic Service :: ",
      error.message
    );
  }
};

export const changePasswordServie = async ({ oldPassword, newPassword }) => {
  try {
    const url = v1ApiRootUrl + "/user/changePassword";
    const response = await axios.patch(url, { oldPassword, newPassword });
    if (response?.data?.success === true) return "success";
    return null;
  } catch (error) {
    console.error(
      "Auth Service Error :: Change Password Service :: ",
      error.message
    );
  }
};
