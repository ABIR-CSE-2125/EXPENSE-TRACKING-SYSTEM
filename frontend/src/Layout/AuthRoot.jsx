import React from "react";
import { Outlet } from "react-router-dom";
function AuthRoot(props) {
  return (
    <div className="mt-20">
      <Outlet />
    </div>
  );
}

export default AuthRoot;
