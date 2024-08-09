import React from "react";

function Card({ relation, friendName, amount }) {
  return (
    <>
      <div class="items-left m-1 flex max-w-2xl flex-col rounded-md border md:flex-row  w-full">
        <div>
          <div class="p-4">
            <h1 class="inline-flex w-fit items-center text-lg font-semibold">
              {friendName}
            </h1>
            <br />
            <div class="inline-flex">
              {relation === "owes" ? (
                <p class="mt-3 text-sm text-gray-600">owes You :</p>
              ) : (
                <p class="mt-3 text-sm text-gray-600">You owe :</p>
              )}
              <p class="mt-3 text-sm text-gray-600">{amount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
