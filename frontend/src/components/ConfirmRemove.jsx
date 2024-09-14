import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  removeFriendsService,
  removeGroupsService,
} from "../Services/userServices";

function ConfirmRemove({ entity }) {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!entity) throw new Error("Not a valid url : entity not found");
  console.log("Remove", entity);
  console.log("From remove confirm ", id);

  const confirm = async () => {
    let res = null;
    switch (entity) {
      case "Friend":
        res = await removeFriendsService({ friendId: id });
        break;
      case "Group":
        res = await removeGroupsService({ groupId: id });
        break;
      case "Expense":
        break;
      case "User":
        break;
      default:
        break;
    }
    console.log(res);
    navigate("/");
    // window.location.reload();
  };

  const cancel = () => {
    navigate("/");
  };
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Remove {entity}?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={confirm}
            className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300"
          >
            OK
          </button>
          <button
            type="button"
            onClick={cancel}
            className="bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmRemove;
