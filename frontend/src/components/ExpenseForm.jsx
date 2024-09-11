import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EXPENSE_TYPE_ENUM, v1ApiRootUrl } from "../constants";
import { Input, Dropdown } from "./index";
import { getFriendsService, getGroupsService } from "../Services/userServices";
import axios from "axios";

const ALLFRIENDS = [];
const splitModes = ["Select", "equal", "exact"];

function ExpenseForm(props) {
  // Fetching the store data---------------------------------
  const stateUserData = useSelector((state) => state.userData);
  // console.log("redux state", stateUserData);
  const paidBy = stateUserData;

  // States------------------------------------------------------------------
  const [totalAmount, SetTotalAmount] = useState(0);
  const [splitStatus, setSplitStatus] = useState(false);
  const [splitMode, setSplitMode] = useState("");
  const [catagory, setCatagory] = useState("General");
  const [groupId, setGroupId] = useState(null);
  const [groups, setGroups] = useState([{}]);
  const [description, setDescription] = useState("");
  const [allUsers, setAllUsers] = useState([{}]);
  const [date, setDate] = useState(Date.now().toString());
  const [hasMounted, setHasMounted] = useState(false);
  const [warning, setWarning] = useState(null);
  const [shares, setShares] = useState([
    {
      user: paidBy,
      amount: totalAmount,
      paid: true,
    },
  ]);

  const initList = async () => {
    const users = await getFriendsService();
    // console.log("from service : ", users);
    users.forEach((user) => {
      ALLFRIENDS.push(user);
    });
    setAllUsers([...allUsers, ...users]);
  };
  const initGroupList = async () => {
    const groupList = await getGroupsService();
    setGroups([...groups, ...groupList]);
  };

  const handleIdSelect = (id) => {
    const user = ALLFRIENDS.find((obj) => obj._id === id);
    console.log("From handle id select : ", user);

    setAllUsers(allUsers.filter((prevUser) => prevUser._id !== user._id));

    setShares((prevSahres) => {
      const sortedShares = [
        ...prevSahres,
        { user, amount: 0, paid: false },
      ].sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      return sortedShares;
    });
  };

  const handleIdRemove = (user) => {
    // setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    setAllUsers([...allUsers, user]);
    setShares(shares.filter((share) => share.user._id !== user._id));
  };

  const handleAmountChange = (user, amount, paid) => {
    const updatedShares = shares.filter((share) => share.user._id !== user._id);
    // let total =
    //   updatedShares.reduce((acc, share) => acc + share.amount, 0) + newAmount;
    updatedShares.push({ user, amount, paid });
    updatedShares.sort((a, b) =>
      a.user.firstName.localeCompare(b.user.firstName)
    );
    setShares([...updatedShares]);
  };

  const paidStatusChange = (user, amount, paid) => {
    const updatedShares = shares.filter((share) => share.user._id !== user._id);
    updatedShares.push({ user, amount, paid: !paid });
    updatedShares.sort((a, b) =>
      a.user.firstName.localeCompare(b.user.firstName)
    );
    setShares([...updatedShares]);
  };

  const splitEqual = () => {
    const numberOfMembers = shares.length;
    const shareAmount = totalAmount / numberOfMembers;
    if (shares.length === 0) return;
    const newShares = shares.map((share) => ({
      ...share,
      amount: shareAmount,
    }));
    setShares(newShares);
  };

  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const initialize = async () => {
      await initList();
      setHasMounted(true);
    };
    if (!hasMounted) initialize();
  }, [hasMounted]);

  useEffect(() => {
    if (splitMode === "equal") splitEqual();
  }, [shares.length, splitMode]);
  // Input handlers--------------------------------------------------------------------------------------------------------

  // Total Amount
  const onChangeTotalAmount = (e) => {
    console.log("totalAmount");
    const updatedAmount = Number(e.target.value);
    // console.log(updatedAmount);

    setShares((prevShares) => {
      const exceptOwner = prevShares.filter(
        (share) => share.user._id !== paidBy._id
      );

      return [
        ...exceptOwner,
        { user: paidBy, amount: updatedAmount, paid: true },
      ];
    });
    // console.log(shares);

    SetTotalAmount(updatedAmount);

    console.log(e.target.value);
  };
  // Split or Not
  const onChangeSplitStatus = () => {
    console.log("splitStatus", splitStatus);

    if (splitStatus === false) {
      initGroupList();
    }
    setSplitStatus(!splitStatus);
  };

  // Mode of Split
  const onChangeSplitMode = (e) => {
    console.log("splitMode");
    console.log(e.target.value);
    setSplitMode(e.target.value);
  };

  // Catagory
  const onChangeCatagory = (e) => {
    console.log("catagory");
    console.log(e.target.value);
    setCatagory(e.target.value);
  };
  const onChangeGroupId = (e) => {
    console.log("Group Id");
    console.log(e.target.value);
    setGroupId(e.target.value);
  };

  // Date
  const onChangeDate = (e) => {
    console.log("date");
    console.log(e.target.value);
    setDate(e.target.value);
  };
  const onDescriptionChange = (e) => {
    console.log("Description");
    setDescription(e.target.value);
  };

  // Submit Function

  const checkEqual = () => {
    let totalByShares = 0;
    shares.forEach((share) => {
      totalByShares += share.amount;
    });
    if (totalAmount != totalByShares) {
      console.log(typeof totalByShares, totalByShares);
      console.log(typeof totalAmount, totalAmount);
      console.log("Launching Total Amount Not Match Warning");
      setWarning(
        "Total Amoount of shares does not match the total amount paid"
      );
    } else {
      setWarning(null);
    }
    return warning === null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shares.length !== 0 && checkEqual() === false) {
      console.log("Can't process Further");
      return;
    }
    console.log("Submit");
    console.log("owner", paidBy);
    console.log("totalAmount", totalAmount);
    console.log("splitStatus", splitStatus);
    console.log("splitMode", splitMode);
    console.log("catagory", catagory);
    console.log("date", typeof date, date);
    console.log("shares : ", shares);
    let payload = {
      description: description,
      type: catagory,
      amount: totalAmount,
      date: date,
    };
    if (splitStatus === true) {
      const splitInfo = shares.map((share) => ({
        id: share.user._id,
        amount: share.amount,
        paid: share.paid,
      }));
      JSON.stringify(splitInfo);
      payload = {
        ...payload,
        shares: splitInfo,
      };
    }
    JSON.stringify(payload);
    console.log(payload);
    if (groupId === null) {
      const response = await axios.post(
        v1ApiRootUrl + "/expense/add-expense",
        { ...payload },
        {
          withCredentials: true,
          params: {
            isSplit: splitStatus === true ? "1" : "0",
          },
        }
      );
      console.log(response);
      return;
    }
    const response = await axios.post(
      v1ApiRootUrl + "/expense/add-expense",
      { ...payload },
      {
        withCredentials: true,
        params: {
          isSplit: splitStatus === true ? 1 : 0,
          groupId: groupId,
        },
      }
    );
    console.log(response);
  };

  return (
    <>
      <div className="m-4 p-6 max-w-lg border-2 border-gray-300 bg-gray-100 rounded-lg shadow-lg min-w-fit">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Desciption */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              placeholder="Description"
              className="p-3 rounded-md border-2 border-gray-300 bg-white focus:outline-none focus:border-blue-500"
              eventHandler={onDescriptionChange}
            />
          </div>
          {/* Total Amount Input */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <Input
              placeholder="Enter total amount"
              className="p-3 rounded-md border-2 border-gray-300 bg-white focus:outline-none focus:border-blue-500"
              eventHandler={onChangeTotalAmount}
            />
          </div>

          {/* Date Input */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              className="p-3 rounded-md border-2 border-gray-300 bg-white focus:outline-none focus:border-blue-500"
              eventHandler={onChangeDate}
            />
          </div>

          {/* Category Input */}
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-1">
              Category
            </label>
            <Dropdown
              options={EXPENSE_TYPE_ENUM}
              className="p-3 rounded-md border-2 border-gray-300 bg-white"
              eventHandler={onChangeCatagory}
            />
          </div>

          {/* Split Status Checkbox */}
          <div className="flex items-center">
            <Input
              type="checkbox"
              checked={splitStatus}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={onChangeSplitStatus}
              label="Split?"
            />
          </div>

          {/* If Bill is Split */}
          {splitStatus && (
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 mb-1">
                  Split Mode
                </label>
                <Dropdown
                  options={splitModes}
                  className="p-3 rounded-md border-2 border-gray-300 bg-white"
                  eventHandler={onChangeSplitMode}
                />
              </div>

              {/* Groups DropDown */}
              <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 mb-1">
                  Groups
                </label>
                <select
                  className="px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => onChangeGroupId(e)}
                >
                  {groups?.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group?.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Members Dropdown */}
              <div className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 mb-1">
                  Split With
                </label>
                <select
                  className="px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleIdSelect(e.target.value)}
                >
                  {allUsers?.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user?.firstName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                {shares?.map(({ user, amount, paid }) => (
                  <div
                    key={user._id}
                    className="flex items-center space-x-4 border p-4 rounded-md bg-white shadow-sm"
                  >
                    <input
                      type="text"
                      readOnly
                      value={user.firstName}
                      className="p-2 border rounded-md bg-gray-100"
                    />
                    <input
                      type="number"
                      value={amount}
                      readOnly={splitMode === "equal"}
                      onChange={(e) =>
                        handleAmountChange(user, parseInt(e.target.value), paid)
                      }
                      className="p-2 border rounded-md bg-gray-100"
                    />
                    <input
                      type="checkbox"
                      checked={paid}
                      className="p-2 border rounded-md bg-gray-100"
                      onChange={() => paidStatusChange(user, amount, paid)}
                    />
                    {user._id !== paidBy._id && (
                      <button
                        type="button"
                        onClick={() => handleIdRemove(user)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // disabled={warning !== null}
            onClick={checkEqual}
          >
            Submit
          </button>
          {warning !== null && (
            <p className="text-red-500">Total does not match</p>
          )}
        </form>
      </div>
    </>
  );
}

export default ExpenseForm;
