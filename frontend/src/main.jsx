import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Friend, Group } from "./components";
const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
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
  //form routes not defined here. as they demand page refresh
];
const router = createBrowserRouter(routes, { basename: "/app" });
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
