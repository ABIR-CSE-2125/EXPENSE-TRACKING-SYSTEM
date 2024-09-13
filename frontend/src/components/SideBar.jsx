import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { getFriendsService, getGroupsService } from "../Services/userServices";
import { set as setFriend, reset as resetFriend } from "../store/friendSlice";
import { set as setGroup, reset as resetGroup } from "../store/groupSlice";
import { getRecent as recent, offRecent } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
function SideBar(props) {
  const dispatch = useDispatch();
  const [friends, setFreinds] = useState([]);
  const [groups, setGroups] = useState([]);

  const init = useCallback(async () => {
    const friendsList = await getFriendsService();
    const groupList = await getGroupsService();
    setFreinds([...friendsList]);
    setGroups([...groupList]);
  }, []);

  const setCommonDashboard = () => {
    dispatch(resetFriend());
    dispatch(resetGroup());
    dispatch(offRecent());
  };

  const setFriendDashborad = (userData) => {
    dispatch(setFriend(userData));
    dispatch(resetGroup());
    dispatch(offRecent());
  };
  const setGroupDashborad = (userData) => {
    dispatch(resetFriend());
    dispatch(setGroup(userData));
    dispatch(offRecent());
  };
  const setRecentDashborad = () => {
    dispatch(resetFriend());
    dispatch(resetGroup());
    dispatch(recent());
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="mx-1">
        <div className="my-4 h-fit max-h-full w-full p-4">
          <ul className="space-y-2">
            <Link to="/">
              <li
                className="bg-gray-600 py-1 px-1 rounded text-white font-semibold hover:bg-gray-400 my-1 text-center"
                onClick={() => setCommonDashboard()}
              >
                Dashboard
              </li>
            </Link>
            <Link to="/">
              <li
                className="bg-gray-600 py-1 px-1 rounded text-white font-semibold hover:bg-gray-400 my-1 text-center"
                onClick={() => setRecentDashborad()}
              >
                Recent Activities
              </li>
            </Link>
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
                  onClick={() => setFriendDashborad(friend)}
                >
                  <Link to="/">
                    <div>{friend.firstName}</div>
                  </Link>
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
                  onClick={() => setGroupDashborad(group)}
                >
                  <Link to="/">
                    <div>{group.groupName}</div>
                  </Link>
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
