import React from "react";
import { Header, Footer, SideBar } from "./components";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
function Root(props) {
  return (
    <>
      <Header />
      <div class="my-2 grid h-screen w-full gap-0 bg-stone-200 px-1 sm:grid-cols-12">
        <div class="mx-1 h-full bg-red-400 sm:col-span-3">
          <SideBar />
        </div>
        <div class="mx-1 h-full bg-cyan-400 sm:col-span-9">
          <Outlet />
        </div>
      </div>
      <Outlet />
      <Footer />
    </>
  );
}

export default Root;
