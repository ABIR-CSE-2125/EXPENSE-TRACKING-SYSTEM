import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  getExpenseService,
  getTotalCreditAmountExpenseService,
  getTotalDebtAmountExpenseService,
} from "../../Services/userServices";

function HomePage(props) {
  const navigate = useNavigate();
  // States------------------------------------------------------------------------------------------------------------------------------
  const [totalDebt, setTotalDebt] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [paidExpenses, setPaidExpenses] = useState([]);
  const [payExpenses, setPayExpenses] = useState([]);
  // Store Data--------------------------------------------------------------------------------------------------------------------------
  const USER = useSelector((state) => state.auth);
  const USERDATA = USER.userData;
  const RECENT = USER.recent;
  const FRIENDDATA = useSelector((state) => state.friend.friendData);
  const GROUPDATA = useSelector((state) => state.group.groupData);
  console.log("IN home check user : ", USERDATA, RECENT);
  console.log("IN home check friend : ", FRIENDDATA);
  // console.log("IN home check group : ", GROUPDATA);
  const fetchTotalDebit = async () => {
    let data = await getTotalDebtAmountExpenseService();
    // console.log("debt", data);
    if (data !== 0) data = data[0].totalAmount;
    setTotalDebt(data);
  };
  const fetchTotalCredit = async () => {
    let data = await getTotalCreditAmountExpenseService();
    if (data !== 0) data = data[0].totalAmount;
    // console.log("credit", data);
    setTotalCredit(data);
  };

  const fetchExpenses = async () => {
    const friend_id = FRIENDDATA?._id;
    const group_id = GROUPDATA?._id;
    const data = await getExpenseService(friend_id, group_id);
    console.log("expenses \n", data);
    const onwerExp = data.filter(
      (item) => item.paidBy?._id === USERDATA._id && item.isSplit === true
    );
    setPaidExpenses([...onwerExp]);
    let toPayExp = data.filter(
      (item) => item.paidBy?._id !== USERDATA._id && item.isSplit === true
    );
    console.log(toPayExp);
    console.log("friends data : ---> ", FRIENDDATA);
    if (FRIENDDATA) {
      toPayExp = toPayExp.filter(
        (item) =>
          item.paidBy?._id === FRIENDDATA?._id &&
          item.splitInfo.some((o) => o?._id === USERDATA?._id)
      );
    }
    console.log(toPayExp);

    setPayExpenses([...toPayExp]);
  };
  // Helper Functions
  const calculateDebt = (obj) => {
    const p = obj?.splitInfo
      .filter((i) => i?.member?._id === USERDATA?._id)
      .map((i) => i?.splitAmount);
    // console.log(p);

    return p ? p[0]?.toFixed(2) : null;
  };

  const calculateCredit = (obj) => {
    const p = obj?.splitInfo
      .filter((i) => i?.paid === false)
      .reduce((acc, i) => acc + i?.splitAmount, 0);
    // console.log(p);
    return p;
  };

  const toExpenseForm = () => {
    navigate("/expense/add");
  };

  useEffect(() => {
    fetchTotalDebit();
    fetchTotalCredit();
    fetchExpenses();
  }, [USERDATA, FRIENDDATA, GROUPDATA]);

  return (
    <>
      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <div className="mb-4 flex justify-between items-center border-b-2 border-black pb-2">
          <div className="text-2xl font-semibold text-black">Dashboard</div>
          <button
            type="button"
            className="rounded-lg bg-orange-500 px-3 py-1 text-sm font-medium text-white hover:bg-orange-600 transition duration-300"
            onClick={() => toExpenseForm()}
          >
            Add Expense
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 border-b-2 border-gray-400 pb-4 text-center">
          <div className="border-r-2 border-gray-300">
            <p className="text-sm text-gray-500">Total Balance</p>
            {totalCredit - totalDebt >= 0 && (
              <p className="text-lg font-semibold text-green-500">
                {(totalCredit - totalDebt).toFixed(2)}
              </p>
            )}
            {totalCredit - totalDebt < 0 && (
              <p className="text-lg font-semibold text-red-500">
                {-(totalCredit - totalDebt).toFixed(2)}
              </p>
            )}
          </div>

          <div className="border-r-2 border-gray-300">
            <p className="text-sm text-gray-500">You Owe</p>
            <p className="text-lg font-semibold text-red-500">
              {totalDebt.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">You Are Owed</p>
            <p className="text-lg font-semibold text-green-500">
              {totalCredit.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center text-gray-500">
          <div className="border-r-2 border-gray-300">
            <p className="text-lg font-semibold">You Owe</p>
            <ul className="mt-2 space-y-2 px-4 py-2 max-h-96 overflow-y-auto">
              {payExpenses &&
                payExpenses.map((expense) => (
                  <li
                    className="rounded-lg bg-slate-100 px-6 py-4 shadow-md hover:bg-slate-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                    key={expense._id}
                  >
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-700">
                        {expense?.description === " "
                          ? "No Description"
                          : expense?.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense?.paidBy.firstName}
                      </p>
                      <p className="text-md font-medium text-gray-800">
                        {calculateDebt(expense)}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold">You Are Owed</p>
            <ul className="mt-2 space-y-2 px-4 py-2 max-h-96 overflow-y-auto">
              {paidExpenses &&
                paidExpenses.map((expense) => (
                  <li className="rounded-lg bg-slate-100 px-6 py-4 shadow-md hover:bg-slate-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex flex-col space-y-1">
                      <p className="text-md font-bold text-gray-800">
                        {expense?.description.trim() === ""
                          ? "No Description"
                          : expense?.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Amount : ${calculateCredit(expense)}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
