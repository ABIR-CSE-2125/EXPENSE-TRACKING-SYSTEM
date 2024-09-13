import axios from "axios";
import { v1ApiRootUrl } from "../constants";
//Friends Services
export const addFriendsService = async ({ email }) => {
  try {
    const url = v1ApiRootUrl + "/user/add-friend";
    const response = await axios.post(
      url,
      { email },
      { withCredentials: true }
    );
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Add Friend Service :: ",
      error.message
    );
  }
};
export const getFriendsService = async () => {
  try {
    const url = v1ApiRootUrl + "/user/friends";
    const response = await axios.get(url, { withCredentials: true });
    // console.log("friends : ", response.data.data);

    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Get Friend Service :: ",
      error.message
    );
  }
};
export const removeFriendsService = async ({ userName }) => {
  try {
    const url = v1ApiRootUrl + "/user/remove-friend";
    const response = await axios.delete(
      url,
      { userName },
      { withCredentials: true }
    );
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Remove Friend Service :: ",
      error.message
    );
  }
};
// Group Services
export const addGroupsService = async ({
  groupName,
  description,
  type,
  members,
  image,
}) => {
  try {
    const url = v1ApiRootUrl + "//user/add-group";
    const response = await axios.post(
      url,
      {
        groupName,
        description,
        type,
        members,
        image: image[0],
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error("User Service Error :: Add Group Service :: ", error.message);
  }
};
export const getGroupsService = async () => {
  try {
    const url = v1ApiRootUrl + "/user/groups";
    const response = await axios.get(url, { withCredentials: true });
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error("User Service Error :: Get Group Service :: ", error.message);
  }
};
export const removeGroupsService = async ({ groupId }) => {
  try {
    const url = v1ApiRootUrl + "/user/remove-group";
    const response = await axios.delete(
      url,
      { groupId },
      { withCredentials: true }
    );
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Remove Group Service :: ",
      error.message
    );
  }
};
// Expense Services
export const addExpenseService = async ({
  shares,
  description,
  type,
  date,
  amount,
}) => {
  try {
    const url = v1ApiRootUrl + "/expense/add-expense";
    const response = await axios.post(url, {
      shares,
      description,
      type,
      date,
      amount,
    });
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Add Expense Service :: ",
      error.message
    );
  }
};
export const getExpenseService = async (friend_id, group_id, expense_id) => {
  try {
    const url = v1ApiRootUrl + "/expense";
    const response = await axios.get(url, {
      withCredentials: true,
      params: {
        friend_id,
        group_id,
        expense_id,
      },
    });
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Get Expense Service :: ",
      error.message
    );
  }
};
export const editExpenseService = async ({
  shares,
  description,
  type,
  date,
  amount,
  groupId,
  expenseId,
}) => {
  try {
    const url = v1ApiRootUrl + "expense/edit-expense";
    const response = await axios.post(
      url,
      {
        shares,
        description,
        type,
        date,
        amount,
        groupId,
        expenseId,
      },
      { withCredentials: true }
    );
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Edit Expense Service :: ",
      error.message
    );
  }
};
export const getRecentExpenseService = async () => {
  try {
    const url = v1ApiRootUrl + "/expense/latest";
    const response = await axios.get(url, { withCredentials: true });
    if (response?.data?.success === true) return response.data?.data;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Get Recent Expense Service :: ",
      error.message
    );
  }
};

// aggregate serices
export const getTotalDebtAmountExpenseService = async () => {
  try {
    const url = v1ApiRootUrl + "/expense/total-debt-amount";
    const response = await axios.get(url, { withCredentials: true });
    if (response?.data?.success === true)
      return response.data?.data?.debtAmount;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Get Total Debit Amount Expense Service :: ",
      error.message
    );
  }
};
export const getTotalCreditAmountExpenseService = async () => {
  try {
    const url = v1ApiRootUrl + "/expense/total-credit-amount";
    const response = await axios.get(url, { withCredentials: true });
    if (response?.data?.success === true)
      return response.data?.data?.creditAmount;
    return null;
  } catch (error) {
    console.error(
      "User Service Error :: Get Total Credit Amount Expense Service :: ",
      error.message
    );
  }
};
// // utility Services
// export const getAllUsers = async () => {
//   try {
//     const url = v1ApiRootUrl + "/user/all";
//     const response = await axios.get(url);
//     if (response?.data?.success === true) return response.data?.data;
//     return null;
//   } catch (error) {
//     console.error(
//       "User Service Error :: Get All Users Utility Service :: ",
//       error.message
//     );
//   }
// };
