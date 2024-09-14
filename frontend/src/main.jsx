import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ExpenseForm,
  FriendCard,
  GroupCard,
  FriendForm,
  GroupForm,
  Login,
  SignUp,
} from "./components";
import { PersistGate } from "redux-persist/integration/react";
import HomePage from "./pages/Dashboard/HomePage";
import UserRoot from "./Layout/UserRoot";
import AuthRoot from "./Layout/AuthRoot";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import ExpenseCard from "./components/ExpenseCard";
import ConfirmRemove from "./components/ConfirmRemove";
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
        element: <FriendCard />,
      },
      {
        path: "friend/add",
        element: <FriendForm />,
      },
      {
        path: "friend/remove/:id",
        element: <ConfirmRemove entity="Friend" />,
      },
      {
        path: "group/:group-id",
        element: <GroupCard />,
      },
      {
        path: "group/add",
        element: <GroupForm />,
      },
      {
        path: "group/remove/:id",
        element: <ConfirmRemove entity="Group" />,
      },
      {},
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
  {
    path: "/expense",
    element: <UserRoot />,
    children: [
      {
        path: "add",
        element: <ExpenseForm />,
      },
      {
        path: ":expense_id",
        element: <ExpenseCard />,
      },
    ],
  },
];
const router = createBrowserRouter(routes, { basename: "/app" });
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
