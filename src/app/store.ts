import { configureStore } from "@reduxjs/toolkit";
import blocksSlice from "../models/edit-level";

export const store = configureStore({
  reducer: {
    [blocksSlice.name]: blocksSlice.reducer,
  },
});
