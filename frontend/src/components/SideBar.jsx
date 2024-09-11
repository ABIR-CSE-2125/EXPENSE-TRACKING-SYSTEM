import React, { useEffect } from "react";
import { useState } from "react";
import { getFriendsService, getGroupsService } from "../Services/userServices";
function SideBar(props) {
  const [friends, setFreinds] = useState([]);
  const [groups, setGroups] = useState([]);

  const init = async () => {
    const friendsList = await getFriendsService();
    const groupList = await getGroupsService();
    setFreinds([...friendsList]);
    setGroups([...groupList]);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="mx-1">
        <div className="my-4 h-fit max-h-full w-full p-4">
          <ul className="space-y-2">
            <li className="bg-gray-600 py-1 px-1 rounded text-white font-semibold hover:bg-gray-400 my-1 text-center">
              Dashboard
            </li>
            <li className="bg-gray-600 py-1 px-1 rounded text-white font-semibold hover:bg-gray-400 my-1 text-center">
              Recent Activities
            </li>
          </ul>
        </div>

        <div className="my-4 h-fit max-h-full w-full bg-gray-300 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold text-black ml-1">Friends</p>
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              +
            </button>
          </div>
          <ul className="space-y-2">
            {friends.length > 0 &&
              friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex justify-between items-center bg-gray-400 px-4 py-2 rounded text-white hover:bg-white hover:text-black"
                >
                  <div>{friend.firstName}</div>
                  <button
                    type="submit"
                    className="bg-gray-500 px-2 py-1 rounded hover:bg-rose-700 text-white"
                  >
                    -
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="my-4 h-fit max-h-full w-full bg-gray-300 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold text-black ml-1">Groups</p>
            <button
              type="submit"
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-emerald-600"
            >
              +
            </button>
          </div>
          <ul className="space-y-2">
            {groups.length > 0 &&
              groups.map((group) => (
                <li
                  key={group.id}
                  className="flex justify-between items-center bg-gray-400 px-4 py-2 rounded text-white  hover:bg-white hover:text-black"
                >
                  <div>{group.groupName}</div>
                  <button
                    type="submit"
                    className="bg-gray-500 px-2 py-1 rounded hover:bg-rose-700 text-white"
                  >
                    -
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBar;
