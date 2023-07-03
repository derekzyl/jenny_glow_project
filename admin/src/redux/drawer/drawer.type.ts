import { createSlice } from "@reduxjs/toolkit";
import { DrawerI } from "./drawer.interface";

const drawerInitialState: DrawerI = {
  open: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState: drawerInitialState,
  reducers: {
    openDrawer: (state) => {
      state.open = !state.open;
    },
  },
});

export const { openDrawer } = drawerSlice.actions;
export const drawerReducer = drawerSlice.reducer;
