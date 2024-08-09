import React from "react";

import { Container } from "../../components";

function HomePage(props) {
  return (
    <>
      <Container>
        <div class="mx-1 grid grid-cols-2 border-b-2 border-gray-400">
          <div class="w-fit px-2 text-center text-2xl text-black">
            DashBoard
          </div>
          <div class="mr-5 flex h-7 justify-end">
            <button
              type="button"
              class="mt-1 h-6 w-fit rounded-lg bg-orange-500 px-2 text-center text-sm text-white"
            >
              Add Expnense
            </button>
          </div>
        </div>
        <div class="grid grid-cols-3 border-b-2 border-gray-400 py-2 text-center">
          <div class="border-r-2 border-gray-300 text-sm text-gray-500">
            total Balance
            <div class="text-xs text-green-500">amount</div>
          </div>
          <div class="border-r-2 border-gray-300 text-sm text-gray-500">
            you owe
            <div class="text-xs text-red-500">amount</div>
          </div>
          <div class="text-sm text-gray-500">
            you are owed
            <div class="text-xs text-green-500">amount</div>
          </div>
        </div>
        <div class="grid grid-cols-2 border-b-2 border-gray-400 py-2 text-center text-gray-500">
          <div class="border-r-2 border-gray-300 text-lg">
            you owe
            <div class="px-3 pt-2">
              <ul class="space-y-1">
                <li class="rounded-lg bg-slate-100">card1</li>
                <li class="rounded-lg bg-slate-100">card2</li>
              </ul>
            </div>
          </div>
          <div class="text-lg">
            you are owed
            <div class="px-3 pt-2">
              <ul class="space-y-1">
                <li class="rounded-lg bg-slate-100">card3</li>
                <li class="rounded-lg bg-slate-100">card4</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default HomePage;
