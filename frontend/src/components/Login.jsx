import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as storeLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginService } from "../Services/authServices";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");

  const changeEmail = (event) => {
    setEamil(event.target.value);
  };
  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  // const state = useSelector((state) => state);
  const login = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError("");
    // console.log("Inside the login ");
    try {
      // console.log("email : ", email);
      // console.log("password : ", password);

      const userData = await loginService({ email, password });
      console.log("User Data ", userData);

      if (userData) {
        // console.log("inside store");
        dispatch(storeLogin(userData));
        // console.log("after dispatch : \n", state);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/auth/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={login} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              eventHandler={changeEmail}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              eventHandler={changePassword}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
