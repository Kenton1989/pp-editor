import { configureStore } from "@reduxjs/toolkit";
import levelSlice from "../models/edit-level";

export const store = configureStore({
  reducer: {
    [levelSlice.name]: levelSlice.reducer,
  },
});
