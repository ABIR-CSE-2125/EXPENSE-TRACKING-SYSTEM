import React, { useState } from "react";
import Input from "./Input";
import { addFriendsService } from "../Services/userServices";
import { useNavigate } from "react-router-dom";

function FriendForm(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const changeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addFriendsService({ email });
    console.log(response);
    navigate("/");
    window.location.reload();
  };
  const onCancel = () => {
    navigate("/");
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Add New Friend
        </h2>

        <div className="space-y-5">
          <Input
            label="Email: "
            placeholder="Enter your email"
            type="email"
            eventHandler={changeEmail}
            className="w-full"
          />

          <div className="flex space-x-4">
            {/* Cancel Button */}
            <button
              type="button"
              className="flex-1 py-3 px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition duration-300 ease-in-out"
              onClick={onCancel}
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 ease-in-out"
            >
              Add Friend
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Make sure your friend's email is valid before submitting.
        </p>
      </form>
    </>
  );
}

export default FriendForm;
