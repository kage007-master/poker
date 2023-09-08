import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import modalReducer from "./modal.slice";
import pokerReducer from "./poker.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    poker: pokerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
