import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Friend, Group, Login, SignUp } from "./components";
import HomePage from "./pages/Dashboard/HomePage";
import UserRoot from "./Layout/UserRoot";
import AuthRoot from "./Layout/AuthRoot";
import { Provider } from "react-redux";
import store from "./store/store";
const routes = [
  {
    path: "/",
    element: <UserRoot />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "friend/:friend-id",
        element: <Friend />,
      },
      {
        path: "group/:group-id",
        element: <Group />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthRoot />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  //form routes not defined here. as they demand page refresh
];
const router = createBrowserRouter(routes, { basename: "/app" });
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
