import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  groupData: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    set: (state, action) => {
      state.status = true;
      console.log("in set group", action.payload);
      state.groupData = action.payload;
    },
    reset: (state) => {
      state.status = false;
      state.groupData = null;
    },
  },
});

export const { set, reset } = groupSlice.actions;

export default groupSlice.reducer;
