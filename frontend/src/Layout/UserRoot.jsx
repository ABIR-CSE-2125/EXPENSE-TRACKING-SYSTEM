import React from "react";
import { Header, Footer, SideBar } from "../components";
import { Outlet } from "react-router-dom";
function UserRoot(props) {
  return (
    <>
      <Header />
      <div className="my-2 grid h-screen w-full gap-0 bg-stone-200 px-1 sm:grid-cols-12">
        <div className="mx-1 h-full bg-red-400 sm:col-span-3">
          <SideBar />
        </div>
        <div className="h-full sm:col-span-9">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserRoot;
