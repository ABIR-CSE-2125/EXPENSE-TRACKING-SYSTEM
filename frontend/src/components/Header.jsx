import React from "react";

function Header() {
  return (
    <div>
      <div className="mt-1 grid h-10 w-full gap-2 bg-gray-300 sm:grid-cols-12">
        <div className="mx-1 h-10 bg-gray-300 sm:col-span-9 text-4xl text-left text-black">
          ETS
        </div>
        <div className=" flex mx-1 h-10 bg-gray-300 sm:col-span-3 align-middle">
          <div className="bg-gray-600 h-fit w-16 m-auto text-white text-center">
            Proflie
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
