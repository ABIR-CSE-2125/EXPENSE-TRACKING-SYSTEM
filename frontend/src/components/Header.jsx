import React from "react";

function Header() {
  return (
    <div>
      <div class="mt-1 grid h-10 w-full gap-2 bg-slate-200 sm:grid-cols-12">
        <div class="mx-1 h-10 bg-yellow-300 sm:col-span-9 text-4xl text-left text-black">
          ETS
        </div>
        <div class=" flex mx-1 h-10 bg-green-300 sm:col-span-3 align-middle">
          <div class="bg-green-800 h-fit w-16 m-auto text-white text-center">
            Proflie
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
