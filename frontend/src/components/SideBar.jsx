import React from "react";

function SideBar(props) {
  return (
    <>
      <div className="my-1 h-fit max-h-full w-full bg-teal-300 py-1 text-center text-base text-white">
        <ul>
          <li className="my-px bg-teal-700 py-0.5">dashboard</li>
          <li className="my-px bg-teal-700 py-0.5">recent activities</li>
        </ul>
      </div>
      <div className="my-1 h-fit max-h-full w-full bg-teal-300 py-1 text-center text-white">
        <ul>
          <li className="my-px bg-gray-500 py-0.5">add freinds</li>
          <li className="my-px bg-teal-700 py-0.5">freind1</li>
          <li className="my-px bg-teal-700 py-0.5">freind2</li>
        </ul>
      </div>
      <div className="my-1 h-fit text-white max-h-full w-full bg-teal-300 py-1 text-center">
        <ul>
          <li className="my-px bg-gray-500 py-0.5">add groups</li>
          <li className="my-px bg-teal-700 py-0.5">group1</li>
          <li className="my-px bg-teal-700 py-0.5">group2</li>
        </ul>
      </div>
    </>
  );
}

export default SideBar;
