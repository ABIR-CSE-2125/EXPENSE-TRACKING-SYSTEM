import React from "react";
import { useSelector } from "react-redux";
import { Container } from "../../components";

function HomePage(props) {
  const UserData = useSelector((state) => state.userData);
  console.log("IN home check : ", UserData);

  return (
    <>
      <Container>
        <div className="mx-1 grid grid-cols-2 border-b-2 border-gray-400">
          <div className="w-fit px-2 text-center text-2xl text-black">
            DashBoard
          </div>
          <div className="mr-5 flex h-7 justify-end">
            <button
              type="button"
              className="mt-1 h-6 w-fit rounded-lg bg-orange-500 px-2 text-center text-sm text-white"
            >
              Add Expnense
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 border-b-2 border-gray-400 py-2 text-center">
          <div className="border-r-2 border-gray-300 text-sm text-gray-500">
            total Balance
            <div className="text-xs text-green-500">amount</div>
          </div>
          <div className="border-r-2 border-gray-300 text-sm text-gray-500">
            you owe
            <div className="text-xs text-red-500">amount</div>
          </div>
          <div className="text-sm text-gray-500">
            you are owed
            <div className="text-xs text-green-500">amount</div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-b-2 border-gray-400 py-2 text-center text-gray-500">
          <div className="border-r-2 border-gray-300 text-lg">
            you owe
            <div className="px-3 pt-2">
              <ul className="space-y-1">
                <li className="rounded-lg bg-slate-100">card1</li>
                <li className="rounded-lg bg-slate-100">card2</li>
              </ul>
            </div>
          </div>
          <div className="text-lg">
            you are owed
            <div className="px-3 pt-2">
              <ul className="space-y-1">
                <li className="rounded-lg bg-slate-100">card3</li>
                <li className="rounded-lg bg-slate-100">card4</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default HomePage;
