import { configureStore } from "@reduxjs/toolkit";
import { drawerReducer } from "./drawer/drawer.type";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
