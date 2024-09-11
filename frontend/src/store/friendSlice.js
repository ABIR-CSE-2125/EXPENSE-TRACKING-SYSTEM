import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  friendData: null,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    set: (state, action) => {
      state.status = true;
      console.log("in set friend", action.payload);
      state.friendData = action.payload;
    },
    reset: (state) => {
      state.status = false;
      state.friendData = null;
    },
  },
});

export const { set, reset } = friendSlice.actions;

export default friendSlice.reducer;
