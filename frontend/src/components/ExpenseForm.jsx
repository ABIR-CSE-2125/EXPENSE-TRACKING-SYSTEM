import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EXPENSE_TYPE_ENUM } from "../constants";
import { Input, Dropdown } from "./index";
import { useFieldArray, useForm } from "react-hook-form";
import { getFriendsService } from "../Services/userServices";
function ExpenseForm(props) {
  const [totalAmount, SetTotalAmount] = useState(0);
  const [splitStatus, setSplitStatus] = useState(false);
  const [splitMode, setSplitMode] = useState("equal");
  const [allIds, setAllIds] = useState([]);
  const stateUserData = useSelector((state) => state.userData);
  console.log("redux state", stateUserData);
  const paidBy = stateUserData?._id;

  const [shares, setShares] = useState([
    {
      id: paidBy,
      amount: totalAmount,
      paid: true,
    },
  ]);
  const [hasMounted, setHasMounted] = useState(false);

  const defalutValues = {
    type: "Home",
    date: Date.now(),
    shares: [
      {
        id: paidBy,
        amount: totalAmount,
        paid: true,
      },
    ],
  };

  const initList = () => {
    const users = getFriendsService();
    setAllIds([...allIds, users]);
  };

  const handleIdSelect = (id) => {
    // setSelectedIds([...selectedIds, id]);
    setAllIds(allIds.filter((id) => id !== id));
    setShares([...shares, { id, amount: 0 }]);
  };

  const handleIdRemove = (id) => {
    // setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    setAllIds([...allIds, id]);
    setShares(shares.filter((share) => share.id !== id));
  };

  const handleAmountChange = (index, newAmount) => {
    const updatedItems = [...fields];
    updatedItems[index].amount = newAmount;
    setShares(updatedItems); // Update the itemsData state
  };
  const splitEqual = () => {
    const numberOfMembers = selectedIds.length;
    const shareAmount = totalAmount / numberOfMembers;
    if (shares.length === 0) return;
    const newShares = shares.map((share) => ({
      ...share,
      amount: shareAmount,
    }));
    setShares(newShares);
  };

  const { register, handleSubmit, control } = useForm(defalutValues);
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (!hasMounted) {
      initList();
      setHasMounted(true);
    }
    if (splitMode === "equal") splitEqual();
    else {
      setShares(
        fields.map((field) => ({ id: field.id, amount: field.amount }))
      );
    }
  }, [fields, shares, hasMounted]);
  // --------------------------------------------------------------------------------------------------------
  return (
    <>
      <div className="m-4 p-4 max-w-lg border-2 border-black bg-gray-200 rounded-lg shadow-lg">
        <form className="space-y-4" onSubmit={handleSubmit()}>
          {/* <!-- Total Amount Input --> */}
          <div className="flex flex-col">
            <Input
              label="Total Amount"
              placeholder="Enter total amount"
              className="mt-1 p-2 rounded-md border-2 border-black focus:outline-none focus:border-blue-500"
              onChange={SetTotalAmount((e) => e.target.value)}
              {...register("amount", { required: true })}
            />
            <input id="totalAmount" />
          </div>

          {/* Date input */}
          <div className="flex flex-col">
            <Input
              label="Date"
              type="date"
              className="mt-1 p-2 rounded-md border-2 border-black focus:outline-none focus:border-blue-500"
              {...register("date", { required: true })}
            />
            <input id="totalAmount" />
          </div>
          {/* Catagory Input */}
          <div>
            <Dropdown
              options={EXPENSE_TYPE_ENUM}
              label="Category"
              {...register("type", { required: true })}
            />
          </div>

          {/* <!-- Split Status Checkbox --> */}
          <div className="flex items-center">
            <Input
              label="Split?"
              type="checkbox"
              class="h-4 w-4 text-blue-600 rounded border-black focus:ring-blue-500"
              onChange={setSplitStatus((e) => e.target.checked)}
            />
          </div>
          {/* If Bill is splited */}
          {splitStatus === true && (
            <div>
              <div className="bg-neutral-400 border-2">
                <label className="">Split Mode</label>
                <select onchange={(e) => setSplitMode(e.target.value)}>
                  <option value="equal">Split Equally</option>
                  <option value="exact">Split Exact</option>
                </select>
              </div>
              {/* <!-- Members Dropdown --> */}
              <div class="flex flex-col">
                <label className="">Split With</label>
                <select
                  className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                  onchange={(e) => handleIdSelect(e.target.value)}
                >
                  {allIds?.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {shares.map(({ id, amount, paid }, index) => (
                  <div key={index}>
                    <input
                      {...register(`shares.${index}.id`, {
                        required: true,
                        defalutValues: id,
                      })}
                    />
                    <input
                      {...register(`shares.${index}.amount`, {
                        defalutValues: amount,
                      })}
                      onchange={(e) =>
                        handleAmountChange(index, e.target, value)
                      }
                    />
                    <input
                      {...register(`shares.${index}.paid`, {
                        defalutValues: paid !== null ? paid : false,
                      })}
                    />

                    <button type="button" onClick={() => handleIdRemove(id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <!-- Submit Button --> */}
          <button
            type="submit"
            class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ExpenseForm;
