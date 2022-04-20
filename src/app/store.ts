import { configureStore } from "@reduxjs/toolkit";
import levelSlice from "../models/edit-level";
import uiSlice from "../models/edit-ui/slice";
import undoable from "redux-undo";

export const store = configureStore({
  reducer: {
    [levelSlice.name]: undoable(levelSlice.reducer, { limit: 500 }),
    [uiSlice.name]: uiSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
