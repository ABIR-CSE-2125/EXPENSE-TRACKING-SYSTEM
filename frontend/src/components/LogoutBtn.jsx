import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutService } from "../Services/authServices";
import { logout as storeLogout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
function LogoutBtn() {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const navigate = useNavigate();

  setError("");
  const logoutHandler = async () => {
    try {
      const res = await logoutService();
      if (res) {
        dispatch(storeLogout);
        navigate("/");
      } else {
        console.error("No Response Found");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}
export default LogoutBtn;
