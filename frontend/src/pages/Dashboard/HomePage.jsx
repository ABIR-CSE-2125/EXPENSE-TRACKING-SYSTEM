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
  // console.log("IN home check user : ", USERDATA, RECENT);
  // console.log("IN home check friend : ", FRIENDDATA);
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
    const data = await getExpenseService();
    console.log("expenses \n", ...data);
    const onwerExp = data.filter((item) => item.paidBy === USERDATA._id);
    setPaidExpenses([...onwerExp]);
    const toPayExp = data.filter((item) => item.paidBy !== USERDATA._id);
    setPayExpenses([...toPayExp]);
  };

  const toExpenseForm = () => {
    navigate("/expense/add");
  };

  useEffect(() => {
    fetchTotalDebit();
    fetchTotalCredit();
    fetchExpenses();
  }, []);

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
                {totalCredit - totalDebt}
              </p>
            )}
            {totalCredit - totalDebt < 0 && (
              <p className="text-lg font-semibold text-red-500">
                {totalCredit - totalDebt}
              </p>
            )}
          </div>

          <div className="border-r-2 border-gray-300">
            <p className="text-sm text-gray-500">You Owe</p>
            <p className="text-lg font-semibold text-red-500">{totalDebt}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">You Are Owed</p>
            <p className="text-lg font-semibold text-green-500">
              {totalCredit}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center text-gray-500">
          <div className="border-r-2 border-gray-300">
            <p className="text-lg font-semibold">You Owe</p>
            <ul className="mt-2 space-y-2 px-4 max-h-96 overflow-y-auto">
              {payExpenses &&
                payExpenses.map((expense) => (
                  <li className="rounded-lg bg-slate-200 px-4 py-2 shadow-sm hover:bg-slate-300 transition duration-300">
                    <p>
                      {expense.description === " "
                        ? "No Description"
                        : expense.description}
                    </p>
                    <p>{expense.amount}</p>
                    <p>{expense.date}</p>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="text-lg font-semibold">You Are Owed</p>
            <ul className="mt-2 space-y-2 px-4 max-h-96 overflow-y-auto">
              {paidExpenses &&
                paidExpenses.map((expense) => (
                  <li className="rounded-lg bg-slate-200 px-4 py-2 shadow-sm hover:bg-slate-300 transition duration-300">
                    <p>
                      {expense.description === " "
                        ? "No Description"
                        : expense.description}
                    </p>
                    <p>{expense.amount}</p>
                    <p>{expense.date}</p>
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
