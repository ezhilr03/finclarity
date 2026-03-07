import { configureStore } from "@reduxjs/toolkit";
import financialReducer from "./slices/financialSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    financial: financialReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
