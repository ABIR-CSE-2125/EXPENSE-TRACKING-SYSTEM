import React from "react";
import { Header, Footer, SideBar } from "../components";
import { Outlet } from "react-router-dom";
function UserRoot(props) {
  return (
    <>
      <Header />
      <div className="grid min-h-screen w-full grid-cols-12 gap-4 bg-gray-100">
        {/* Sidebar */}
        <aside className="col-span-12 sm:col-span-3 bg-white shadow-lg h-full py-6 px-4">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="col-span-12 sm:col-span-9 h-full p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      {/* Uncomment this to display footer if needed */}
      {/* <Footer /> */}
    </>
  );
}

export default UserRoot;
