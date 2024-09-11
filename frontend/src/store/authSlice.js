import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  recent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.recent = false;
      console.log("in store login", action.payload);
      state.userData = action.payload;
      console.log("User Data : ", state.userData);
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.recent = false;
    },
    getRecent: (state) => {
      state.recent = true;
    },
    offRecent: (state) => {
      state.recent = false;
    },
  },
});

export const { login, logout, getRecent, offRecent } = authSlice.actions;

export default authSlice.reducer;
