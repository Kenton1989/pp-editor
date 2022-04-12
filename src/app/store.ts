import { configureStore } from "@reduxjs/toolkit";
import blocksSlice from "../models/blocks";

export const store = configureStore({
  reducer: {
    [blocksSlice.name]: blocksSlice.reducer,
  },
});
